import { OnModuleInit, Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinBookingGroupDto } from './dto/joinBookingGroup.dto';
import { SeatService } from 'src/seatModule/seat.service';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/userModule/user.service';
import * as moment from 'moment';
import { Types } from 'mongoose';
import { TUserSelectSeating } from './types/bookingSeating.types';

export type TSelectingSeatingOnSocket = {
  restaurantId: string;
  seatId: string;
  dateTime: string;
};

@WebSocketGateway({ namespace: '/booking' })
export class BookingGateway implements OnModuleInit {
  @WebSocketServer()
  service: Server;

  private roomUsers: Map<string, Set<string>> = new Map();

  constructor(
    private readonly seatService: SeatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  async onModuleInit() {
    this.service.on('connection', async (socket: Socket) => {
      console.log(`client connected: ${socket.id}`);
      const token = socket.handshake.auth.token;
      const restaurantId = socket.handshake.query.token;
      console.log('token', token);

      if (token) {
        try {
          const user = await this.jwtService.verifyAsync(token as string);

          socket.data.userId = user.sub;
        } catch (e) {
          console.error('Invalid token:', e);
          socket.disconnect();
        }
      } else {
        socket.disconnect();
      }
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  // get restaurant seatings
  @SubscribeMessage('seatings')
  async getSeatings(
    @MessageBody() body: { restaurantId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('listen on', socket.id);

    const { restaurantId } = body;

    const seatings = await this.seatService.getSeatingsByBooking(
      new Types.ObjectId(restaurantId),
    );

    // console.log(seatings);
    this.service.to(socket.id).emit('seatings', seatings);
  }

  //   group
  @SubscribeMessage('joinBookingGroup')
  async onJoinBookingGroup(
    @MessageBody() body: JoinBookingGroupDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.data.userId || null;

    try {
      const { dateTime, restaurantId } = body;

      // Tạo bookingGroup theo seatId và dateTime
      const bookingGroup = `${restaurantId}-${new Date(dateTime).toISOString().split('T')[0]}`;
      socket.data.seatId = restaurantId; // Lưu seatId vào socket data để kiểm tra sau

      // Kiểm tra xem nhóm đã tồn tại chưa
      let existingGroup = this.roomUsers.get(bookingGroup);

      if (existingGroup && existingGroup.size > 0) {
        // Nếu nhóm đã tồn tại, lấy thời gian tham gia nhóm đầu tiên
        const firstJoinedSocketId = Array.from(existingGroup)[0]; // Lấy socket ID của người tham gia đầu tiên
        const firstJoinedSocket = this.getClientsInRoom(bookingGroup).find(
          (s) => s.id === firstJoinedSocketId,
        );
        const firstJoinedTime = moment(firstJoinedSocket?.data?.joinedTime); // Lấy thời gian tham gia

        const currentTime = moment(dateTime); // Thời gian người dùng tham gia

        // Kiểm tra xem thời gian tham gia có trong vòng 4 giờ không
        const timeDifference = currentTime.diff(firstJoinedTime, 'hours', true); // Sự khác biệt thời gian tính theo giờ

        if (timeDifference <= 4) {
          // Nếu thời gian trong vòng 4 giờ, cho phép tham gia nhóm
          socket.join(bookingGroup);
          console.log(
            `Client ${socket.id} joined existing booking group: ${bookingGroup}`,
          );
          this.addUserToRoom(bookingGroup, socket.id);
        } else {
          // Nếu ngoài 4 giờ, tạo nhóm mới
          const newGroup = `${restaurantId}-${moment().toISOString().split('T')[0]}`;
          socket.join(newGroup);
          console.log(
            `Client ${socket.id} joined a new booking group: ${newGroup}`,
          );
          this.addUserToRoom(newGroup, socket.id);
        }
      } else {
        // Nếu nhóm chưa tồn tại, tạo nhóm mới
        socket.join(bookingGroup);
        console.log(
          `Client ${socket.id} created and joined new booking group: ${bookingGroup}`,
        );
        this.addUserToRoom(bookingGroup, socket.id);
      }

      // Cập nhật thời gian tham gia vào dữ liệu socket
      socket.data.joinedTime = moment().toISOString();

      // Gửi danh sách userIds về cho client vừa kết nối
      const userIds = Array.from(this.roomUsers.get(bookingGroup) || []);
      console.log(`Current users in group ${bookingGroup}:`, userIds);
      console.log(this.roomUsers);

      socket.emit('joinedGroup', { bookingGroup, userIds });
    } catch (error) {
      console.error('Error in onJoinBookingGroup:', error.message, error.stack);
    }
  }

  private getClientsInRoom(roomName: string): Socket[] {
    const clients: Socket[] = [];

    const room = this.service.sockets.adapter?.rooms.get(roomName);
    if (!room) return clients;

    for (const clientId of room) {
      const clientSocket = this.service.sockets.sockets.get(clientId);
      if (clientSocket) {
        clients.push(clientSocket);
      }
    }

    return clients;
  }

  private addUserToRoom(room: string, socketId: string) {
    if (!this.roomUsers.has(room)) {
      this.roomUsers.set(room, new Set<string>());
    }
    this.roomUsers.get(room).add(socketId);
  }

  private removeUserFromRoom(roomName: string, userId: string) {
    const users = this.roomUsers.get(roomName);
    if (users) {
      users.delete(userId);
      if (users.size === 0) {
        this.roomUsers.delete(roomName);
      }
    }
  }

  //   client disconnect
  private handleDisconnect(socket: Socket) {
    const userId = socket.id;
    console.log('disconnect userId booking', userId);

    for (const [roomName, users] of this.roomUsers.entries()) {
      if (users.has(userId)) {
        this.removeUserFromRoom(roomName, userId);
        console.log(`Client ${userId} removed from room: ${roomName}`);
      }
    }
  }

  //   on user selecting seating
  @SubscribeMessage('onSelectingSeating')
  async onSelectingSeating(
    @MessageBody() body: TSelectingSeatingOnSocket,
    @ConnectedSocket() socket: Socket,
  ) {
    const userId = socket.data.userId;
    console.log(userId);

    const { dateTime, restaurantId, seatId } = body;
    try {
      const { seat } = await this.userService.selectSeating(userId, {
        dateTime: dateTime,
        restaurantId: restaurantId,
        seatId: seatId,
      });
      const seatings = await this.seatService.getSeatingsByBooking(
        new Types.ObjectId(restaurantId),
      );
  
      // console.log('selectedasd', seat);

      // seat &&
      //   this.emitToGroupExcluding(socket, 'onSeatSelected', {
      //     success: true,
      //     seat,
      //   });

      let bookingGroup = '';
      for (const [group, users] of this.roomUsers.entries()) {
        if (users.has(socket.id)) {
          bookingGroup = group;
          break;
        }
      }

      // Gửi thông tin ghế đã chọn đến tất cả các client trong nhóm
      if (bookingGroup) {
        this.service.to(bookingGroup).emit('onSeatSelected', {
          success: true,
          seatings,
        });
      }
    } catch (error) {
      console.log('error to selecting', error.response);
      this.service.to(socket.id).emit('onSeatSelected', {
        success: false,
        error: error.message,
        status: error.status,
      });
    }
  }

  emitToGroupExcluding(socket: Socket, event: string, data: any) {
    let bookingGroup = '';

    // Tìm group của socket hiện tại
    for (const [group, users] of this.roomUsers.entries()) {
      if (users.has(socket.id)) {
        bookingGroup = group;
        break;
      }
    }

    if (bookingGroup) {
      // Gửi thông điệp tới tất cả trừ người gửi
      socket.to(bookingGroup).emit(event, data);
    } else {
      console.error(`Booking group not found for socketId: ${socket.id}`);
    }
  }

  //   on remove selecting seating by system
  @SubscribeMessage('onSystemRemoveSelectingSeating')
  onSystemRemoveSelectingSeating(
    @MessageBody()
    body: {
      seatId: string;
      userSelectingId: string;
      selectingId: string;
    },
  ) {}

  @SubscribeMessage('onUserRemovePrevSelected')
  onUserRemovePrevSelectedSeating(
    @MessageBody() body: TUserSelectSeating,
    @ConnectedSocket() socket: Socket,
  ) {
    this.emitToGroupExcluding(socket, 'onOtherUserRemove', body);
  }
}

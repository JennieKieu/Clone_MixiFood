import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TFood, TPendingOrder } from './dto/restaurantManage.types';
import { KitchenChangeStatusOrderItemDto } from 'src/EmployeeModule/dto/kitchenChangeOrderItemStatusDto';
import { foodStatus, Order } from 'src/orderModule/shemas/order.schemas';
import { InvoiceDocument } from 'src/invoiceModule/schemas/invoice.shema';
import { Document, Types } from 'mongoose';

@WebSocketGateway()
export class SocketGateWay implements OnModuleInit {
  @WebSocketServer()
  service: Server;

  onModuleInit() {
    this.service.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');

      socket.on('joinRestaurant', (restaurantId: string) => {
        socket.join(restaurantId);
        console.log(`user ${socket.id} joined restaurant ${restaurantId}`);
      });
    });
  }

  @SubscribeMessage('sendMessageToRestaurant')
  onSendMessageToRestaurant(
    @MessageBody() body: { restaurantId: string; message: string },
  ) {
    const { restaurantId, message } = body;
    console.log(restaurantId);

    this.service.to(restaurantId).emit('receiveMessage', {
      msg: 'Message to restaurant',
      content: message,
    });
    console.log(`Message sent to restaurant ${restaurantId}`);
  }

  // when restaurant add food
  @SubscribeMessage('upadtedFood')
  onUpdateFood(@MessageBody() dto: any) {
    const restaurantId = dto.restaurantId.toString();
    this.service.to(restaurantId).emit('receiveAddFoodsMenu', dto);
    // console.log('dto', dto);
  }

  // delete food
  @SubscribeMessage('deleteFood')
  onDeleteFood(@MessageBody() data: string[], restaurantId: string) {
    this.service.to(restaurantId).emit('deletefoods', data);
  }

  // order food
  @SubscribeMessage('employeeOrder')
  onEmployeeOrder(@MessageBody() data: any, restaurantId: string) {
    this.service.to(restaurantId).emit('onEmployeeNewOrder', data);
    console.log(data);
  }

  // orderId on seat
  @SubscribeMessage('onSeatOrderId')
  onSetOrderIdAtSeat(@MessageBody() data: any, restaurantId: string) {
    this.service.to(restaurantId).emit('onEmployeeOrderAtSeat', data);
    console.log(data);
  }

  // kitchen change status on orderId
  @SubscribeMessage('onKitchenChangeOrderItemStatus')
  onKitchenChangeOrderItemStatus(
    @MessageBody()
    data: { orderId: string; foodItemId: string; status: foodStatus },
    restaurantId: string,
  ) {
    this.service.to(restaurantId).emit('onKitchenChangeOrderStatus', data);
    console.log(data);
  }

  // kitchen change Status orderItem -> order on serve
  @SubscribeMessage('onKitchenChangeOrderItemStatusToServe')
  onKitchenChangeOrderItemStatusToServe(
    @MessageBody() data: Order,
    restaurantId: string,
  ) {
    this.service
      .to(restaurantId)
      .emit('onKitchenChangeOrderStatusToServe', data);
  }

  // create many seat
  @SubscribeMessage('onCreateManySeat')
  onCreateManySeat(restaurantId: string, @MessageBody() data: any) {
    this.service.to(restaurantId).emit('onCreateManySeat', data);
  }

  // server send invoice. cash payment
  @SubscribeMessage('onServeSendInvoiceCashpayment')
  onServeSendInvoiceCashpayment(
    restaurantId: string,
    @MessageBody()
    data: Document<unknown, {}, InvoiceDocument> &
      InvoiceDocument & {
        _id: Types.ObjectId;
      },
  ) {
    this.service.to(restaurantId).emit('onServeSendInvoiceCashpayment', data);
  }

  // on seat change
  @SubscribeMessage('onSeatChange')
  onSeatChange(restaurantId: string, @MessageBody() data: any) {
    this.service.to(restaurantId).emit('onSeatChange', data);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.service.emit('onMessage', {
      msg: 'new message',
      content: body,
    });
  }

  // paymemtding
  @SubscribeMessage('joinToWaitPayment')
  onJoinToWaitPayment(
    @MessageBody() body: { orderId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { orderId } = body;

    const roomName = `${orderId}_WaitPayment`;
    const rooms = Array.from(socket.rooms); // Lấy danh sách các phòng mà socket đã tham gia
    if (!rooms.includes(roomName)) {
      socket.join(roomName);
      console.log(`User ${socket.id} joined WaitPayment group for ${orderId}`);
    } else {
      console.log(
        `User ${socket.id} is already in the WaitPayment group for ${orderId}`,
      );
    }
    // socket.join(roomName);
    // console.log(`User ${socket.id} joined WaitPayment group for ${orderId}`);
  }

  @SubscribeMessage('notifyWaitPaymentGroup')
  onNotifyWaitPaymentGroup(
    @MessageBody() body: { orderId: string; message: string },
  ) {
    const { orderId, message } = body;
    const roomName = `${orderId}_WaitPayment`;

    this.service.to(roomName).emit('onPaymentNotification', {
      msg: 'Payment notification',
      content: message,
    });
    console.log(
      `Notification sent to WaitPayment group for ${orderId}: ${message}`,
    );
  }

  @SubscribeMessage('leaveWaitPayment')
  onLeaveWaitPayment(
    @MessageBody() body: { orderId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { orderId } = body;

    socket.leave(`${orderId}_WaitPayment`);
    console.log(
      `User ${socket.id} left WaitPayment group for invoice ${orderId}`,
    );
  }
}

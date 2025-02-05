import {io, Socket} from 'socket.io-client';
import {SOCKET_BOOKING_URL} from '../../constants';
import {
  TSeatingByBooking,
  TSelectSeatByBooking,
  TSelectSeatingByUser,
} from '../../models/UserModel';

export type TJoinBookingGroupData = {
  restaurantId: string;
  dateTime: string; // Dạng "YYYY-MM-DDTHH:mm:ss" (ISO 8601)
};

class BookingSocketClient {
  static getSocket() {
    throw new Error('Method not implemented.');
  }
  private static instance: BookingSocketClient | null = null;
  private socket: Socket | null = null;

  constructor(token?: string) {
    this.socket = io(
      SOCKET_BOOKING_URL,
      // {auth: {token}},
      //   {transports: ['websocket']}
    );
    this.socket = null;
  }

  connect(token: string) {
    console.log('socektt', this.socket);
    if (!this.socket) {
      this.socket = io(SOCKET_BOOKING_URL, {
        auth: {token},
      });
      // this.socket = io(SOCKET_BOOKING_URL, {
      //   query: {token},
      // });
    }
    return this.socket;
  }

  public static getInstance(): BookingSocketClient {
    if (!this.instance) {
      this.instance = new BookingSocketClient();
    }
    return this.instance;
  }

  joinBookingGroup(data: TJoinBookingGroupData) {
    return this.socket && this.socket?.emit('joinBookingGroup', data);
  }

  getSeatings(data: {restaurantId: string}) {
    return this.socket && this.socket.emit('seatings', data);
  }

  onSelectSeating(data: TSelectSeatingByUser) {
    return this.socket?.emit('onSelectingSeating', data);
  }

  onRemoveSelectedSeating(data: TSeatingByBooking) {
    return this.socket?.emit('onUserRemovePrevSelected', data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      // this.socket.close();
      this.socket = null;
    }
    console.log('discconnect');
  }

  //   join group
  getSocket() {
    // if (!this.socket) {
    //   this.connect();
    // }
    return this.socket;
  }
}

const bookingSocketClient = BookingSocketClient.getInstance();
export default bookingSocketClient;

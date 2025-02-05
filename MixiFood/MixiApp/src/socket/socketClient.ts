import {io, Socket} from 'socket.io-client';
import {SOCKET_BASE_URL} from '../constants';
import {TFood} from '../models/food';

// export let socket;

export type TJoinWaitingpayment = {
  orderId: string;
};

export class SocketClient {
  static getSocket() {
    throw new Error('Method not implemented.');
  }
  private static instance: SocketClient | null = null;
  private socket: Socket | null = null;
  //   private socket: Socket;

  constructor() {
    this.socket = io(
      SOCKET_BASE_URL,
      //   {transports: ['websocket']}
    );
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_BASE_URL);
    }
    return this.socket;
  }

  public static getInstance(): SocketClient {
    if (!this.instance) {
      this.instance = new SocketClient();
    }
    return this.instance;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.close();
      this.socket = null;
    }
    console.log('discconnect');
  }

  joinRestaurant(restaurantId: string) {
    return this.socket && this.socket.emit('joinRestaurant', restaurantId);
  }

  joinWaitingPayment(data: TJoinWaitingpayment) {
    return this.socket && this.socket.emit('joinToWaitPayment', data);
  }

  leaveWaitingPayment(data: TJoinWaitingpayment) {
    return this.socket && this.socket.emit('leaveWaitPayment', data);
  }

  receiveMessage() {
    return (
      this.socket &&
      this.socket.on('receiveMessage', (data: any) => {
        // console.log(data);
      })
    );
  }

  sendUpadtedFood(data: TFood, restaurantId: string) {
    const dataTo = {
      ...data,
      restaurantId,
    };
    return this.socket && this.socket.emit('upadtedFood', dataTo);
  }

  getSocket() {
    // if (!this.socket) {
    //   this.connect();
    // }
    return this.socket;
  }
}

const socketClient = SocketClient.getInstance();
export default socketClient;

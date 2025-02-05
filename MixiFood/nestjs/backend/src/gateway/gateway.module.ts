import { forwardRef, Module } from '@nestjs/common';
import { SocketGateWay } from './gatewat.socketGateway';
import { BookingGateway } from './booking.socket';
import { SeatModule } from 'src/seatModule/seat.module';
import { UserModule } from 'src/userModule/user.module';

@Module({
  imports: [forwardRef(() => SeatModule), forwardRef(() => UserModule)],
  providers: [SocketGateWay, BookingGateway],
  exports: [SocketGateWay, BookingGateway],
})
export class GatewayModule {}

import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { PlanModule } from 'src/plan/plan.module';

@Module({
  imports: [PlanModule, ConfigModule.forRoot()],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

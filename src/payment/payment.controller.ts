import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthedUser } from 'src/decorator/authed-user.decorator.ts';
import { User } from 'src/user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('plan/:id')
  purchasePlan(
    @Param('id', ParseIntPipe) planId: number,
    @AuthedUser() user: User
  ): Promise<string> {
    return this.paymentService.buyPlan(planId, user);
  }
}

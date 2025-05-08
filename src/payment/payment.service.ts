import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanService } from 'src/plan/plan.service';
import { User } from 'src/user/entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly planService: PlanService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');
  }

  async buyPlan(planId: number, customer: User): Promise<string> {
    const plan = await this.planService.findOne(planId);
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      client_reference_id: customer.id.toString(),
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:
        'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    if (!session.url) {
      throw new BadRequestException('Failed to create checkout session');
    }

    return session.url;
  }
}

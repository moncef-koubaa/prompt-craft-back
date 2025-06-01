import { Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

export class PlaceBidDto {
  @Field(() => Number)
  auctionId: number;
  
  @Field(() => Number)
  @Min(1)
  amount: number;
}

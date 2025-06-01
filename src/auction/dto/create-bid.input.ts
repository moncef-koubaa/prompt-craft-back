import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class CreateBidInput {
    @Field(() => Int)
    @IsNumber()
    auctionId: number;

    @Field(() => Int)
    @IsNumber()
    bidderId: number;

    @Field(() => Int)
    @IsNumber()
    @Min(1)
    amount: number;
} 
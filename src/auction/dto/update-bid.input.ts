import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class UpdateBidInput {
    @Field(() => Int)
    @IsNumber()
    id: number;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @Min(1)
    @IsOptional()
    amount?: number;
} 
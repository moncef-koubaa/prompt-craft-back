import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateNftDto {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    description: string;

    @Field()
    @IsString()
    imageUrl: string;

    @Field(() => Int)
    @IsNumber()
    price: number;

    @Field(() => Int)
    @IsNumber()
    ownerId: number;

    @Field(() => Int)
    @IsNumber()
    creatorId: number;

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @Field(() => [Int], { nullable: true })
    @IsArray()
    @IsOptional()
    auctionIds?: number[];
    
}

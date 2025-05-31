import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { InputType, Field, Int } from '@nestjs/graphql';


export class CreateNftDto {
  @Field()
  @IsString()
  path: string;

  @Field()
  @IsNumber()
  @IsOptional()
  ownerId: number;

  @Field()
  @IsNumber()
  @IsOptional()
  creatorId: number;

  @IsString()
  @IsOptional()
  promptGeneratedBy: string = "";

  @Field(() => Int, { nullable: true })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  price: number = 0;

  @Field()
  @IsString()
  name: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : []))
  auctionIds: number[] = [];

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : false))
  isOnAuction: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : false))
  isOnSale: boolean = false;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  imageUrl: string;
}

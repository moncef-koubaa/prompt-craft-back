import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType()
export class CreateNftDto {
  @Field(() => String)
  @IsOptional()
  @IsString()
  imageUrl: string;

  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  ownerId: number;

  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  creatorId: number;

  @IsString()
  @IsOptional()
  promptGeneratedBy: string = "";

  @Field(() => Int)
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  price: number = 0;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : []))
  auctionIds: number[] = [];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : false))
  isOnAuction: boolean = false;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value : false))
  isOnSale: boolean = false;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @Field(() => String)
  @IsString()
  @IsOptional()
  description: string;
}

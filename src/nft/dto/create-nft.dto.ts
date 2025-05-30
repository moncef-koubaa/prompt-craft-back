import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateNftDto {
  @IsString()
  path: string;

  @IsNumber()
  @IsOptional()
  ownerId: number;

  @IsNumber()
  @IsOptional()
  creatorId: number;

  @IsString()
  @IsOptional()
  promptGeneratedBy: string = "";

  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  price: number = 0;

  @IsString()
  name: string;

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
}

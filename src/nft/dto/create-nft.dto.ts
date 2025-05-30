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
  ownerId: number;
  @IsNumber()
  creatorId: number;
  @IsString()
  @IsOptional()
  promptGeneratedBy: string;
  @IsNumber()
  @IsOptional()
  price: number;
  @IsString()
  name: string;
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  auctionsIds: number[];
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  auctionIds: number[];
  @IsBoolean()
  @IsOptional()
  isOnAuction: boolean;
  @IsBoolean()
  @IsOptional()
  isOnSale: boolean;
}

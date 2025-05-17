import { IsNumber, IsString, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  nftId: string;

  @IsNumber()
  ownerId: number;

  @IsNumber()
  @Min(0)
  startingPrice: number;

  @IsNumber()
  @Min(3600)
  duration: number;
}

import { IsNumber, IsString, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsNumber()
  nftId: number;

  @IsNumber()
  @Min(0)
  startingPrice: number;

  @IsNumber()
  @Min(300) // ba3d bedelha to se3a
  duration: number;
}

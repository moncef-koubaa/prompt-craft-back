import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PlaceBidDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  auctionId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  amount: number;
}

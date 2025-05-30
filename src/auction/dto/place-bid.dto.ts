import { Min } from 'class-validator';

export class PlaceBidDto {
  auctionId: number;

  @Min(1)
  amount: number;
}

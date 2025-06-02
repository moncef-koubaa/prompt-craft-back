import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Auction } from "../entities/auction.entity";

@ObjectType()
export class Metadata {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class AuctionResponse {
  @Field(() => Metadata)
  metadata: Metadata;

  @Field(() => [Auction])
  data: Auction[];
}

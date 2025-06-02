import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Nft } from "../entities/nft.entity";

@ObjectType("NFTsMetadata")
export class Metadata {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class NFTsResponse {
  @Field(() => Metadata)
  metadata: Metadata;

  @Field(() => [Nft])
  data: Nft[];
}

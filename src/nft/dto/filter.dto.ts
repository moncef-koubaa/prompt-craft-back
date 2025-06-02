import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
@InputType()
export class NftFilterDto {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  page: number = 1;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit: number = 6;

  @IsOptional()
  @Field({ nullable: true })
  search?: string;

  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  priceUpper?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  priceLower?: number;

  @IsOptional()
  @Field({ nullable: true })
  isOnSale?: boolean;

  @IsOptional()
  @Field({ nullable: true })
  isOnAuction?: boolean;
}

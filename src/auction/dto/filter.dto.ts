import { InputType, Field, Int, Float } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class FilterDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  page: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit: number = 6;

  @Field({ nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  startingPriceUpper?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  startingPriceLower?: number;

  @Field({ nullable: true })
  @IsOptional()
  isEnded?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  endTime?: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  durationUpper?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  durationLower?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  maxBidAmount?: number;
}

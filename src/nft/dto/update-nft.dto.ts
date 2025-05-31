import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

@InputType()
export class UpdateNftDto {
    @Field(() => Int)
    @IsNumber()
    id: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    price?: number;

    @Field(() => [String], { nullable: true })
    @IsArray()
    @IsOptional()
    tags?: string[];
}

import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class TagsInput {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    tags: string[];
} 
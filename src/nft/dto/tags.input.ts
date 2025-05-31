import { InputType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType()
export class TagsInput {
    @Field(() => [String])
    @IsArray()
    tags: string[];
} 
import { IsNotEmpty, Min } from 'class-validator';
import { Resource } from '../entities/resource.enum';

export class CreatePlanDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNotEmpty()
  resource: Resource;

  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  isActive: boolean;
}

import { IsNotEmpty, Min } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @Min(1)
  tokenNumber: number;

  @IsNotEmpty()
  isActive: boolean;
}

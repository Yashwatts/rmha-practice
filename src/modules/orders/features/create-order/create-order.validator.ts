import { IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateOrderValidator {
  @IsString()
  @MaxLength(100)
  customerName: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

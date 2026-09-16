import { IsUUID } from 'class-validator';

export class CreateDeliveryValidator {
  @IsUUID()
  orderId: string;
}

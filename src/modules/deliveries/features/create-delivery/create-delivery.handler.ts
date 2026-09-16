import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDeliveryCommand } from './create-delivery.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateDeliveryCommand)
export class CreateDeliveryHandler implements ICommandHandler<CreateDeliveryCommand> {
  constructor(
    @InjectRepository(DeliveriesEntity)
    private readonly deliveriesRepository: Repository<DeliveriesEntity>,
  ) {}

  async execute(
    command: CreateDeliveryCommand,
  ): Promise<{ deliveryId: string }> {
    const delivery = DeliveriesEntity.create(command.orderId);
    await this.deliveriesRepository.save(delivery);
    return { deliveryId: delivery.id };
  }
}

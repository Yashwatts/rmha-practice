import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrepareDeliveryCommand } from './prepare-delivery.command';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { Repository } from 'typeorm';

@CommandHandler(PrepareDeliveryCommand)
export class PrepareDeliveryHandler implements ICommandHandler<PrepareDeliveryCommand> {
  constructor(
    @InjectRepository(DeliveriesEntity)
    private readonly deliveriesRepository: Repository<DeliveriesEntity>,
  ) {}

  async execute(
    command: PrepareDeliveryCommand,
  ): Promise<{ deliveryId: string }> {
    const delivery = await this.deliveriesRepository.findOne({
      where: { id: command.deliveryId },
    });

    if (!delivery) {
      throw new Error(
        `Delivery not found for deliveryId: ${command.deliveryId}`,
      );
    }

    delivery.prepare();
    await this.deliveriesRepository.save(delivery);
    return { deliveryId: delivery.id };
  }
}

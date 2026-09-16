export class DeliveryPreparedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
  ) {}
}

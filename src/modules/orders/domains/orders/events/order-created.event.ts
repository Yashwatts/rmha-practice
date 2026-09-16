export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerName: string,
    public readonly amount: number,
  ) {}
}

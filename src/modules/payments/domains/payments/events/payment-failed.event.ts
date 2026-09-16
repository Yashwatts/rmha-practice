export class PaymentFailedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
  ) {}
}

export class PaymentProcessingEvent {
  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
  ) {}
}

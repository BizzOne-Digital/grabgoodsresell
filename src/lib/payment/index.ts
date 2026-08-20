import type { PaymentProvider, PaymentResult } from "@/types";

export class ManualPaymentProvider implements PaymentProvider {
  name = "manual";

  async processPayment(): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: undefined,
    };
  }

  async refundPayment(): Promise<PaymentResult> {
    return {
      success: false,
      error: "Manual payment provider does not support automated refunds yet.",
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new ManualPaymentProvider();
}

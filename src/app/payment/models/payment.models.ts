// payments/models/payment.models.ts

export interface PaymentProcessRequest {
  requestId: string;          // "PAY-UUID..." (lo generamos en el frontend)
  orderId: string;            // por ahora podemos usar vehicleId.toString()
  paymentMethodToken: string; // viene de /card-tokenize o /payment-methods/me
  currency: string;           // "PEN"
  amount: number;             // precio del vehículo
  ipAddress?: string;
  cardFingerprint?: string;
}

export interface PaymentProcessResponse {
  requestId: string;
  orderId: string;
  status: string;       // PENDING, CAPTURED, FAILED, FRAUD_SUSPECT, ...
  pspChargeId?: string;
  message: string;
}

export interface CardTokenizeRequest {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderFirstName: string;
  cardholderLastName: string;
  billingFirstName?: string;
  billingLastName?: string;
  email?: string;
  phone?: string;
  documentNumber?: string;
  province?: string;
  installments?: number;
}

export interface CardTokenizeResponse {
  paymentMethodToken: string;
  cardFingerprint: string;
  brand: string;  // VISA, MASTERCARD, ...
  last4: string;
}

export interface PaymentMethodView {
  id: number;
  brand: string;
  last4: string;
  label: string;              // "VISA •••• 4242"
  paymentMethodToken: string;
  isDefault: boolean;
}

export interface CreatePaymentIntentRequest {
  saleId: number;
  buyerId: number;
  sellerId: number;
  amount: number;
  currency: string;
}

export interface CreatePaymentIntentResponse {
  paymentId: string; // = requestId
  status: string;
}

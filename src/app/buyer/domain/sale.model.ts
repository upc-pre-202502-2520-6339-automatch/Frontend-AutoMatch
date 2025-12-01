export type SaleStatus =
  | 'INITIATED'
  | 'RESERVED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED';

export interface Sale {
  id: number;
  vehicleId: number;
  buyerId: number;
  sellerId: number | null;
  priceAmount: number;
  priceCurrency: string;
  status: SaleStatus;
  reservationExpiresAt: string | null;
  images: string[];
}

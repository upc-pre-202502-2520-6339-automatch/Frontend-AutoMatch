export type VehicleStatus =
  | 'PUBLISHED'
  | 'UNDER_REVIEW'
  | 'AVAILABLE'
  | 'RESERVED'
  | 'SOLD'
  | 'WITHDRAWN';

export interface Vehicle {
  id: number;
  sellerId: number;
  plate: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  priceAmount: number;
  priceCurrency: string;
  status: VehicleStatus;
  mainImageUrl?: string | null;
}















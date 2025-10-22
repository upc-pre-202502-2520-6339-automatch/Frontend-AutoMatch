export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  photoUrl: string;
  location?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  dni: string;
  photoUrl: string;
}

export interface PaymentRequest {
  buyerId: string;
  sellerId: string;
  accountNumber: string;
  transactionNumber: string;
}

export interface TechnicalReviewInfo {
  certifiedSealInfo: string;
  subscriptionPlanBenefits: string;
  observationRegularizationInfo: string;
  premiumAnnouncementInfo: string;
}
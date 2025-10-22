import { Buyer, Seller, TechnicalReviewInfo } from '../../domain/models';

// DTOs de ejemplo (ajustar los nombres de campos al backend real):
interface BuyerDto {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  photo_url: string;
  location?: string;
}

interface SellerDto {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  photo_url: string;
}

interface TechnicalReviewDto {
  certified_vehicle_seal_info: string;
  subscription_plan_benefits: string;
  observation_regularization_info: string;
  premium_announcement_info: string;
}

export const mapBuyer = (dto: BuyerDto): Buyer => ({
  id: dto.id,
  name: dto.full_name,
  email: dto.email,
  phone: dto.phone,
  dni: dto.dni,
  photoUrl: dto.photo_url,
  location: dto.location
});

export const mapSeller = (dto: SellerDto): Seller => ({
  id: dto.id,
  name: dto.full_name,
  email: dto.email,
  phone: dto.phone,
  dni: dto.dni,
  photoUrl: dto.photo_url
});

export const mapTechnicalInfo = (dto: TechnicalReviewDto): TechnicalReviewInfo => ({
  certifiedSealInfo: dto.certified_vehicle_seal_info,
  subscriptionPlanBenefits: dto.subscription_plan_benefits,
  observationRegularizationInfo: dto.observation_regularization_info,
  premiumAnnouncementInfo: dto.premium_announcement_info
});
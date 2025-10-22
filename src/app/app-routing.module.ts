import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { LoginComponent } from "./register/components/login/login.component";
import { RegisterComponent } from "./register/components/register/register.component";
import { ForgotPasswordComponent } from "./register/components/forgot-password/forgot-password.component";
import { CarDetailsComponent } from "./public/pages/car-details/car-details.component";
import { CarListingFormComponent } from './cars/components/car-listing-form/car-listing-form.component';
import { CarListingComponent } from "./cars/components/car-listing/car-listing.component";
import { MechanicRevisionComponent } from "./mechanic/components/mechanic-revision/mechanic-revision.component";
import { MechanicCheckComponent } from "./mechanic/components/mechanic-check/mechanic-check.component";
import { PlanComponent } from "./plans/components/plan/plan.component";
import { PaymentFormComponent } from "./plans/components/payment-form/payment-form.component";
import { MyCarsComponent } from "./cars/components/my-cars/my-cars.component";
import { ProfileComponent } from "./profiles/components/profile/profile.component";
import { FavoritesComponent } from "./cars/components/favorites/favorites.component";
import { PayComponent } from "./buyer/components/pay/pay.component";
import { TechnicalReviewComponent } from "./buyer/components/technical-review/technical-review.component";
import { ProfileFormComponent } from "./profiles/components/profile-form/profile-form.component";
import {VehiclePaymentStepperComponent} from "./transaction/components/vehicle-payment-stepper/vehicle-payment-stepper.component";
import {SellerOffersComponent} from "./transaction/components/seller-offers/seller-offers.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'car-details/:id', component: CarDetailsComponent },
  { path: 'mechanic-revision', component: MechanicRevisionComponent },
  { path: 'mechanic-check', component: MechanicCheckComponent },
  { path: 'car-listing-form', component: CarListingFormComponent },
  { path: 'car-listing', component: CarListingComponent },
  { path: 'plan', component: PlanComponent },
  { path: 'payment-form', component: PaymentFormComponent },
  { path: 'my-cars', component: MyCarsComponent },
  { path: 'profile-form', component: ProfileFormComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'pay', component: PayComponent },
  { path: 'technical-review', component: TechnicalReviewComponent },
  { path: 'send-data/:vehicleId', component: VehiclePaymentStepperComponent },
  {path: 'offers', component: SellerOffersComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

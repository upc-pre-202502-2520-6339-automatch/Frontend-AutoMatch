import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import { PageNotFoundComponent } from "./public/pages/page-not-found/page-not-found.component";
import { LoginComponent } from "./register/components/login/login.component";
import { RegisterComponent } from "./register/components/register/register.component";
import { ForgotPasswordComponent } from "./register/components/forgot-password/forgot-password.component";
import { CarDetailsComponent } from "./buyer/components/car-details/car-details.component";
import { CarListingFormComponent } from './cars/components/car-listing-form/car-listing-form.component';
import { CarListingComponent } from "./cars/components/car-listing/car-listing.component";
import { PlanComponent } from "./plans/components/plan/plan.component";
import { PaymentFormComponent } from "./plans/components/payment-form/payment-form.component";
import { MyCarsComponent } from "./cars/components/my-cars/my-cars.component";
import { ProfileComponent } from "./profiles/components/profile/profile.component";
import { FavoritesComponent } from "./cars/components/favorites/favorites.component";
import { ProfileFormComponent } from "./profiles/components/profile-form/profile-form.component";
import {VehiclePaymentStepperComponent} from "./payment/components/vehicle-payment-stepper/vehicle-payment-stepper.component";
import { authenticationGuard } from './register/services/auth.guard.service';
import {roleGuard} from "./register/services/role.guard.service";
import {MyPurchasesComponent} from "./buyer/components/my-purchases/my-purchases.component";
import {MySalesComponent} from "./buyer/components/my-sales/my-sales.component";


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // públicas
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // 🔥 detalle de vehículo (usa el componente nuevo de buyer)
  { path: 'cars/:id', component: CarDetailsComponent, canActivate: [authenticationGuard] },

  // opcional: redirección desde la ruta vieja
  { path: 'car-details/:id', redirectTo: 'cars/:id', pathMatch: 'full' },

  // SOLO LOGUEADOS
  {
    path: 'car-listing-form',
    component: CarListingFormComponent,
    canActivate: [authenticationGuard, roleGuard],
    data: { roles: ['SELLER'] }
  },

  { path: 'car-listing', component: CarListingComponent, canActivate: [authenticationGuard] },
  { path: 'my-cars', component: MyCarsComponent, canActivate: [authenticationGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authenticationGuard] },

  // buyer
  { path: 'send-data/:vehicleId', component: VehiclePaymentStepperComponent, canActivate: [authenticationGuard] },

  // perfiles / planes / pagos
  { path: 'plan', component: PlanComponent, canActivate: [authenticationGuard] },
  { path: 'payment-form', component: PaymentFormComponent, canActivate: [authenticationGuard] },
  { path: 'profile-form', component: ProfileFormComponent, canActivate: [authenticationGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard] },

  {
    path: 'messages',
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./messaging/messaging.module').then(m => m.MessagingModule)
  },
  {
    path: 'notifications',
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./notifications/notifications.module').then(m => m.NotificationsModule)
  },

  {
    path: 'my-purchases',
    component: MyPurchasesComponent,
    canActivate: [authenticationGuard, roleGuard],
    data: { roles: ['BUYER'] }
  },
  {
    path: 'my-sales',
    component: MySalesComponent,
    canActivate: [authenticationGuard, roleGuard],
    data: { roles: ['SELLER'] }
  },

  // 404
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

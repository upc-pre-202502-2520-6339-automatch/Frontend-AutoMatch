import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BuyerRepository } from './buyer/domain/repositories/buyer.repository';
import { BuyerHttpRepository } from './buyer/infrastructure/http/buyer-http.repository';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Feature Components Imports
import { HomeComponent } from './public/pages/home/home.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { FooterComponent } from './public/components/footer/footer.component';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { LoginComponent } from "./register/components/login/login.component";
import { RegisterComponent } from './register/components/register/register.component';
import { ForgotPasswordComponent } from './register/components/forgot-password/forgot-password.component';
import { CarDetailsComponent } from './public/pages/car-details/car-details.component';
import { CarListingFormComponent } from './cars/components/car-listing-form/car-listing-form.component';
import { MechanicRevisionComponent } from './mechanic/components/mechanic-revision/mechanic-revision.component';
import { MechanicCheckComponent } from './mechanic/components/mechanic-check/mechanic-check.component';
import { PlanComponent } from "./plans/components/plan/plan.component";
import { PaymentFormComponent } from "./plans/components/payment-form/payment-form.component";
import { MyCarsComponent } from './cars/components/my-cars/my-cars.component';
import { CarListingComponent } from './cars/components/car-listing/car-listing.component';
import { FavoritesComponent } from './cars/components/favorites/favorites.component';
import { ProfileComponent } from './profiles/components/profile/profile.component';
import { PayComponent } from './buyer/components/pay/pay.component';
import { SendDataComponent } from './buyer/components/send-data/send-data.component';
import { TechnicalReviewComponent } from './buyer/components/technical-review/technical-review.component';
import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { ProfileFormComponent } from './profiles/components/profile-form/profile-form.component';
import { AuthenticationInterceptor } from "./register/services/authentication.interceptor.service";
import { AuthenticationSectionComponent } from "./register/components/authentication-section/authentication-section.component";
import { LanguageSwitcherComponent } from './public/components/language-switcher/language-switcher.component';
import { VehiclePaymentStepperComponent } from './transaction/components/vehicle-payment-stepper/vehicle-payment-stepper.component';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import { SellerOffersComponent } from './transaction/components/seller-offers/seller-offers.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    FooterComponent,
    ToolbarComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CarDetailsComponent,
    CarListingFormComponent,
    MechanicRevisionComponent,
    MechanicCheckComponent,
    PlanComponent,
    PaymentFormComponent,
    MyCarsComponent,
    CarListingComponent,
    ProfileComponent,
    PayComponent,
    LoginComponent,
    SendDataComponent,
    TechnicalReviewComponent,
    ProfileFormComponent,
    AuthenticationSectionComponent,
    LanguageSwitcherComponent,
    VehiclePaymentStepperComponent,
    SellerOffersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    NgOptimizedImage,
    CdkDropList,
    CdkDrag,
    MatProgressSpinnerModule,
    MatStep,
    MatStepLabel,
    MatStepper,
    MatStepperNext,
    MatStepperPrevious
  ],
  providers: [
    { provide: BuyerRepository, useClass: BuyerHttpRepository },
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

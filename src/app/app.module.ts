import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
//##### access to AngularFire2 (FireBase)
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";
import { environment } from "../environments/environment";
//##### access to the native desktop electron functionalities
import { NgxElectronModule } from "ngx-electron";
//##### app routing
import { AppRoutingModule } from "./app-routing.module";
//#### imports bootstrap material module
import { MDBBootstrapModule } from "angular-bootstrap-md";
//##### http modules
import { HttpClientModule } from "@angular/common/http";
//##### http custom service for all our requests
import { HttpService } from "./shared/http.service";
//##### currency data
import { CurrencyService } from "./shared/currency.service";
//##### imports AngularFire Auth Service
import { AuthService } from "./shared/auth.service";
import { AuthGuardService } from "./shared/auth-guard.service";
//##### Toast service
import { ToastService } from "./shared/toast.service";
//##### Import NgxSpinner library module
import { NgxSpinnerModule } from "ngx-spinner";
//##### Import setting service
import { SettingService } from "./shared/setting.service";
//##### Notification service
import { NotificationService } from "./shared/notification.service";
//##### internet service
import { InternetService } from "./shared/internet.service";
//##### zarka component
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BankComponent } from "./bank/bank.component";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { GeneralComponent } from "./general/general.component";
import { BankTableComponent } from "./bank-table/bank-table.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { FormsModule } from "@angular/forms";
import { HistoryService } from "./shared/history.service";
import { SettingComponent } from './setting/setting.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    BankComponent,
    HomeComponent,
    NavbarComponent,
    GeneralComponent,
    BankTableComponent,
    SigninComponent,
    SignupComponent,
    SettingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgxElectronModule, // imports electron native functionalities
    MDBBootstrapModule.forRoot(), // imports bootstrap material design
    AngularFireModule.initializeApp(environment.firebase), // initialise firebase from environment
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: "increasing"
    }), // ToastrModule added
    NgxSpinnerModule
  ],
  providers: [
    HttpService,
    CurrencyService,
    AuthService,
    AuthGuardService,
    ToastService,
    SettingService,
    NotificationService,
    InternetService,
    HistoryService,
    SidebarComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}

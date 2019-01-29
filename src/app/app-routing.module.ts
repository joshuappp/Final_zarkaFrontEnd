import { AuthGuardService } from "./shared/auth-guard.service";
import { SigninComponent } from "./signin/signin.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BankComponent } from "./bank/bank.component";
import { HomeComponent } from "./home/home.component";
import { GeneralComponent } from "./general/general.component";
import { SignupComponent } from "./signup/signup.component";
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingComponent } from "./setting/setting.component";

const routes: Routes = [
  {
    path: "signin",
    component: SigninComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "bank",
    component: BankComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "general",
    component: GeneralComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "",
    redirectTo: "/signin",
    pathMatch: "full"
  },
  {
    path: "**",
    component: SigninComponent
  },
  {
    path: "sidebar",
    component: SidebarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
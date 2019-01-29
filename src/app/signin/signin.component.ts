import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
//##### imports Auth service (access to AngularFire);
import { AuthService } from "./../shared/auth.service";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### import internet service check
import { InternetService } from "../shared/internet.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
    //passoword hide or show
    hide = true;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private internet: InternetService
  ) {}

  ngOnInit() {}

  //##### google authentication
  loginGoogle(): void {
    this.authService.doGoogleLogin();
  }

  //##### Facebook authentication
  loginFacebook(): void {
    this.authService.doFacebookLogin();
  }

  //##### test AngularFire logout
  logout() {
    this.authService.afLogout();
  }

  onSignin(form: NgForm) {
    const { email, password } = form.value;
    // check if the app is connected
    if (this.internet.isConnected) {
      // check if email/username and password has more than 6 character
      if (String(email).length >= 6 && String(password).length >= 6) {
        this.authService.signinUser(email, password);
      } else {
        this.toast.toastWarning(
          "Sign in",
          "Email and Password must be more than 6 characters ☹️"
        );
      }

    } else {
      this.toast.toastError("Internet", "Zarka is offline 😴");
    }
  }
} //# end class

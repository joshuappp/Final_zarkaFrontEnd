import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
//##### imports AngularFire Auth Service
import { AuthService } from "../shared/auth.service";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### import internet service check
import { InternetService } from "../shared/internet.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
    //passoword hide or show
    hide = true;
  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private internet: InternetService
  ) {}

  ngOnInit() {}

  onSignup(form: NgForm) {
    // check if the app is connected
    if (this.internet.isConnected) {
      const { email, password } = form.value;
      // check if email/username and password has more than 6 character
      if (String(email).length >= 6 && String(password).length >= 6) {
        this.authService.signupUser(email, password);
      } else {
        this.toast.toastWarning(
          "Sign up",
          "Email and Password must be more than 6 characters ☹️"
        );
      }

    } else {
      this.toast.toastError("Internet", "Zarka is offline 😴");
    }
  }
}

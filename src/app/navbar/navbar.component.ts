import { Component, OnInit } from "@angular/core";
//##### imports Auth service (access to AngularFire);
import { AuthService } from "./../shared/auth.service";
//##### import setting
import { SettingService } from "../shared/setting.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  myStyle: string = "navbar navbar-dark blue-grey darken-1 navbar-expand-lg";

  constructor(
    private authService: AuthService,
    private setting: SettingService
  ) {}

  ngOnInit() {}

  logout() {
    this.authService.afLogout();
  }
}

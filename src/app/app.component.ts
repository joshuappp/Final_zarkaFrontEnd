import { Component, OnInit } from "@angular/core";
//##### import our currency functionalities
import { CurrencyService } from "./shared/currency.service";
//##### impot internet service
import { InternetService } from "./shared/internet.service";
//##### import setting service
import { SettingService } from "./shared/setting.service";
//##### import all history service
import { HistoryService } from "./shared/history.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    private currency: CurrencyService,
    private internet: InternetService,
    private setting: SettingService,
    private history: HistoryService
  ) {}

  ngOnInit() {
    this.currency.refreshData();
    this.internet.internetCheck();
    this.setting.getAllThemes();
    this.history.getHistoryData();

  }
} //# end class

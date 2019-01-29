import { Component, OnInit, Input } from "@angular/core";
//##### access to the native desktop electron
import { ElectronService } from "ngx-electron";
//##### import setting service
import { SettingService } from "../shared/setting.service";
//##### import custom bank-data-type from our model
import { TypeBankUrl } from "./../shared/data.model";

@Component({
  selector: "app-bank-table",
  templateUrl: "./bank-table.component.html",
  styleUrls: ["./bank-table.component.scss"]
})
export class BankTableComponent implements OnInit {
  @Input("table") table: any[];

  url: Array<TypeBankUrl> = [
    [
      "BIDVEST BANK",
      "https://www.bidvestbank.co.za/business-banking/forex-services/retail-foreign-exchange-rates.aspx"
    ],
    [
      "STANDARD BANK",
      "http://ws15.standardbank.co.za/finSnapShot/GetforexServlet"
    ],
    [
      "NEDBANK",
      "https://www.nedbank.co.za/content/nedbank/desktop/gt/en/personal/forex/forex-rates.html"
    ],
    ["ABSA", "https://www.absa.co.za/indices/exchange-rates"],
    ["FNB", "https://www.fnb.co.za/rates/ForeignExchangeRates.html"]
  ];

  //##### constructor
  constructor(
    private _electronService: ElectronService,
    private setting: SettingService
  ) {}

  ngOnInit() {}

  bankAccessWeb(data: string) {
    // get index of the passed argument from the url array
    const index = [...this.url.map(data => data[0])].indexOf(data);
    // open url according the platform (web || desktop) 
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal(this.url[index][1]);
    } else { window.open(this.url[index][1], "_blank"); }
  }
}

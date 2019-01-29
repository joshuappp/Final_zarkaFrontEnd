import { Component, OnInit } from "@angular/core";
//#### import evrything from lodash
import * as _ from "lodash";
// $$$$ import currency service
import { CurrencyService } from "../shared/currency.service";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from "ngx-spinner";
//##### import setting service
import { SettingService } from '../shared/setting.service';

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.scss"]
})
export class GeneralComponent implements OnInit {
  currencyData: Array<Object> = [];
  // $$$ Declaration of arrays to be used for storing various currency data
  currencyStorage: any[] = [];
  //##### currency calculator variables
  amount: number;
  currencyFrom: number;
  display: any = "Amount in R";
  //##### ZAR currency
  zar: any = {
    alphaCode: "ZAR",
    code: "ZAR",
    date: "Fri, 7 Dec 2018 00:00:01 GMT",
    inverseRate: 1,
    name: "South African Rand",
    numericCode: "1",
    rate: 1
  };

  constructor(
    private generalCurrency: CurrencyService,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
    private setting: SettingService
  ) {}

  ngOnInit() {
    //##### spinner starts on init
    this.spinner.show();
    //##### set an interval function to check localStorage for general currency data
    var getGeneralInterval = setInterval(() => {
      //##### Check if localStorage is set
      if (localStorage.generalStorage !== undefined) {
        //##### Clear general interval
        clearInterval(getGeneralInterval);
        //##### Assign localStorage data to currency array
        this.currencyData = JSON.parse(localStorage.generalStorage);
        console.dir(this.currencyData);
        //##### call getGeneralCurrency function to set all currency values
        this.getGeneralCurrencyData();

        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }, 1000);
  } //# end of ngOnInit

  //##### fetch currency data from localStorage
  getGeneralCurrencyData() {
    // $$$ Push the values of each object into Array of type any to simplify access to currency values
    _.each(this.currencyData, value => {
      this.currencyStorage.push(value);
    });
  }

  //##### custom event when FROM isChange
  fromEvent(event: any) {
    this.currencyFrom = event.target.value;
    console.dir(event.target.value);
    this.calculate();
  }

  //##### custom event when AMOUNT isInput
  amountEvent() {
    console.dir(this.amount);
    this.calculate();
  }

  //##### select currency from table event
  tableEvent(currency) {
    console.log(currency);
    let toastHead: string = currency.name.toString();
    let toastBody: string =
      "1 " +
      currency.code.toString() +
      " = R" +
      currency.inverseRate.toFixed(5).toString();
    this.toast.toastInfo(toastHead, toastBody);
    this.calculate();
  }

  //##### calculate currency
  calculate() {
    console.log("Amount " + this.amount);
    console.log("From " + this.currencyFrom);
    console.log("Display " + this.display);
    let total: number = 0;

    if (
      !isNaN(this.amount) &&
      !isNaN(this.currencyFrom) &&
      this.amount != null
    ) {
      total = this.amount * (1 / this.currencyFrom);
      this.display = "R" + total.toFixed(4).toString();
    } else {
      this.display = "Amount in R";
    }
  }
}

import { Injectable } from "@angular/core";
//##### observable for http response
import { Observable } from "rxjs";
//##### import HttpClient class
import { HttpService } from "./http.service";
//##### import bank template datatype
import { TypeBank } from "./data.model";
//##### notification service
import { NotificationService } from "./notification.service";
//#### import evrything from lodash
import * as _ from "lodash";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from "ngx-spinner";

import { HttpClient } from '@angular/common/http';

import {User} from '../user';


//end of my import

@Injectable({
  providedIn: "root"
})
export class CurrencyService {

 
  private defaultThemeColor: string;
  private defaultNotify: boolean;
  private defaultVia: string;
  private defaultDay: string;
  private defaultTime: string;
  private defaultBank: string;
  private defaultSellOrBuy: string;
  private defaultCurrency: string;
  private defaultSellAmountNotify: number;
  private defaultBuyAmountNotify: number;
  private isAuthenticated = false;
  private setTheEmail: string;
  //##########==========start
  

  //isAuthenticatedSelected = this.isAuthenticated.asObservable();

  changeAuth(authenticated: boolean){
    this.isAuthenticated = authenticated;
  }

  getChangeAuth(){
    return this.isAuthenticated;
  }
  

  //setTheEmailSelected = this.setTheEmail.asObservable();

  changeSetTheEmail(email: string){
    this.setTheEmail = email;
  }
  getChangeSetTheEmail(){
    return this.setTheEmail;
  }

  //##########=============end

  //defaultNotifySelected = this.defaultNotify.asObservable();

  changeDefaultNotify(notify: boolean){
    this.defaultNotify = notify;
  }

  getChangeDefaultNotify(){
    return this.defaultNotify;
  }

  //defaultThemeColorSelected = this.defaultThemeColor.asObservable();

  changeDefaultThemeColor(themeColor: string){
    this.defaultThemeColor = themeColor;
  }

  getChangeDefaultThemeColor(){
     return this.defaultThemeColor;
  }

 // defaultViaSelected = this.defaultVia.asObservable();

  changeDefaultVia(via: string){
    this.defaultVia = via;
  }

  getChangeDefaultVia(){
     return this.defaultVia;
  }

  //defaultDaySelected = this.defaultDay.asObservable();

  changeDefaultDay(day: string){
    this.defaultDay = day;
  }

  getChangeDefaultDay(){
    return this.defaultDay;
  }
  //defaultTimeSelected = this.defaultTime.asObservable();

  changeDefaultTime(time: string){
    this.defaultTime = time;
  }

  getChangeDefaultTime(){
     return this.defaultTime;
  }

  //defaultBankSelected = this.defaultBank.asObservable();

  changeDefaultBank(bank: string){
    this.defaultBank = bank;
  }

  getChangeDefaultBank(){
     return this.defaultBank;
  }

 // defaultSellOrBuySelected = this.defaultSellOrBuy.asObservable();

  changeDefaultSellOrBuy(sellOrBuy: string){
    this.defaultSellOrBuy = sellOrBuy;
  }

  getChangeDefaultSellOrBuy(){
    return this.defaultSellOrBuy;
  }
  //defaultCurrencySelected = this.defaultCurrency.asObservable();

  changeDefaultCurrency(currency: string){
    this.defaultCurrency = currency;
  }

  getChangeDefaultCurrency(){
    return this.defaultCurrency;
  }

  //defaultSellAmountNotifySelected = this.defaultSellAmountNotify.asObservable();

  changeDefaultSellAmountNotify(sellAmountNotify: number){
    this.defaultSellAmountNotify = sellAmountNotify;
  }

  getChangeDefaultSellAmountNotify(){
     return this.defaultSellAmountNotify;
  }
  //defaultBuyAmountNotifySelected = this.defaultBuyAmountNotify.asObservable();

  changeDefaultBuyAmountNotify(buyAmountNotify: number){
    this.defaultBuyAmountNotify = buyAmountNotify;
  }

  getChangeDefaultBuyAmountNotify(){
     return this.defaultBuyAmountNotify;
  }

  //end of my code




  //##### hold data from server
  bankData$: Array<TypeBank>;
  historyData$: Array<TypeBank>;
  generalData$: Array<Object>;

  //##### testing rest-api url
  testApiUrl: string = "https://jsonplaceholder.typicode.com/users";
  //##### bank currency (local url)
  //bankCurrencyUrl: string = "http://10.1.0.62:8080/access/latestdata";
  bankCurrencyUrl: string = "http://10.1.0.85:8081/access/latestdata";
  //##### History data (local url)
  //historyDataUrl: string = "http://localhost:8080/access/history";
  historyDataUrl: string = "http://10.1.0.85:8081/access/history";
  //historyDataUrl: string = "../../assets/historyData.json";
  //##### general curency api url
  generalCurrencyUrl: string = "http://www.floatrates.com/daily/zar.json";


  private baseUrl = 'http://10.1.0.85:8081/access';

  constructor(
    private httpCall: HttpService,
    private notification: NotificationService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient
  ) {}


  //start of my code


  // 10.1.0.62:8081/access/usersave

  createSettingsWithId(userId: number): Observable<Object> {

 
    return this.httpClient.get(`${this.baseUrl}` + `/getsettingsby/${userId}`);
  }

  createSettings(userId: number,settings: Object): Observable<Object> {
    
    console.log(userId);
    console.log(settings);
//
    return this.httpClient.put(`${this.baseUrl}` + `/updatesettings/${userId}`,settings);
  }

  createUserEmail(userEmail: Object): Observable<Object> {

   
    return this.httpClient.post(`${this.baseUrl}` + `/usersave`, userEmail);
  }

  getUserEmailAndId(email: string): Observable<User[] > {

    console.log(email);
  
    return this.httpClient.get<User[] >(`${this.baseUrl}` + `/getuserby/${email}`);
  }
  
  






  //end of my code

  //##### get bank data
  getBankData(): void {
    this.spinner.show();
    this.httpCall.getDataFromServer(this.bankCurrencyUrl).subscribe(
      (data: Array<TypeBank>) => {
        this.spinner.hide();
        this.bankData$ = data;
        //console.log(this.bankData$);
        //##### assign value to storage if undefined
        if (localStorage.bankStorage == undefined) {
          localStorage.setItem("bankStorage", JSON.stringify(this.bankData$));
        } else if (localStorage.bankStorage) {
          //console.log("bankStorage cleared");
          localStorage.removeItem("bankStorage");
          localStorage.setItem("bankStorage", JSON.stringify(this.bankData$));
        }
      },
      error => {
        this.spinner.hide();
        //console.log(error);
      }
    );
  }

  //##### get bank data
  getHistoryData(): void {
    this.spinner.show();
    this.httpCall.getDataFromServer(this.historyDataUrl).subscribe(
      (data: Array<TypeBank>) => {
        this.spinner.hide();
        //get data in reverse order 
        this.historyData$ = data;
        //console.dir(this.historyData$);
        //##### assign value to storage if undefined
        if (localStorage.historyStorage == undefined) {
          localStorage.setItem(
            "historyStorage",
            JSON.stringify(this.historyData$)
          );
        } else if (localStorage.historyStorage) {
          //console.log("historyStorage cleared");
          localStorage.removeItem("historyStorage");
          localStorage.setItem(
            "historyStorage",
            JSON.stringify(this.historyData$)
          );
        }
      },
      error => {
        this.spinner.hide();
        //console.log(error);
      }
    );
  }

  //##### get general data
  getGeneralData(): void {
    this.spinner.show();
    this.httpCall.getDataFromServer(this.generalCurrencyUrl).subscribe(
      (data: Array<Object>) => {
        this.spinner.hide();
        this.generalData$ = data;
        //console.log(this.generalData$);
        //##### assign value to storage if undefined
        if (localStorage.generalStorage == undefined) {
          localStorage.setItem(
            "generalStorage",
            JSON.stringify(this.generalData$)
          );
        } else if (localStorage.generalStorage) {
          localStorage.removeItem("generalStorage");
          //console.log('generalStorage cleared');
          localStorage.setItem(
            "generalStorage",
            JSON.stringify(this.generalData$)
          );
        }
      },
      error => {
        this.spinner.hide();
        //console.log(error);
      }
    );
  }

  refreshData() {
    this.getBankData();
    this.getGeneralData();
    this.getHistoryData();
  }
} //## end CurrencyService

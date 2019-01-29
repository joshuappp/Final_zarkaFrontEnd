import { Component, OnInit } from "@angular/core";
//##### import setting service
import { SettingService } from "../shared/setting.service";
import { TypeTheme } from "./../shared/data.model";
import { AuthService } from "./../shared/auth.service";
import { Settings } from '../settings';
import { User } from '../user';
import { NotificationService } from './../shared/notification.service';
import { CurrencyService } from './../shared/currency.service';
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  zarka: TypeTheme = {
    navbar: "navbar navbar-dark blue-grey darken-1 navbar-expand-lg",
    sidebar: "left-skew-blue-gray blue-grey darken-1",
    button: "btn btn-outline-blue-grey waves-effect",
    tableTh: "blue-grey darken-1",
    loader: "#607d8b"
  };

  dracula: TypeTheme = {
    navbar: "navbar navbar-dark stylish-color-dark navbar-expand-lg",
    sidebar: "left-skew-dracula stylish-color-dark",
    button: "btn btn-outline-grey waves-effect",
    tableTh: "stylish-color",
    loader: "#3E4551"
  };

  success: TypeTheme = {
    navbar: "navbar navbar-dark cyan darken-4 navbar-expand-lg",
    sidebar: "left-skew-success cyan darken-4",
    button: "btn btn-outline-teal waves-effect",
    tableTh: "cyan darken-4",
    loader: "#006064"
  };

  indigo: TypeTheme = {
    navbar: "navbar navbar-dark indigo navbar-expand-lg",
    sidebar: "left-skew-indigo indigo",
    button: "btn btn-outline-indigo waves-effect",
    tableTh: "indigo lighten-1",
    loader: "#3f51b5"
  };

  notify: boolean;
  via: string;
  reportDay: string;
  reportTime: string;
  bank: string;
  sellOrBuy: string;
  buy = false;
  sell= true;
  sellOrBuyArray = false;
  currency: string;
  sellAmountNotify: number;
  buyAmountNotify: number;

  userDetails: User = new User;

  userEmailAndId: Array<any>;

  userId: number;

  settings: Settings = new Settings;

  userSettings: Settings = new Settings;

  settingsCounter = 0;


  isViaEmail: boolean = false;

  settingsPopulatedCouter = 0;

  constructor(
    private setting: SettingService,
    private authService: AuthService,
    private currencyService: CurrencyService,
    private  notification: NotificationService
  ) {}

  selectedNotifyChangeHandler(event: any){

    this.notify = event.target.checked;

    console.log(this.notify);

    let t = setInterval(() => {

    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.notify = this.notify;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.notify =this.notify;
    this.setTheSettingsAgain();

    this.userDetails = JSON.parse(localStorage.userDetails);
                        
    this.userId =  this.userDetails.id;
              
                  
                  
                  localStorage.setItem("userSettings", JSON.stringify(this.settings));
                  this.saveSettings(this.userId,this.settings);

                  clearInterval(t);
    }, 3000);
 
  }

  selectedNotifyMeViaChangeHandler(event?: any){

    this.via = event.target.value;

    if((this.via == "App" || this.via == "Both") && this.sellOrBuy == "Undefined"){

      console.log("GOT INSIDE YEYEYEYEY");

      this.sellOrBuy = 'Sell';

      console.log(this.via);
      console.log(this.sellOrBuy);
  
      this.userSettings = JSON.parse(localStorage.userSettings); 
      this.userSettings.sellOrBuy = this.sellOrBuy;
      localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
      this.settings.sellOrBuy =this.sellOrBuy;
      this.setTheSettingsAgain();

    }else{
      this.via = event.target.value;
    }
    
    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.via = this.via;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.via =this.via;
    this.setTheSettingsAgain();

  }

  selectedOnWhichDayHandler(event: any){

    this.reportDay = event.target.value;

    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.reportDay = this.reportDay;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.reportDay =this.reportDay;
    this.setTheSettingsAgain();

  }

  selectedAtWhatTimeHandler(event: any){

    this.reportTime = event.target.value;

    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.reportTime = this.reportTime;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.reportTime =this.reportTime;
    this.setTheSettingsAgain();

  }

  NotifyMeOnWhichBankOrAllChangeHandler(event: any){
   

    this.bank = event.target.value;

    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.bank = this.bank;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.bank =this.bank;
    this.setTheSettingsAgain();

  }

  selectedSellBuyAllChangeHandler(event: any){
   

    this.sellOrBuy = event.target.value;
  
    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.sellOrBuy = this.sellOrBuy;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.sellOrBuy =this.sellOrBuy;
    this.setTheSettingsAgain();

  }

  selectedCurrencyNotifyChangeHandler(event: any){
   

    this.currency = event.target.value;

    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.userSettings.currency = this.currency;
    localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
    this.settings.currency =this.currency;
    this.setTheSettingsAgain();

  }

  selectedCurrencyMinChangeHandler(form: NgForm){

    const sell = form.value.sell;
    const buy = form.value.buy;

    this.userDetails = JSON.parse(localStorage.userDetails);


    let o = setInterval(() => {

    if(sell !== undefined && buy !== undefined){

      this.userSettings = JSON.parse(localStorage.userSettings); 
      this.userSettings.sellAmountNotify = sell;
      this.userSettings.buyAmountNotify = buy;
      localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
      this.settings.sellAmountNotify =sell;
      this.settings.buyAmountNotify =buy;
      
      this.setTheSettingsAgain();

   }else if(sell !==undefined){

              this.buyAmountNotify = 0;
          
              this.userSettings = JSON.parse(localStorage.userSettings); 
              this.userSettings.sellAmountNotify = sell;
              this.settings.sellAmountNotify =sell;
              this.userSettings.buyAmountNotify = 0;
              localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
              this.settings.buyAmountNotify =0;

              this.setTheSettingsAgain();
          
            }else if(buy !==undefined){

                     this.sellAmountNotify = 0;

                      this.userSettings = JSON.parse(localStorage.userSettings); 
                      this.userSettings.buyAmountNotify = buy;
                      this.settings.buyAmountNotify =buy;
                      this.userSettings.sellAmountNotify = 0;
                      localStorage.setItem("userSettings", JSON.stringify(this.userSettings));
                      this.settings.sellAmountNotify =0;

                      this.setTheSettingsAgain();
                  
                    }

                    this.userDetails = JSON.parse(localStorage.userDetails);
                        
                    this.userId =  this.userDetails.id;
              
                  // }
                 
                  localStorage.setItem("userSettings", JSON.stringify(this.settings));
                  this.saveSettings(this.userId,this.settings);

                    clearInterval(o);
        }, 2000);
 
  }

  saveSettings(getUserId: any , setting: Settings){
     console.log(setting);
     this.currencyService.createSettings(getUserId , setting)
      .subscribe(data => console.log(data), error => console.log(error));
      this.settings = new Settings();

  }

  getTheUserEmailIdMethod(theEmail: string) {
    console.log(theEmail);
    this.currencyService.getUserEmailAndId(theEmail).subscribe((userEmailAndId) => {this.userEmailAndId = userEmailAndId;  console.log(this.userEmailAndId); });

  }

  saveUserEmail() {

    this.userDetails = JSON.parse(localStorage.userDetails);

    this.currencyService.createUserEmail(this.userDetails).subscribe(data => console.log(data), error => console.log(error));

  }

  ngOnInit() {
    this.setTheSettings();

    this.setTheSettingsForSpecificUser();

    //this.settingsPopulatedCouter = 0;
  }
  setTheSettingsForSpecificUser(){

    setTimeout(() => {

              if(localStorage.userDetails == undefined && localStorage.userSettings == undefined){
                
                this.via = "";
                this.reportDay = "";
                this.reportTime = "";
                this.bank = "";
                this.sellOrBuy = "";
                this.currency = "";
                this.sellAmountNotify = 0;
                this.buyAmountNotify = 30;
                this.notify = false;

                console.log("IS SETTING THE DEFAULT SETTINGS");

                this.setTheSettingsForSpecificUser();
                
              }else{

                let r = setInterval(() => {
     
                  clearInterval(r);
                 
                  if(this.currencyService.getChangeAuth() == false){
                    this.settingsPopulatedCouter = 0;
                    console.log("AUTH IS FALSE");
                  }else{
                    console.log("AUTH IS TRUE");
                    
                    if(this.settingsPopulatedCouter == 0){
                      this.setTheSettingsAgain();
                      console.log("SET THE SETTINGS");
                      this.settingsPopulatedCouter++;
                    }
                  }
            
                  this.setTheSettingsForSpecificUser();
             
               }, 9000);
                  //this.populateSettings();

                 // clearInterval(o);               
              }
        
        },200);
      
  }
  populateSettings(){

    

  }
  setTheSettingsAgain(){
    if(localStorage.userDetails != undefined && localStorage.userSettings != undefined){
    this.userSettings = JSON.parse(localStorage.userSettings); 
    this.settings.via = this.userSettings.via;
    this.settings.reportDay = this.userSettings.reportDay;
    this.settings.reportTime = this.userSettings.reportTime;
    this.settings.bank = this.userSettings.bank;
    this.settings.sellOrBuy = this.userSettings.sellOrBuy;
    this.settings.currency = this.userSettings.currency;
    this.settings.sellAmountNotify = this.userSettings.sellAmountNotify;
    this.settings.buyAmountNotify = this.userSettings.buyAmountNotify;
    this.settings.notify = this.userSettings.notify;

    localStorage.setItem("userSettings", JSON.stringify(this.settings));

    
    this.via = this.settings.via;
    this.reportDay = this.settings.reportDay;
    this.reportTime = this.settings.reportTime;
    this.bank = this.settings.bank;
    this.sellOrBuy = this.settings.sellOrBuy;
    this.currency = this.settings.currency;
    this.sellAmountNotify = this.settings.sellAmountNotify;
    this.buyAmountNotify = this.settings.buyAmountNotify;
    this.notify = this.settings.notify;

    }

  }
  setTheSettings(){

    if(localStorage.userDetails === undefined && localStorage.userSettings === undefined){
      console.log("userDetails is Undefined");
    }else{

      console.log("userDetails is defined");

      this.userSettings = JSON.parse(localStorage.userSettings); 
      this.userDetails = JSON.parse(localStorage.userDetails); 

      this.via = this.userSettings.via;
      this.settings.via = this.via;
      this.reportDay = this.userSettings.reportDay;
      this.settings.reportDay = this.reportDay;
      this.reportTime = this.userSettings.reportTime;
      this.settings.reportTime = this.reportTime;
      this.bank = this.userSettings.bank;
      this.settings.bank = this.bank;
      this.sellOrBuy = this.userSettings.sellOrBuy;
      this.settings.sellOrBuy = this.sellOrBuy;
      this.currency = this.userSettings.currency;
      this.settings.currency = this.currency;
      this.sellAmountNotify = this.userSettings.sellAmountNotify;
      this.settings.sellAmountNotify = this.sellAmountNotify;
      this.buyAmountNotify = this.userSettings.buyAmountNotify;
      this.settings.buyAmountNotify = this.buyAmountNotify;
      this.notify = this.userSettings.notify;
      this.settings.notify = this.notify;

      this.userSettings = JSON.parse(localStorage.userSettings); 

      if(this.userSettings.reportDay !== "Undefined"){

         this.isViaEmail = true;

      }

    } 
  
  }

  themeEvent(event: any): void {
    console.log(event.target.value);

    switch (event.target.value) {
      case "zarka":
        this.setting.setZarkaTheme(this.zarka);
        break;
      case "indigo":
        this.setting.setZarkaTheme(this.indigo);
        break;
      case "dracula":
        this.setting.setZarkaTheme(this.dracula);
        break;
      case "success":
        this.setting.setZarkaTheme(this.success);
        break;
      default:
        this.setting.setZarkaTheme(this.zarka);
    }

  }
}

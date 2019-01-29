
import { Injectable } from "@angular/core";
//##### imports angularFire for auth and @types/firebase
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
//##### imports angularRouter
import { Router } from "@angular/router";
//##### import custom user-data-type from our model
import { TypeUser, TypeTheme } from "./data.model";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from "ngx-spinner";
//###### Import Setting service
import { SettingService } from "./setting.service";
//#### import evrything from lodash
import * as _ from "lodash";
import { Settings } from '../settings';
import { User } from '../user';
import { TypeBank } from "./data.model";

import { CurrencyService } from "./../shared/currency.service";

import { NotificationService } from './../shared/notification.service';

import { timer } from 'rxjs';






@Injectable({
  providedIn: "root"
})
export class AuthService {

   
  //start of my variable declaration

      //TTTTTTT START
    private  userDetails: User = new User;
    private  userSettings: Settings = new Settings;
  
    private  currencyT: string;
  
      //BankBuyOrSell
      private  bankBuyT: any;
      private bankSellT: any;
   
      //
   
   
      //Bank Data for Eur
      private theBankDataWithSpecificCurrencyT: Array<TypeBank> = [];
      private specificBankDataT: Array<TypeBank> = [];
   
      //
   
      private arrayBuyT: Array<number> = [];
   
      private arraySellT: Array<number> = [];
   
     
   
   
      private countBuyT: number = 0;
      private countSellT: number = 0;
   
      private currentCurrencyNotifyBuyT: string;
      private currentCurrencyNotifySellT: string;
   
      private currenctCurrencyValueNotifyBuyT: number;
      private currenctCurrencyValueNotifySellT: number;
   
   
      private buyT: number;
      private sellT: number;
   
   
      private  sourceT: any = timer(1000, 35000);
   
      //TTTTTTTT END

      //set the user settings declaration

      private emailToSet: string;

      private userEmailAndId: any;

      private userSetting: any;

      private userId: number;

      private settings: Settings = new Settings();

      //set the user settings declaration end

//
  //end of my variable declaration

  //##### keeps temporary token
  public token: string = null;
  //##### keep user data
  private zarkaUser: TypeUser = null;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private toast: ToastService,
    private spinner: NgxSpinnerService,
    private setting: SettingService,
    private currencyService: CurrencyService,
    private  notification: NotificationService,
    
  ) {}

  //##### return a valid token (refresh token) 
  getToken() {
    this.afAuth.auth.currentUser
      .getIdToken()
      .then((token: string) => (this.token = token));
    return this.token;
  }

  //##### test token
  isAuthenticated = () => { return this.zarkaUser != null };

  //##### AngularFire logout
  afLogout() {

    console.log("logout");
    localStorage.removeItem("zarkaUser");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("userSettings");
    localStorage.setItem("controlUserSettings", JSON.stringify(true));
    this.currencyService.changeAuth(false);
    this.afAuth.auth.signOut();
    this.zarkaUser = null;
    this.token = null;
    //##### zarka default theme set
    this.setting.zarkaTheme = {
      navbar: "navbar navbar-dark blue-grey darken-1 navbar-expand-lg",
      sidebar: "left-skew-blue-gray blue-grey darken-1",
      button: "btn btn-outline-blue-grey waves-effect",
      tableTh: "blue-grey darken-1",
      loader: "#607d8b"
    };
    this.router.navigate(["/signin"]);
  }

  //#### Facebook authentication
  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        (res: any) => {
          resolve(res);

          //##### retrieve token
          this.afAuth.auth.currentUser.getIdToken().then((token: string) => {
            //##### assign returned firbase token to variable
            this.token = token;
            //##### route to home
            this.router.navigate(["/home"]);
            //##### assign firebase returned user and token to zarkaUser
            localStorage.setItem(
              "zarkaUser",
              JSON.stringify({ email: res.user.email, token: this.token })
            );
            this.zarkaUser = JSON.parse(localStorage.getItem("zarkaUser"));
            console.log(this.zarkaUser);
          });
        },
        err => {
          console.log(err);
          this.toast.toastError("Authentication", "Facebook Signin error 😓");
          reject(err);
        }
      );
    });
  }
//
  //##### Google authentication
  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      this.afAuth.auth.signInWithPopup(provider).then(
        (res: any) => {
          resolve(res);

          //##### retrieve token
          this.afAuth.auth.currentUser.getIdToken().then((token: string) => {
            //##### assign returned firbase token to variable
            this.token = token;
            //##### route to home
            this.router.navigate(["/home"]);

            //##### assign firebase returned user and token to zarkaUser
            localStorage.setItem(
              "zarkaUser",
              JSON.stringify({ email: res.user.email, token: this.token })
            );
            this.zarkaUser = JSON.parse(localStorage.getItem("zarkaUser"));
            console.log(this.zarkaUser);
          });
        },
        err => {
          console.log(err);
          this.toast.toastError("Authentication", "Google Signin error 😓");
          reject(err);
        }
      );
    });
  }

  //##### signup user with email + passworg
  signupUser(email: string, password: string) {
    //##### spinner starts on init
    this.spinner.show();

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.setting.newUserTheme(email);
        //##### spinner ends after token retrieved
        this.spinner.hide();


        let toastBody: string = `${email} registrared successfully 👍🏼`;
        this.toast.toastInfo("Sign up", toastBody);

        setTimeout(() => { this.router.navigate(["/signin"]); }, 4000);
      })
      .catch(err => {
        console.log(err);
        //##### spinner ends after token retrieved
        this.spinner.hide();
        this.toast.toastError(
          "Sign up",
          "Something went wrong, try different email ☹️"
        );
      });
  }

  //##### signin user with email + passworg
  signinUser(email: string, password: string) {
    //##### spinner starts
    this.spinner.show();
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((res: any) => {
        //##### retrieve token
        this.afAuth.auth.currentUser.getIdToken().then((token: string) => {
          //##### assign returned firbase token to variable
          this.token = token;
          //##### assign firebase returned user and token to zarkaUser localstorage
          localStorage.setItem("zarkaUser", JSON.stringify({ email: res.user.email, token: this.token }));
          //##### get user data from the storage
          this.zarkaUser = JSON.parse(localStorage.getItem("zarkaUser"));

          //##### get user setting from localstorage
          let localTheme: TypeTheme;
          // get themes from storage
          let firebaseThemes = JSON.parse(
            localStorage.getItem("firebaseThemes")
          );
          
          // get user theme from local firebase firebaseThemes
          _.forEach(firebaseThemes, function(value, key) {
            if (value.email == email) {
              localTheme = value;
              return false;
            }
          });

          this.setting.zarkaTheme = localTheme;
          //##### spinner ends after token retrieved
          this.spinner.hide();

          //start of my code

          this.currencyService.changeAuth(true);
          this.currencyService.changeSetTheEmail(this.zarkaUser.email);

          //start to assign data here
          localStorage.setItem("userDetails", JSON.stringify(""));
          localStorage.setItem("userSettings", JSON.stringify(""));
          localStorage.setItem("controlUserSettings", JSON.stringify(false));

        if(JSON.parse(localStorage.userDetails) === "" && JSON.parse(localStorage.userSettings) === ""){

  
          this.emailToSet = this.currencyService.getChangeSetTheEmail();
          console.log(this.emailToSet);
          this.getTheUserEmailIdMethod(this.emailToSet);

          let m = setInterval(() => {


                    if(this.userEmailAndId !== null){
                      
                      console.log("Not First Time User");
                      console.log(this.userEmailAndId);
                        let o = setInterval(() => {
                          
                            this.userId = this.userEmailAndId[0];
                            console.log(this.userId);
                            this.userDetails.id = this.userId;
                            this.userDetails.email = this.userEmailAndId[1];
              
                            localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
                          
                      
                            this.getUserSettings(this.userId);

                            // start of t
        
                                  let t = setInterval(() => {
                                    this.settings.via = this.userSetting.via;
                                    this.settings.reportDay = this.userSetting.reportDay;
                                    this.settings.reportTime = this.userSetting.reportTime;
                                    this.settings.bank = this.userSetting.bank;
                                    this.settings.sellOrBuy = this.userSetting.sellOrBuy;
                                    this.settings.currency = this.userSetting.currency;
                                    this.settings.sellAmountNotify = this.userSetting.sellAmountNotify;
                                    this.settings.buyAmountNotify = this.userSetting.buyAmountNotify;
                                    this.settings.notify = this.userSetting.notify;
                                    console.log("Got Inside set the Settings");
                                    localStorage.setItem("userSettings", JSON.stringify(this.settings));
                          
                                    this.userSettings = JSON.parse(localStorage.userSettings);
                                    console.log(this.userSettings);


                                    
                                    clearInterval(t);
                                  }, 3000);

                            clearInterval(o);
                          }, 3000);

                    }else if(this.userEmailAndId == null){

                      console.log("First Time User");

                      this.emailToSet = this.currencyService.getChangeSetTheEmail();
                      console.log(this.emailToSet);

                     
                      this.userDetails.email = this.emailToSet;
                      localStorage.setItem("userDetails", JSON.stringify(this.userDetails));
                     
                      this.saveUserEmail();
                
 
                              let x = setInterval(() => {
                               
                                console.log(this.userEmailAndId);
                                
                                this.userId = this.userEmailAndId.id;
                                this.userDetails.id = this.userId;
                                console.log(this.userDetails);

                                localStorage.setItem("userDetails", JSON.stringify(this.userDetails));

                                this.getUserSettings(this.userId);
                                         
                                      let c = setInterval(() => {
                                        console.log(this.userSetting);
                                        this.settings.via = this.userSetting.via;
                                        this.settings.reportDay = this.userSetting.reportDay;
                                        this.settings.reportTime = this.userSetting.reportTime;
                                        this.settings.bank = this.userSetting.bank;
                                        this.settings.sellOrBuy = this.userSetting.sellOrBuy;
                                        this.settings.currency = this.userSetting.currency;
                                        this.settings.sellAmountNotify = this.userSetting.sellAmountNotify;
                                        this.settings.buyAmountNotify = this.userSetting.buyAmountNotify;
                                        this.settings.notify = this.userSetting.notify;
                                        console.log(this.settings);
                                        
                                       
                
                                        console.log("Got Inside set the Settings");
                
                                        localStorage.setItem("userSettings", JSON.stringify(this.settings));
                                        this.userSettings = JSON.parse(localStorage.userSettings);
                                       // this.sidebar.setTheSettingsValues();
                                        console.log(this.userSettings);

                                        this.saveSettings(this.userId, this.settings);

                                        clearInterval(c);
                                      }, 3000);

                                clearInterval(x);
                              }, 3000);

                    }

            clearInterval(m);
          }, 2000);


        }
                // //home
                //     let x = setInterval(() => {

                      this.router.navigate(["/home"]);
          
                //       clearInterval(x);
                //  }, 500);


       //home end

          // end of my code

          //##### route to home
          //this.router.navigate(["/home"]);
          console.log(this.zarkaUser);
          
          let i = setInterval(() => {
          this.runNotificationMethod();
          clearInterval(i);
            }, 15000);
        });

        
      })
      .catch(err => {
        console.log(err);
        //##### spinner ends after token retrieved
        this.spinner.hide();
        this.toast.toastError(
          "Authentication",
          "Email or Password incorrect 😱"
        );
      });
  }

  //##### skip authentication
  skipAuth() {

    localStorage.setItem(
      "zarkaUser",
      JSON.stringify({ email: "guest-user@zarka", token: "zarka-default-token" })
    );
    this.zarkaUser = JSON.parse(localStorage.getItem("zarkaUser"));
    //##### route to home
    this.router.navigate(["/home"]);
  }



  //start of my code

  saveSettings(getUserId: any, setting: Settings) {

    this.currencyService.createSettings(getUserId, setting)
      .subscribe(data => console.log(data), error => console.log(error));
    this.settings = new Settings();

  }

  saveUserEmail() {
    this.userDetails = JSON.parse(localStorage.userDetails);
    delete this.userDetails.id;
    console.log(this.userDetails);
    this.currencyService.createUserEmail(this.userDetails).subscribe((userEmailAndId) => { this.userEmailAndId = userEmailAndId; console.log(this.userEmailAndId); });

  }

  getUserSettings(getUserId: any) {
    console.log(getUserId);
    this.currencyService.createSettingsWithId(getUserId).subscribe(userSetting => { this.userSetting = userSetting; console.log(this.userSetting); });

  }

  getTheUserEmailIdMethod(theEmail: string) {
    console.log(theEmail);
    this.currencyService.getUserEmailAndId(theEmail).subscribe((userEmailAndId) => { this.userEmailAndId = userEmailAndId; console.log(this.userEmailAndId); });

  }
  runNotificationMethod() {


    console.log("GOT GOT GOT GOT GOT");

    const subscribe = this.sourceT.subscribe(val => {

          
      if (localStorage.userSettings === undefined) {

      } else {
        
          //this.checkIfThereAreChanges();//


   this.userSettings = JSON.parse(localStorage.userSettings);

    console.log(this.userSettings);

    if(localStorage.userDetails !== undefined 
      && this.userSettings.currency !="Undefined"
      &&(this.userSettings.buyAmountNotify !=0 || this.userSettings.sellAmountNotify !=0) 
      && (this.userSettings.via !="Undefined"
      && this.userSettings.via !="Email")
      && this.userSettings.bank != "Undefined"
      && this.userSettings.notify != false
      && this.userSettings.sellOrBuy !="Undefined"){
        //
      let bankData = JSON.parse(localStorage.bankStorage);
  
           this.currencyT = this.userSettings.currency.toUpperCase();
  
          console.log(this.userSettings);
          console.log(this.currencyT);
  
        
            bankData.forEach(banksElement => {
  
                          if(banksElement[2] === this.currencyT){
                           
                            this.theBankDataWithSpecificCurrencyT.push(banksElement);
                          }

  
           });
          // console.log(bankData);
      
           //specificBankData
           this.theBankDataWithSpecificCurrencyT.forEach(banksElement => {
  
               if(this.userSettings.bank == "All"){  //bankData
  
                this.specificBankDataT.push(banksElement);
  
               }else if(this.userSettings.bank == "FNB" && banksElement[0] == "FNB"){
                
                this.specificBankDataT.push(banksElement);
  
                }else if(this.userSettings.bank == "ABSA" && banksElement[0] == "ABSA"){
                  
                  this.specificBankDataT.push(banksElement);
                  
                  }else if(this.userSettings.bank == "STANDARD" && banksElement[0] == "STANDARD BANK"){
                    
                    this.specificBankDataT.push(banksElement);
                    
                    }else if(this.userSettings.bank == "NEDBANK" && banksElement[0] == "NEDBANK"){
                     
                      this.specificBankDataT.push(banksElement);
                      
                      }else if(this.userSettings.bank == "BIDVEST" && banksElement[0] == "BIDVEST BANK"){
                        
                        this.specificBankDataT.push(banksElement);
                        
                        }
  
        });
     
        
        this.specificBankDataT.forEach(banksElement => {
  
                  if(this.userSettings.sellOrBuy == "Both"){
  
                    this.arrayBuyT.push(banksElement[3]);
  
                    this.arraySellT.push(banksElement[4]);
  
  
                  }else if(this.userSettings.sellOrBuy == "Buy"){
  
                    this.arrayBuyT.push(banksElement[3]);
  
                  }else if(this.userSettings.sellOrBuy == "Sell"){
  
                    this.arraySellT.push(banksElement[4]);
  
                  }
            
           });
  
          
  
  
            this.buyT = Math.max(...this.arrayBuyT) // 4
            this.sellT = Math.min(...this.arraySellT) // 1
  
           
  
            this.specificBankDataT.forEach(banksElement => {
  
                            if(banksElement[3] == this.buyT){
  
                              this.bankBuyT = banksElement[0];
  
                            } 
                            if(banksElement[4] == this.sellT){
                              this.bankSellT = banksElement[0];
                            } 
  
  
                    });
            
  
  
                    // let currentCurrencyNotify: string;
  
                    // let currenctCurrencyValueNotify: number;
  
  
                  if(this.buyT >= this.userSettings.buyAmountNotify  &&  this.userSettings.sellOrBuy == "Both"){
  
                   
  
                    if(this.countBuyT!== 0 && (this.userSettings.currency !== this.currentCurrencyNotifyBuyT || this.userSettings.buyAmountNotify !== this.currenctCurrencyValueNotifyBuyT)){
                      this.countBuyT = 0;
                    }
  
                    if(this.countBuyT == 0){
  
                      this.currentCurrencyNotifyBuyT = this.userSettings.currency;
                      this.currenctCurrencyValueNotifyBuyT = this.userSettings.buyAmountNotify;
          
  
                    }
                    if(this.countBuyT ==0){
                            
                                console.log("FIRST TIME");
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                    //console.log(buy);
                                    //##### notify user in case of update
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST BUY: ${this.buyT} AT ${this.bankBuyT}`});
                                  // //console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                                this.countBuyT++;
  
                              }else if(this.userSettings.currency == this.currentCurrencyNotifyBuyT && this.userSettings.buyAmountNotify == this.currenctCurrencyValueNotifyBuyT){
  
                                console.log("SECOND TIME");
  
                                // setTimeout(() => {
                                //   if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                //     //console.log(buy);
                                //     //##### notify user in case of update
                                //     this.notification.notifiy({ header: "New", body: `${currency} BEST BUY: ${buy} AT ${bankBuy}`});
                                //   // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                //   }
                                // }, 5000);
  
                              }else{
                                
                                
                                console.log("THERE IS SOME CHANGES");
  
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                    //console.log(buy);
                                    //#### notify user in case of update
                                    
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST BUY: ${this.buyT} AT ${this.bankBuyT}`});
                                  // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                              }
                              
                     
               
  
                  }
                  
                  if(this.sellT <= this.userSettings.sellAmountNotify  &&  this.userSettings.sellOrBuy == "Both"){
  
                    let y = setInterval(() => {
  
  
  
                      if(this.countSellT!== 0 && (this.userSettings.currency !== this.currentCurrencyNotifySellT || this.userSettings.sellAmountNotify !== this.currenctCurrencyValueNotifySellT)){
                        this.countSellT = 0;
                      }
  
  
  
  
                      
  
                      if(this.countSellT == 0){
  
                        this.currentCurrencyNotifySellT = this.userSettings.currency;
                        this.currenctCurrencyValueNotifySellT = this.userSettings.sellAmountNotify;
            
  
                      }
                      if(this.countSellT ==0){
  
                                  console.log("FIRST TIME");
                                  setTimeout(() => {
                                    if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                      //console.log(buy);
                                      //##### notify user in case of update
                                      this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST SELL: ${this.sellT} AT ${this.bankSellT}`});
                                    // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                    }
                                  }, 1000);
  
                                  this.countSellT++;
  
                                }else if(this.userSettings.currency == this.currentCurrencyNotifySellT && this.userSettings.sellAmountNotify == this.currenctCurrencyValueNotifySellT){
  
                                  console.log("SECOND TIME");
  
                                  // setTimeout(() => {
                                  //   if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                  //     //console.log(buy);
                                  //     //##### notify user in case of update
                                  //     this.notification.notifiy({ header: "New", body: `${currency} BEST BUY: ${buy} AT ${bankBuy}`});
                                  //   // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  //   }
                                  // }, 5000);
  
                                }else{
  
                                  console.log("THERE IS SOME CHANGES");
  
                                  setTimeout(() => {
                                    if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                      //console.log(buy);
                                      //##### notify user in case of update
                                      this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST SELL: ${this.sellT} AT ${this.bankSellT}`});
                                    // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                    }
                                  }, 1000);
  
                                }
  
                              clearInterval(y);
                            },17000);
  
                  }
                  //
                  if(this.sellT <= this.userSettings.sellAmountNotify  &&  this.userSettings.sellOrBuy == "Sell"){
  
                    if(this.countSellT!== 0 && (this.userSettings.currency !== this.currentCurrencyNotifySellT || this.userSettings.sellAmountNotify !== this.currenctCurrencyValueNotifySellT)){
                      this.countSellT = 0;
                    }
  
                   
  
                    if(this.countSellT == 0){
  
                      this.currentCurrencyNotifySellT = this.userSettings.currency;
                      this.currenctCurrencyValueNotifySellT = this.userSettings.sellAmountNotify;
          
  
                    }
                    if(this.countSellT == 0){
  
                                console.log("FIRST TIME");
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                    //console.log(buy);
                                    //##### notify user in case of update
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST SELL: ${this.sellT} AT ${this.bankSellT}`});
                                  // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                                this.countSellT++;
  
                              }else if(this.userSettings.currency == this.currentCurrencyNotifySellT && this.userSettings.sellAmountNotify == this.currenctCurrencyValueNotifySellT){
  
                                console.log("SECOND TIME");
  
                                // setTimeout(() => {
                                //   if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                //     //console.log(buy);
                                //     //##### notify user in case of update
                                //     this.notification.notifiy({ header: "New", body: `${currency} BEST BUY: ${buy} AT ${bankBuy}`});
                                //   // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                //   }
                                // }, 5000);
  
                              }else{
  
                                console.log("THERE IS SOME CHANGES");
  
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                    //console.log(buy);
                                    //##### notify user in case of update
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST SELL: ${this.sellT} AT ${this.bankSellT}`});
                                  // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                              }
                    
                  }
  
                  if(this.buyT >= this.userSettings.buyAmountNotify  &&  this.userSettings.sellOrBuy == "Buy"){
  
                    if(this.countBuyT!== 0 && (this.userSettings.currency !== this.currentCurrencyNotifyBuyT || this.userSettings.buyAmountNotify !== this.currenctCurrencyValueNotifyBuyT)){
                      this.countBuyT = 0;
                    }
  
                    if(this.countBuyT== 0){
  
                      this.currentCurrencyNotifyBuyT = this.userSettings.currency;
                      this.currenctCurrencyValueNotifyBuyT = this.userSettings.buyAmountNotify;
          
  
                    }
                    if(this.countBuyT ==0){
                            let bankData = JSON.parse(localStorage.bankStorage);
                            
                                
                                console.log("FIRST TIME");
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                    //console.log(buy);
                                    //##### notify user in case of update
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST BUY: ${this.buyT} AT ${this.bankBuyT}`});
                                  // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                                this.countBuyT++;
  
                              }else if(this.userSettings.currency == this.currentCurrencyNotifyBuyT && this.userSettings.buyAmountNotify == this.currenctCurrencyValueNotifyBuyT){
  
                                console.log("SECOND TIME");
  
                                // setTimeout(() => {
                                //   if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  
                                //     //console.log(buy);
                                //     //##### notify user in case of update
                                //     this.notification.notifiy({ header: "New", body: `${currency} BEST BUY: ${buy} AT ${bankBuy}`});
                                //   // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                //   }
                                // }, 5000);
  
                              }else{
                                let bankData = JSON.parse(localStorage.bankStorage);
                               
                                console.log("THERE IS SOME CHANGES");
  
                                setTimeout(() => {
                                  if (_.intersectionWith([9,9], [9,9], _.isEqual).length !== 0) {
  //
                                    //console.log(buy);
                                    //##### notify user in case of update
                                    console.log(this.currencyT);
                                    this.notification.notifiy({ header: "New", body: `${this.currencyT} BEST BUY: ${this.buyT} AT ${this.bankBuyT}`});
                                  // console.log("YESYESYESYESYESYESYEBUYBUYBUYBUY");
                                  }
                                }, 1000);
  
                              }
                 
                  }
  
                 this.theBankDataWithSpecificCurrencyT = [];
                 this.specificBankDataT  = [];
  
  
                this.arrayBuyT = [];
  
                this.arraySellT = [];
  
         }

      }

    });
   
  }

} // end service

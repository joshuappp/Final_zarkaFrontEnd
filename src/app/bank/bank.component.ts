import { Component, OnInit } from "@angular/core";
//#### import charts
import { Chart } from "chart.js";
//#### import evrything from lodash
import * as _ from "lodash";
//##### import everything from moment
import * as moment from "moment";
//##### import custom bank-data-type from our model
import { TypeBank, TypeDatasetChart } from "./../shared/data.model";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from 'ngx-spinner';
import { CurrencyService } from "./../shared/currency.service";
import { NotificationService } from "./../shared/notification.service";


@Component({
  selector: "app-bank",
  templateUrl: "./bank.component.html",
  styleUrls: ["./bank.component.scss"]
})


export class BankComponent implements OnInit {
  //##### hold bankData from the storage
  bankData: Array<TypeBank> = [];

  //##### hold historyData from the storage
  hitoryData: Array<TypeBank> = [];

  //##### currency dropdown data
  currencies: string[] = [];

  bankNameSpecData: any[] = [];

  //############ COUNTER SELECTED
  counterSelelected: number = 1;
  countMonths: number = 1;

  //##### Bank names
  bankNames: string[] = [];
  bankNames2: any[] = [];

  //##### last updated data
  updatedDate: any;
  
  //##### chart data
  chartBuyBank: any;
  chartSellBank: any;

  //THE DATES OF THE MONTHS
  monthArray: string[] = [];
  month = ["January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"];
  allDatesArray: number[] = [];
  currentMonth: number = 0;

  firstMonthCount = 0;
  secondMonthCount = 0;
  thirdMonthCount = 0;

  ///Selected Currency Variable
  selectedCurrency: string = '';
  currenySelected: boolean = true;

  //########################### Average Values of months to be set to the graphs when curreny is selected

  //##########################################SORTED VARIABLES

  bankSellFirstMonth: number[] = [];
  bankBuyFirstMonth: number[] = [];


  bankSellSecondMonth: number[] = [];
  bankBuySecondMonth: number[] = [];

  bankSellThirdMonth: number[] = [];
  bankBuyThirdMonth: number[] = [];


  //#######################SORTED VARIABLES

  bankSellArray: number[] = [];

  bankBuyArray: number[] = [];

  //#######################SORTED VARIABLES MIN

  bankSellValueMin: number;

  bankBuyValueMin: number;

  //#######################SORTED VARIABLES MAX

  bankSellValueMax: number;

  bankBuyValueMax: number;

  // FirstMonth Month
  AbsaBuyAverageFirstMonth: number = 0;
  FnbBuyAverageFirstMonth: number = 0;
  NedBankBuyAverageFirstMonth: number = 0;
  StandardBuyAverageFirstMonth: number = 0;
  BidVestBuyAverageFirstMonth: number = 0;

  AbsaSellAverageFirstMonth: number = 0;
  FnbSellAverageFirstMonth: number = 0;
  NedBankSellAverageFirstMonth: number = 0;
  StandardSellAverageFirstMonth: number = 0;
  BidVestSellAverageFirstMonth: number = 0;

  // SecondMonth Month
  AbsaBuyAverageSecondMonth: number = 0;
  FnbBuyAverageSecondMonth: number = 0;
  NedBankBuyAverageSecondMonth: number = 0;
  StandardBuyAverageSecondMonth: number = 0;
  BidVestBuyAverageSecondMonth: number = 0;

  AbsaSellAverageSecondMonth: number = 0;
  FnbSellAverageSecondMonth: number = 0;
  NedBankSellAverageSecondMonth: number = 0;
  StandardSellAverageSecondMonth: number = 0;
  BidVestSellAverageSecondMonth: number = 0;

  // SecondMonth Month
  AbsaBuyAverageThirdMonth: number = 0;
  FnbBuyAverageThirdMonth: number = 0;
  NedBankBuyAverageThirdMonth: number = 0;
  StandardBuyAverageThirdMonth: number = 0;
  BidVestBuyAverageThirdMonth: number = 0;

  AbsaSellAverageThirdMonth: number = 0;
  FnbSellAverageThirdMonth: number = 0;
  NedBankSellAverageThirdMonth: number = 0;
  StandardSellAverageThirdMonth: number = 0;
  BidVestSellAverageThirdMonth: number = 0;

  //############################ METHOD TO ASSIGN SELECTED CURRENCY
  selectCurrenyEvent(event: any) {

    this.absaFirstSecondThirdMonthBuyAverages = [];
    this.nedbankFirstSecondThirdMonthBuyAverages = [];
    this.standardFirstSecondThirdMonthBuyAverages = [];
    this.bidvestFirstSecondThirdMonthBuyAverages = [];
    this.fnbFirstSecondThirdMonthBuyAverages = [];

    //##########  Currency bank sell #################
    this.absaFirstSecondThirdMonthSellAverages = [];
    this.nedbankFirstSecondThirdMonthSellAverages = [];
    this.standardFirstSecondThirdMonthSellAverages = [];
    this.bidvestFirstSecondThirdMonthSellAverages = [];
    this.fnbFirstSecondThirdMonthSellAverages = [];

    //################################SORTED SET VALUES


    this.bankSellFirstMonth = [];
    this.bankBuyFirstMonth = [];

    this.bankSellSecondMonth = [];
    this.bankBuySecondMonth = [];

    this.bankSellThirdMonth = [];
    this.bankBuyThirdMonth = [];

    this.bankSellValueMin = 0;
    this.bankBuyValueMin = 0;

    this.bankSellArray.length = 0;
    this.bankBuyArray.length = 0;

    this.monthArray.length = 0;

    this.selectedCurrency = event.target.value;
    this.counterSelelected = 0;
    this.countMonths = 1;

    this.setCurrencyValues();
  }

  //####################################################################################################### MY ARRAY DECLARATION

  //############################################################################# CURRENY

  bankCurrencyArray: Array<TypeBank> = [];

  //########################################## FNB CURRENY

  fnbArray: Array<TypeBank> = [];
  fnbWithArray: Array<TypeBank> = [];

  //######FNB BUY
  fnbWithBuyArray: Array<number> = [];
  fnbWithBuyArraySum: number = 0;
  fnbBuyAverageOfCurreny: number = 0;

  //######## END OF FNB BUY

  //###### FNB SELL
  fnbWithSellArray: Array<number> = [];
  fnbWithSellArraySum: number = 0;
  fnbSellAverageOfCurreny: number = 0;
  //######## END OF FNB SELL

  //##################################### END OF FNB CURRENY

  //########################################## ABSA CURRENY

  AbsaArray: Array<TypeBank> = [];
  AbsaWithArray: Array<TypeBank> = [];

  //######ABSA BUY

  AbsaWithBuyArray: Array<number> = [];
  AbsaWithBuyArraySum: number = 0;
  AbsaBuyAverageOfCurreny: number = 0;

  //######## END OF ABSA BUY

  //###### FNB SELL
  AbsaWithSellArray: Array<number> = [];
  AbsaWithSellArraySum: number = 0;
  AbsaSellAverageOfCurreny: number = 0;
  //######## END OF ABSA SELL

  //##################################### END OF ABSA CURRENY

  //########################################## NEDBANK CURRENY

  NedBankArray: Array<TypeBank> = [];
  NedBankWithArray: Array<TypeBank> = [];

  //######NEDBANK BUY

  NedBankWithBuyArray: Array<number> = [];
  NedBankWithBuyArraySum: number = 0;
  NedBankBuyAverageOfCurreny: number = 0;

  //######## END OF NEDBANK BUY

  //###### NEDBANK SELL
  NedBankWithSellArray: Array<number> = [];
  NedBankWithSellArraySum: number = 0;
  NedBankSellAverageOfCurreny: number = 0;
  //######## END OF NEDBANK SELL

  //##################################### END OF NEDBANK CURRENY

  //########################################## STANDARD CURRENY

  StandardArray: Array<TypeBank> = [];
  StandardWithArray: Array<TypeBank> = [];

  //######STANDARD BUY

  StandardWithBuyArray: Array<number> = [];
  StandardWithBuyArraySum: number = 0;
  StandardBuyAverageOfCurreny: number = 0;

  //######## END OF STANDARD BUY

  //###### STANDARD SELL
  StandardWithSellArray: Array<number> = [];
  StandardWithSellArraySum: number = 0;
  StandardSellAverageOfCurreny: number = 0;
  //######## END OF STANDARD SELL

  //##################################### END OF STANDARD CURRENY

  //########################################## BIDVEST CURRENY
  BidVestArray: Array<TypeBank> = [];
  BidVestWithArray: Array<TypeBank> = [];

  //######STANDARD BUY

  BidVestWithBuyArray: Array<number> = [];
  BidVestWithBuyArraySum: number = 0;
  BidVestBuyAverageOfCurreny: number = 0;

  //######## END OF STANDARD BUY

  //###### STANDARD SELL
  BidVestWithSellArray: Array<number> = [];
  BidVestWithSellArraySum: number = 0;
  BidVestSellAverageOfCurreny: number = 0;
  //######## END OF STANDARD SELL

  //##################################### END OF STANDARD CURRENY

  //############################################################################################################# END CURRENY

  //################ AVERAGE FOR BANKS DECLARATION START
  //##########  Currency bank buy ##################
  absaFirstSecondThirdMonthBuyAverages: any[] = [];
  nedbankFirstSecondThirdMonthBuyAverages: any[] = [];
  standardFirstSecondThirdMonthBuyAverages: any[] = [];
  bidvestFirstSecondThirdMonthBuyAverages: any[] = [];
  fnbFirstSecondThirdMonthBuyAverages: any[] = [];

  //##########  Currency bank sell ##################
  absaFirstSecondThirdMonthSellAverages: any[] = [];
  nedbankFirstSecondThirdMonthSellAverages: any[] = [];
  standardFirstSecondThirdMonthSellAverages: any[] = [];
  bidvestFirstSecondThirdMonthSellAverages: any[] = [];
  fnbFirstSecondThirdMonthSellAverages: any[] = [];

  //################ AVERAGE FOR BANKS DECLARATION END

  //####### MONTH COUNT
  //###############################################################################################################END OF MY ARRAY DECLARATION

  //##### constructor init electron native and notification service
  constructor(
    //private _electronService: ElectronService,
    private spinner: NgxSpinnerService,
    private notification: NotificationService,
    private currencyService: CurrencyService,
  ) { }

  //##### OnInit...
  ngOnInit() {

    //##### this runs in an interval until condition met (runs like an ansyc await function)
    var getBankInterval = setInterval(() => {

      this.currencyService.refreshData();
      //##### check localstorage is set
      if (localStorage.bankStorage !== undefined) {
        //##### clear the interval when local storage is set
        clearInterval(getBankInterval);

        //##### assign storage data to bankData
        this.bankData = JSON.parse(localStorage.bankStorage);

        //##### assign storage data to historyData
        this.hitoryData = JSON.parse(localStorage.historyStorage);

        //#########   SET THE DATES
        this.getTheCurrentFirstThreeMonth();

        //###########  START IMP

        //###########  END IMP

        //#########   CALL setUsdValues METHOD FOR DEFAULT USD SELECTED
        this.setCurrencyValues();

        //console.log(this.bankData);

        setInterval(() => {
          //##### get the date of the first element in the array as last updated
          this.updatedDate = moment(
            this.bankData[0][5],
            "YYYY-MM-DD h:mm:ss"
          ).fromNow();
        }, 1000);

        this.getBankData();
        this.chartBuying();
        this.chartSelling();
      }
    }, 500);

    this.getBankDataAsync();
  } //# end ngOnInit

  //##### run only when localstorage is ready (void<Promise>)
  async getBankDataAsync() {
    // spinner starts on init 
    this.spinner.show();
    // wait until bankdata is ready in the storage then, assign it a variable or assign an empty array 
    this.bankData = (await localStorage.bankStorage) !== undefined ? JSON.parse(localStorage.bankStorage) : [];
    // set dropdown currencies
    this.currencies = _.uniq(this.bankData.map(data => data[2])).sort();
    // set selectCurrency to default first element of currencies
    this.selectedCurrency = this.currencies[0].toString();

    this.setBankData();
    // stop spinner half second after everything excuted
    setTimeout(() => { this.spinner.hide() }, 500);
  }

  setBankData() {
    // get uniq bank names
    this.bankNames = _.uniq(this.bankData.map(data => data[0]));
    // push each bank name as array to bankNameSpecData
    this.bankNames.map((data, index) => { this.bankNameSpecData.push([]); this.bankNameSpecData[index].push(data) });

    // push each bank specific data as a new array in the second position of bankNameSpectData
    for (let i = 0; i < this.bankNameSpecData.length; i++) {
      for (let j = 0; j < this.bankData.length; j++) {
        if (this.bankNameSpecData[i][0] == this.bankData[j][0]) this.bankNameSpecData[i].push(this.bankData[j]);
      }
    }
  }

  setCurrencyValues() {
    //PUT VALUES FOR TWO MONTHS
    while (this.countMonths <= this.allDatesArray.length) {
      if (this.countMonths == 1) {
        this.currentMonth = this.allDatesArray[0];

      } else if (this.countMonths == 2) {
        this.currentMonth = this.allDatesArray[1];

      } else if (this.countMonths == 3) {
        this.currentMonth = this.allDatesArray[2];
      }

      if (this.counterSelelected == 1) {

        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        this.currenySelected = true;
        this.setFnbGraph();
        this.setAbsaGraph();
        this.setNedBankGraph();
        this.setStandardGraph();
        this.setBidVestGraph();
        this.setSortedArrays();

        sleep(500).then(() => {
          //do stuff
          this.chartBuying();
          this.chartSelling();
        });

      } else if (this.selectedCurrency === "USD" || this.selectedCurrency === "EUR" || this.selectedCurrency === "GBP" || this.selectedCurrency === "CAD" || this.selectedCurrency === "CHF" || this.selectedCurrency === "JPY") {

        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        //this.currenySelected = true;

        this.setFnbGraph();
        this.setAbsaGraph();
        this.setNedBankGraph();
        this.setStandardGraph();
        this.setBidVestGraph();
        this.setSortedArrays();

        sleep(500).then(() => {
          //do stuf
          this.chartBuying();
          this.chartSelling();

        });
      }

      this.countMonths++;
      this.firstMonthCount = 0;
      this.secondMonthCount = 0;
      this.thirdMonthCount = 0;
    }
  }
  //###### GET THE PREVIOUS THREE MONTH
  getTheCurrentFirstThreeMonth() {
    this.hitoryData.forEach(banksElement => {

      let currentDate = banksElement[5].substring(5, 7);
      this.allDatesArray.push(Number.parseInt(currentDate));
    })

    //#### Verify that each selected dates in array is unique
    this.allDatesArray = _.uniq(this.allDatesArray);

    //#######  PUT ONLY THREE OR LESS THAN THREE MONTH IN AN allDatesArray ARRAY
    this.setThreeMonthOrLess();
  }

  //#######  PUT ONLY THREE OR LESS THAN THREE MONTH IN AN allDatesArray ARRAY
  setThreeMonthOrLess() {

    if (this.allDatesArray.length === 4) {
      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 1);

    } else if (this.allDatesArray.length === 5) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 2);

    } else if (this.allDatesArray.length === 6) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 3);

    } else if (this.allDatesArray.length === 7) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 4);

    } else if (this.allDatesArray.length === 8) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 5);

    } else if (this.allDatesArray.length === 9) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 6);

    } else if (this.allDatesArray.length === 10) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 7);

    } else if (this.allDatesArray.length === 11) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 8);

    } else if (this.allDatesArray.length === 12) {

      this.allDatesArray.splice(this.allDatesArray.indexOf(this.allDatesArray[0]), 9);
    }
  }

  //######  mycode start
  setFnbGraph() {

    //#####  FNB BUY START
    this.hitoryData.forEach(banksElement => {

      let theDate = Number.parseInt(banksElement[5].substring(5, 7));

      if (banksElement[0] == "FNB" && theDate == this.currentMonth && this.countMonths == 1) {
        // console.log(theDate);
        this.fnbArray.push(banksElement);

        if (this.firstMonthCount == 0) {
          this.monthArray.push(this.month[this.currentMonth - 1]);
          this.firstMonthCount++;
        }
      } else if (banksElement[0] == "FNB" && theDate == this.currentMonth && this.countMonths == 2) {

        this.fnbArray.push(banksElement);

        if (this.secondMonthCount == 0) {
          this.monthArray.push(this.month[this.currentMonth - 1]);
          this.secondMonthCount++;
        }
      } else if (banksElement[0] == "FNB" && theDate == this.currentMonth && this.countMonths == 3) {
        //console.log(this.currentMonth);
        //console.log("dbhbnbrbnoe got inside");
        this.fnbArray.push(banksElement);

        if (this.thirdMonthCount == 0) {
          this.monthArray.push(this.month[this.currentMonth - 1]);
          this.thirdMonthCount++;
        }
      }
    });
    //console.log(this.fnbWithArray);
    this.fnbWithArray = this.getCurrenySelected(this.selectedCurrency, this.fnbArray);
    this.fnbWithArray.forEach(GetfnbWithBuyArray => {
      this.fnbWithBuyArray.push(GetfnbWithBuyArray[3]);
    });

    this.fnbWithBuyArray.forEach(value => {
      this.fnbWithBuyArraySum = this.fnbWithBuyArraySum + value;
    });
    //console.log("FNB BUY " + this.fnbWithBuyArraySum / this.fnbWithBuyArray.length);
    this.fnbBuyAverageOfCurreny = this.fnbWithBuyArraySum / this.fnbWithBuyArray.length;
    //#####  FNB BUY END
    //====================================================================================

    //#####  FNB SELL START
    this.fnbWithArray.forEach(GetfnbWithUsdSellArray => {
      this.fnbWithSellArray.push(GetfnbWithUsdSellArray[4]);
    });

    this.fnbWithSellArray.forEach(value => {
      this.fnbWithSellArraySum = this.fnbWithSellArraySum + value;
    });
    //console.log("FNB SELL " + this.fnbWithSellArraySum / this.fnbWithSellArray.length);
    this.fnbSellAverageOfCurreny = this.fnbWithSellArraySum / this.fnbWithSellArray.length;
    //#####  FNB SELL END

    //################### Set fnb Values to the graphs

    if (this.countMonths == 1) {
      this.FnbBuyAverageFirstMonth = this.fnbBuyAverageOfCurreny;
      this.FnbSellAverageFirstMonth = this.fnbSellAverageOfCurreny;

      // //############### Sorttttttttt data

      this.bankBuyFirstMonth.push(this.FnbBuyAverageFirstMonth);
      this.bankSellFirstMonth.push(this.FnbSellAverageFirstMonth);

      //ARRAY Population
      this.fnbFirstSecondThirdMonthBuyAverages.push(this.FnbBuyAverageFirstMonth.toFixed(2));
      this.fnbFirstSecondThirdMonthSellAverages.push(this.FnbSellAverageFirstMonth.toFixed(2));

    } else if (this.countMonths == 2) {

      this.FnbBuyAverageSecondMonth = this.fnbBuyAverageOfCurreny;
      this.FnbSellAverageSecondMonth = this.fnbSellAverageOfCurreny;

      //  //############### Sorttttttttt data

      this.bankBuySecondMonth.push(this.FnbBuyAverageSecondMonth);
      this.bankSellSecondMonth.push(this.FnbSellAverageSecondMonth);

      //ARRAY Population
      this.fnbFirstSecondThirdMonthBuyAverages.push(this.FnbBuyAverageSecondMonth.toFixed(2));
      this.fnbFirstSecondThirdMonthSellAverages.push(this.FnbSellAverageSecondMonth.toFixed(2));

    }
    else if (this.countMonths == 3) {

      this.FnbBuyAverageThirdMonth = this.fnbBuyAverageOfCurreny;
      this.FnbSellAverageThirdMonth = this.fnbSellAverageOfCurreny;

      //  //############### Sorttttttttt data

      this.bankBuyThirdMonth.push(this.FnbBuyAverageThirdMonth);
      this.bankSellThirdMonth.push(this.FnbSellAverageThirdMonth);

      //ARRAY Population
      this.fnbFirstSecondThirdMonthBuyAverages.push(this.FnbBuyAverageThirdMonth.toFixed(2));
      this.fnbFirstSecondThirdMonthSellAverages.push(this.FnbSellAverageThirdMonth.toFixed(2));

    }

    //################### Set fnb Values to 0

    this.fnbArray = [];
    this.fnbWithArray = [];
    this.fnbWithBuyArray = [];
    this.fnbWithBuyArraySum = 0;
    this.fnbWithSellArray = [];
    this.fnbWithSellArraySum = 0;
    this.bankCurrencyArray = [];
  }

  setAbsaGraph() {

    //#####  ABSA BUY START
    this.hitoryData.forEach(banksElement => {

      let theDate = Number.parseInt(banksElement[5].substring(5, 7));

      if (banksElement[0] == "ABSA" && theDate == this.currentMonth && this.countMonths == 1) {

        this.AbsaArray.push(banksElement);

      } else if (banksElement[0] == "ABSA" && theDate == this.currentMonth && this.countMonths == 2) {

        this.AbsaArray.push(banksElement);

      } else if (banksElement[0] == "ABSA" && theDate == this.currentMonth && this.countMonths == 3) {

        this.AbsaArray.push(banksElement);

      }

    });

    this.AbsaWithArray = this.getCurrenySelected(this.selectedCurrency, this.AbsaArray);

    this.AbsaWithArray.forEach(GetAbsaWithBuyArray => {

      this.AbsaWithBuyArray.push(GetAbsaWithBuyArray[3]);

    });

    this.AbsaWithBuyArray.forEach(value => {
      this.AbsaWithBuyArraySum = this.AbsaWithBuyArraySum + value;
    });

    //console.log("ABSA BUY  " + this.AbsaWithBuyArraySum / this.AbsaWithBuyArray.length);
    this.AbsaBuyAverageOfCurreny = this.AbsaWithBuyArraySum / this.AbsaWithBuyArray.length;
    //#####  ABSA BUY END

    //====================================================================================

    //#####  ABSA SELL START

    this.AbsaWithArray.forEach(GetAbsaWithUsdSellArray => {

      this.AbsaWithSellArray.push(GetAbsaWithUsdSellArray[4]);
    });

    this.AbsaWithSellArray.forEach(value => {
      this.AbsaWithSellArraySum = this.AbsaWithSellArraySum + value;
    });

    //console.log("ABSA SELL  " + this.AbsaWithSellArraySum / this.AbsaWithSellArray.length);
    this.AbsaSellAverageOfCurreny = this.AbsaWithSellArraySum / this.AbsaWithSellArray.length;
    //#####  ABSA SELL END

    //################### Set Absa Values to the graphs

    if (this.countMonths == 1) {

      this.AbsaBuyAverageFirstMonth = this.AbsaBuyAverageOfCurreny;
      this.AbsaSellAverageFirstMonth = this.AbsaSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyFirstMonth.push(this.AbsaBuyAverageFirstMonth);
      this.bankSellFirstMonth.push(this.AbsaSellAverageFirstMonth);

      //ARRAY PO
      this.absaFirstSecondThirdMonthBuyAverages.push(this.AbsaBuyAverageFirstMonth.toFixed(2));
      this.absaFirstSecondThirdMonthSellAverages.push(this.AbsaSellAverageFirstMonth.toFixed(2));

    } else if (this.countMonths == 2) {

      this.AbsaBuyAverageSecondMonth = this.AbsaBuyAverageOfCurreny;
      this.AbsaSellAverageSecondMonth = this.AbsaSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuySecondMonth.push(this.AbsaBuyAverageSecondMonth);
      this.bankSellSecondMonth.push(this.AbsaSellAverageSecondMonth);

      //ARRAY PO
      this.absaFirstSecondThirdMonthBuyAverages.push(this.AbsaBuyAverageSecondMonth.toFixed(2));
      this.absaFirstSecondThirdMonthSellAverages.push(this.AbsaSellAverageSecondMonth.toFixed(2));

    } else if (this.countMonths == 3) {

      this.AbsaBuyAverageThirdMonth = this.AbsaBuyAverageOfCurreny;
      this.AbsaSellAverageThirdMonth = this.AbsaSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyThirdMonth.push(this.AbsaBuyAverageThirdMonth);
      this.bankSellThirdMonth.push(this.AbsaSellAverageThirdMonth);

      //ARRAY PO
      this.absaFirstSecondThirdMonthBuyAverages.push(this.AbsaBuyAverageThirdMonth.toFixed(2));
      this.absaFirstSecondThirdMonthSellAverages.push(this.AbsaSellAverageThirdMonth.toFixed(2));
    }

    //################### Set Absa Values to 0

    this.AbsaArray = [];
    this.AbsaWithArray = [];
    this.AbsaWithBuyArray = [];
    this.AbsaWithBuyArraySum = 0;
    this.AbsaWithSellArray = [];
    this.AbsaWithSellArraySum = 0;
    this.bankCurrencyArray = [];
  }

  setNedBankGraph() {

    //#####  NEDBANK BUY START
    this.hitoryData.forEach(banksElement => {

      let theDate = Number.parseInt(banksElement[5].substring(5, 7));

      if (banksElement[0] == "NEDBANK" && theDate == this.currentMonth && this.countMonths == 1) {

        this.NedBankArray.push(banksElement);

      } else if (banksElement[0] == "NEDBANK" && theDate == this.currentMonth && this.countMonths == 2) {

        this.NedBankArray.push(banksElement);

      } else if (banksElement[0] == "NEDBANK" && theDate == this.currentMonth && this.countMonths == 3) {

        this.NedBankArray.push(banksElement);

      }
    });

    this.NedBankWithArray = this.getCurrenySelected(this.selectedCurrency, this.NedBankArray);

    this.NedBankWithArray.forEach(GetNedBankWithUsdBuyArray => {

      this.NedBankWithBuyArray.push(GetNedBankWithUsdBuyArray[3]);
    });

    this.NedBankWithBuyArray.forEach(value => {
      this.NedBankWithBuyArraySum = this.NedBankWithBuyArraySum + value;
    });
    //console.log("ABSA BUY  " + this.NedBankWithBuyArraySum / this.NedBankWithBuyArray.length);
    this.NedBankBuyAverageOfCurreny = this.NedBankWithBuyArraySum / this.NedBankWithBuyArray.length;
    //#####  NEDBANK BUY END

    //====================================================================================

    //#####  NEDBANK SELL START

    this.NedBankWithArray.forEach(GetNedBankWithUsdSellArray => {

      this.NedBankWithSellArray.push(GetNedBankWithUsdSellArray[4]);
    });

    this.NedBankWithSellArray.forEach(value => {
      this.NedBankWithSellArraySum = this.NedBankWithSellArraySum + value;
    });

    // console.log("ABSA SELL  " + this.NedBankWithSellArraySum / this.NedBankWithSellArray.length);
    this.NedBankSellAverageOfCurreny = this.NedBankWithSellArraySum / this.NedBankWithSellArray.length;
    //#####  NEDBANK SELL END

    //################### Set Nedbank Values to the graphs

    if (this.countMonths == 1) {

      this.NedBankBuyAverageFirstMonth = this.NedBankBuyAverageOfCurreny;
      this.NedBankSellAverageFirstMonth = this.NedBankSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyFirstMonth.push(this.NedBankBuyAverageFirstMonth);
      this.bankSellFirstMonth.push(this.NedBankSellAverageFirstMonth);

      //ARRAY PO
      this.nedbankFirstSecondThirdMonthBuyAverages.push(this.NedBankBuyAverageFirstMonth.toFixed(2));
      this.nedbankFirstSecondThirdMonthSellAverages.push(this.NedBankSellAverageFirstMonth.toFixed(2));

    } else if (this.countMonths == 2) {

      this.NedBankBuyAverageSecondMonth = this.NedBankBuyAverageOfCurreny;
      this.NedBankSellAverageSecondMonth = this.NedBankSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuySecondMonth.push(this.NedBankBuyAverageSecondMonth);
      this.bankSellSecondMonth.push(this.NedBankSellAverageSecondMonth);

      //ARRAY PO
      this.nedbankFirstSecondThirdMonthBuyAverages.push(this.NedBankBuyAverageSecondMonth.toFixed(2));
      this.nedbankFirstSecondThirdMonthSellAverages.push(this.NedBankSellAverageSecondMonth.toFixed(2));

    } else if (this.countMonths == 3) {

      this.NedBankBuyAverageThirdMonth = this.NedBankBuyAverageOfCurreny;
      this.NedBankSellAverageThirdMonth = this.NedBankSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyThirdMonth.push(this.NedBankBuyAverageThirdMonth);
      this.bankSellThirdMonth.push(this.NedBankSellAverageThirdMonth);

      //ARRAY PO
      this.nedbankFirstSecondThirdMonthBuyAverages.push(this.NedBankBuyAverageThirdMonth.toFixed(2));
      this.nedbankFirstSecondThirdMonthSellAverages.push(this.NedBankSellAverageThirdMonth.toFixed(2));

    }

    //################### Set NedBank Values to 0

    this.NedBankArray = [];
    this.NedBankWithArray = [];
    this.NedBankWithBuyArray = [];
    this.NedBankWithBuyArraySum = 0;
    this.NedBankWithSellArray = [];
    this.NedBankWithSellArraySum = 0;
    this.bankCurrencyArray = [];
  }

  setStandardGraph() {

    //#####  Standard BUY START
    this.hitoryData.forEach(banksElement => {

      let theDate = Number.parseInt(banksElement[5].substring(5, 7));

      if (banksElement[0] == "STANDARD BANK" && theDate == this.currentMonth && this.countMonths == 1) {

        this.StandardArray.push(banksElement);

      } else if (banksElement[0] == "STANDARD BANK" && theDate == this.currentMonth && this.countMonths == 2) {

        this.StandardArray.push(banksElement);

      } else if (banksElement[0] == "STANDARD BANK" && theDate == this.currentMonth && this.countMonths == 3) {

        this.StandardArray.push(banksElement);

      }
    });

    this.StandardWithArray = this.getCurrenySelected(this.selectedCurrency, this.StandardArray);

    this.StandardWithArray.forEach(GetStandardWithUsdBuyArray => {

      this.StandardWithBuyArray.push(GetStandardWithUsdBuyArray[3]);
    });

    this.StandardWithBuyArray.forEach(value => {
      this.StandardWithBuyArraySum = this.StandardWithBuyArraySum + value;
    });

    //console.log("STANDARD BANK  " + this.StandardWithBuyArraySum / this.StandardWithBuyArray.length);
    this.StandardBuyAverageOfCurreny = this.StandardWithBuyArraySum / this.StandardWithBuyArray.length;
    //#####  Standard BUY END

    //====================================================================================

    //#####  Standard SELL START

    this.StandardWithArray.forEach(GetStandardWithUsdSellArray => {

      this.StandardWithSellArray.push(GetStandardWithUsdSellArray[4]);
    });

    this.StandardWithSellArray.forEach(value => {
      this.StandardWithSellArraySum = this.StandardWithSellArraySum + value;
    });

    //console.log("STANDARD SELL  " + this.StandardWithSellArraySum / this.StandardWithSellArray.length);
    this.StandardSellAverageOfCurreny = this.StandardWithSellArraySum / this.StandardWithSellArray.length;
    //#####  Standard SELL END

    //################### Set Standard Values to the graphs

    if (this.countMonths == 1) {

      this.StandardBuyAverageFirstMonth = this.StandardBuyAverageOfCurreny;
      this.StandardSellAverageFirstMonth = this.StandardSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyFirstMonth.push(this.StandardBuyAverageFirstMonth);
      this.bankSellFirstMonth.push(this.StandardSellAverageFirstMonth);

      //ARRAY PO
      this.standardFirstSecondThirdMonthBuyAverages.push(this.StandardBuyAverageFirstMonth.toFixed(2));
      this.standardFirstSecondThirdMonthSellAverages.push(this.StandardSellAverageFirstMonth.toFixed(2));

    } else if (this.countMonths == 2) {

      this.StandardBuyAverageSecondMonth = this.StandardBuyAverageOfCurreny;
      this.StandardSellAverageSecondMonth = this.StandardSellAverageOfCurreny;

      //############### Sorttttttttt data
      this.bankBuySecondMonth.push(this.StandardBuyAverageSecondMonth);
      this.bankSellSecondMonth.push(this.StandardSellAverageSecondMonth);

      //ARRAY PO
      this.standardFirstSecondThirdMonthBuyAverages.push(this.StandardBuyAverageSecondMonth.toFixed(2));
      this.standardFirstSecondThirdMonthSellAverages.push(this.StandardSellAverageSecondMonth.toFixed(2));

    } else if (this.countMonths == 3) {

      this.StandardBuyAverageThirdMonth = this.StandardBuyAverageOfCurreny;
      this.StandardSellAverageThirdMonth = this.StandardSellAverageOfCurreny;

      //############### Sorttttttttt data
      this.bankBuyThirdMonth.push(this.StandardBuyAverageThirdMonth);
      this.bankSellThirdMonth.push(this.StandardSellAverageThirdMonth);

      //ARRAY PO
      this.standardFirstSecondThirdMonthBuyAverages.push(this.StandardBuyAverageThirdMonth.toFixed(2));
      this.standardFirstSecondThirdMonthSellAverages.push(this.StandardSellAverageThirdMonth.toFixed(2));

    }

    //################### Set Standard Values to 0

    this.StandardArray = [];
    this.StandardWithArray = [];
    this.StandardWithBuyArray = [];
    this.StandardWithBuyArraySum = 0;
    this.StandardWithSellArray = [];
    this.StandardWithSellArraySum = 0;
    this.bankCurrencyArray = [];

  }

  setBidVestGraph() {

    //#####  Standard BUY START
    this.hitoryData.forEach(banksElement => {

      let theDate = Number.parseInt(banksElement[5].substring(5, 7));

      if (banksElement[0] == "BIDVEST BANK" && theDate == this.currentMonth && this.countMonths == 1) {

        this.BidVestArray.push(banksElement);

      } else if (banksElement[0] == "BIDVEST BANK" && theDate == this.currentMonth && this.countMonths == 2) {

        this.BidVestArray.push(banksElement);

      } else if (banksElement[0] == "BIDVEST BANK" && theDate == this.currentMonth && this.countMonths == 3) {

        this.BidVestArray.push(banksElement);
      }
    });

    //console.log(this.BidVestArray);

    this.BidVestWithArray = this.getCurrenySelected(this.selectedCurrency, this.BidVestArray);

    this.BidVestWithArray.forEach(GetBidVestWithBuyArray => {

      this.BidVestWithBuyArray.push(GetBidVestWithBuyArray[3]);

    });

    this.BidVestWithBuyArray.forEach(value => {
      this.BidVestWithBuyArraySum = this.BidVestWithBuyArraySum + value;
    });

    //console.log("BIDVEST BUY  " + this.BidVestWithBuyArraySum / this.BidVestWithBuyArray.length);
    this.BidVestBuyAverageOfCurreny = this.BidVestWithBuyArraySum / this.BidVestWithBuyArray.length;
    //#####  Standard BUY END

    //====================================================================================

    //#####  Standard SELL START

    this.BidVestWithArray.forEach(GetBidVestWithSellArray => {

      this.BidVestWithSellArray.push(GetBidVestWithSellArray[4]);
    });

    this.BidVestWithSellArray.forEach(value => {
      this.BidVestWithSellArraySum = this.BidVestWithSellArraySum + value;
    });

    //console.log("BIDVEST SELL  " + this.BidVestWithSellArraySum / this.BidVestWithSellArray.length);
    this.BidVestSellAverageOfCurreny = this.BidVestWithSellArraySum / this.BidVestWithSellArray.length;
    //#####  Standard SELL END

    //################### Set Standard Values to the graphs

    if (this.countMonths == 1) {

      this.BidVestBuyAverageFirstMonth = this.BidVestBuyAverageOfCurreny;
      this.BidVestSellAverageFirstMonth = this.BidVestSellAverageOfCurreny;

      //############### Sorttttttttt data

      this.bankBuyFirstMonth.push(this.BidVestBuyAverageFirstMonth);
      this.bankSellFirstMonth.push(this.BidVestSellAverageFirstMonth);

      //ARRAY PO
      this.bidvestFirstSecondThirdMonthBuyAverages.push(this.BidVestBuyAverageFirstMonth.toFixed(2));
      this.bidvestFirstSecondThirdMonthSellAverages.push(this.BidVestSellAverageFirstMonth.toFixed(2));

    } else if (this.countMonths == 2) {

      this.BidVestBuyAverageSecondMonth = this.BidVestBuyAverageOfCurreny;
      this.BidVestSellAverageSecondMonth = this.BidVestSellAverageOfCurreny;

      //############### Sorttttttttt data
      this.bankBuySecondMonth.push(this.BidVestBuyAverageSecondMonth);
      this.bankSellSecondMonth.push(this.BidVestSellAverageSecondMonth);

      //ARRAY PO
      this.bidvestFirstSecondThirdMonthBuyAverages.push(this.BidVestBuyAverageSecondMonth.toFixed(2));
      this.bidvestFirstSecondThirdMonthSellAverages.push(this.BidVestSellAverageSecondMonth.toFixed(2));

    } else if (this.countMonths == 3) {

      this.BidVestBuyAverageThirdMonth = this.BidVestBuyAverageOfCurreny;
      this.BidVestSellAverageThirdMonth = this.BidVestSellAverageOfCurreny;

      //############### Sorttttttttt data
      this.bankBuyThirdMonth.push(this.BidVestBuyAverageThirdMonth);
      this.bankSellSecondMonth.push(this.BidVestSellAverageThirdMonth);

      //ARRAY PO
      this.bidvestFirstSecondThirdMonthBuyAverages.push(this.BidVestBuyAverageThirdMonth.toFixed(2));
      this.bidvestFirstSecondThirdMonthSellAverages.push(this.BidVestSellAverageThirdMonth.toFixed(2));

      //console.log(this.BidVestSellAverageOfCurreny);
    }

    //################### Set Standard Values to 0

    this.BidVestArray = [];
    this.BidVestWithArray = [];
    this.BidVestWithBuyArray = [];
    this.BidVestWithBuyArraySum = 0;
    this.BidVestWithSellArray = [];
    this.BidVestWithSellArraySum = 0;
    this.bankCurrencyArray = [];
  }

  getBankData() {
    //##### loop through bank data
    this.bankData.forEach(element => {
      //##### get banks names
      this.bankNames.push(element[0]);
    });

    this.bankNames = _.uniq(this.bankNames);

    for (let i = 0; i < this.bankNames.length; i++) {
      this.bankNames2.push([]);
      this.bankNames2[i].push(this.bankNames[i]);
    }

    for (let i = 0; i < this.bankNames2.length; i++) {
      for (let j = 0; j < this.bankData.length; j++) {
        if (this.bankNames2[i][0] == this.bankData[j][0]) {
          this.bankNames2[i].push(this.bankData[j]);
        }
      }
    }
  }

  getCurrenySelected(currenySelected: string, bankArray: Array<TypeBank>): Array<TypeBank> {

    bankArray.forEach(GetBankWithCurrency => {

      //#############  ASSIGN VALUES FOR SELECTED CURRENY
      //============ 
      if (this.counterSelelected === 1) {

        if (GetBankWithCurrency[2] === this.currencies[0]) {

          this.bankCurrencyArray.push(GetBankWithCurrency);
        }

      } else if (this.selectedCurrency === "USD") {

        if (GetBankWithCurrency[2] === "USD") {

          this.bankCurrencyArray.push(GetBankWithCurrency);

        }

      } else if (this.selectedCurrency === "EUR") {

        if (GetBankWithCurrency[2] === "EUR") {

          this.bankCurrencyArray.push(GetBankWithCurrency);
        }

      } else if (this.selectedCurrency === "GBP") {

        if (GetBankWithCurrency[2] === "GBP") {

          this.bankCurrencyArray.push(GetBankWithCurrency);

        }

      } else if (this.selectedCurrency === "CAD") {

        if (GetBankWithCurrency[2] === "CAD") {

          this.bankCurrencyArray.push(GetBankWithCurrency);

        }

      } else if (this.selectedCurrency === "CHF") {

        if (GetBankWithCurrency[2] === "CHF") {

          this.bankCurrencyArray.push(GetBankWithCurrency);

        }

      } else if (this.selectedCurrency === "JPY") {

        if (GetBankWithCurrency[2] === "JPY") {

          this.bankCurrencyArray.push(GetBankWithCurrency);

        }

      }

      //#################   END OF IF SELECTED ARRAY
    });

    return this.bankCurrencyArray;
  }

  setSortedArrays() {

    if (this.countMonths == 1) {

      for (let i = 0; i < this.bankSellFirstMonth.length; i++) {
        this.bankSellArray.push(this.bankSellFirstMonth[i]);
      }

      for (let i = 0; i < this.bankBuyFirstMonth.length; i++) {
        this.bankBuyArray.push(this.bankBuyFirstMonth[i]);
      }

    }

    if (this.countMonths === 2) {

      for (let i = 0; i < this.bankSellSecondMonth.length; i++) {
        this.bankSellArray.push(this.bankSellSecondMonth[i]);
      }

      for (let i = 0; i < this.bankBuySecondMonth.length; i++) {
        this.bankBuyArray.push(this.bankBuySecondMonth[i]);
      }

    }
    if (this.countMonths === 3) {

      for (let i = 0; i < this.bankSellThirdMonth.length; i++) {
        this.bankSellArray.push(this.bankSellThirdMonth[i]);
      }

      for (let i = 0; i < this.bankBuyThirdMonth.length; i++) {
        this.bankBuyArray.push(this.bankBuyThirdMonth[i]);
      }

    }

    if (Math.floor(this.bankSellArray.sort()[0]) - 1 <= 1) {

      this.bankSellValueMin = 0;

    }
    if (Math.floor(this.bankBuyArray.sort()[0]) - 1 <= 1) {

      this.bankBuyValueMin = 0;

    }
    if (Math.floor(this.bankSellArray.sort()[0]) - 1 >= 1) {
      this.bankSellValueMin = Math.floor(this.bankSellArray.sort()[0]) - 1;
    }

    if (Math.floor(this.bankBuyArray.sort()[0]) - 1 >= 1) {

      this.bankBuyValueMin = Math.floor(this.bankBuyArray.sort()[0]) - 1;

    }

    //#########   MAKE MIN Y-AXIS EQUAL TO EACH OTHER

    if (this.bankSellValueMin < this.bankBuyValueMin) {
      this.bankBuyValueMin = this.bankSellValueMin;
    }
    if (this.bankBuyValueMin < this.bankSellValueMin) {
      this.bankSellValueMin = this.bankBuyValueMin;
    }

    //Get Max y-axis

    if (Math.ceil(this.bankSellArray.sort()[this.bankSellArray.length - 1]) >= 1) {
      this.bankSellValueMax = Math.ceil(this.bankSellArray.sort()[this.bankSellArray.length - 1]);

    }

    if (Math.ceil(this.bankBuyArray.sort()[this.bankBuyArray.length - 1]) >= 1) {

      this.bankBuyValueMax = Math.ceil(this.bankBuyArray.sort()[this.bankBuyArray.length - 1]);

    }
    //#########   MAKE MAX Y-AXIS EQUAL TO EACH OTHER  0765106286
    if (this.bankSellValueMax > this.bankBuyValueMax) {

      this.bankBuyValueMax = this.bankSellValueMax;

      if (this.selectedCurrency === "CAD" || this.selectedCurrency === "CHF" || this.selectedCurrency === "JPY") {

        this.bankBuyValueMax = this.bankSellValueMax;
        //console.log(this.bankBuyValueMax);
      }

    }
    if (this.bankBuyValueMax > this.bankSellValueMax) {

      this.bankSellValueMax = this.bankBuyValueMax;

      if (this.selectedCurrency === "CAD" || this.selectedCurrency === "CHF" || this.selectedCurrency === "JPY") {

        this.bankSellValueMax = this.bankBuyValueMax;
        //console.log(this.bankBuyValueMax);
      }

    }
  }

  //########## my staff start here

  // define a variable to store the chart instance (this must be outside of your function)
  myChart: any;

  chartBuying() {

    // if the chart is not undefined (e.g. it has been created)
    // then destory the old one so we can create a new one later
    if (this.myChart) {
      this.myChart.destroy();
    }

    var ctx = document.getElementById("chartBuyBank");
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        //##### date, moment that data was retrieve
        labels:
          this.monthArray,

        //##### specific data for specific bank
        datasets: [
          {
            data: this.absaFirstSecondThirdMonthBuyAverages,
            label: "ABSA",
            borderColor: "#BE0028",
            fill: true,
            lineTension: 0.2,
            backgroundColor: "#be002821",
            borderWidth: 1,
            hoverBackgroundColor: "#be002821",
          },
          {

            data: this.fnbFirstSecondThirdMonthBuyAverages,
            label: "FNB",
            borderColor: "rgba(1, 170, 173)",
            fill: true,
            //lineTension: 0.2,
            backgroundColor: "#01aaad2b",
            borderWidth: 1,
            hoverBackgroundColor: "#01aaad2b",
          },
          {

            data: this.nedbankFirstSecondThirdMonthBuyAverages,
            label: "NEDBANK",
            borderColor: "#005641",
            fill: true,
            //lineTension: 0.2,
            backgroundColor: "#00634124",
            borderWidth: 1,
            hoverBackgroundColor: "#00634124",
          },
          {

            data: this.standardFirstSecondThirdMonthBuyAverages,
            label: "STD BANK",
            borderColor: "rgb(0, 51, 160)",
            fill: true,
            //lineTension: 0,
            backgroundColor: "#0033aa4a",
            borderWidth: 1,
            hoverBackgroundColor: "#0033aa4a",

          }
          ,
          {

            data: this.bidvestFirstSecondThirdMonthBuyAverages,
            label: "BIDVEST",
            borderColor: "rgb(0, 51, 160)",
            fill: true,
            //lineTension: 0,
            backgroundColor: "rgb(100, 100, 100)",
            borderWidth: 1,
            hoverBackgroundColor: "rgb(100, 100, 100)",

          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Banks History Buying Currency"
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: this.bankBuyValueMin,
              max: this.bankBuyValueMax,
              stepSize: 2,
            }
          }],
          xAxes: [{ barThickkness: 30 }]
        },
        animation: {
          duration: 8000 // general animation time
        }
      }
    });
  }

  // define a variable to store the chart instance (this must be outside of your function)
  myChartTwo: any;

  chartSelling() {

    // if the chart is not undefined (e.g. it has been created)
    // then destory the old one so we can create a new one later
    if (this.myChartTwo) {
      this.myChartTwo.destroy();
    }

    var ctx = document.getElementById("chartSellBank");
    this.myChartTwo = new Chart(ctx, {
      type: 'bar',
      data: {
        //##### date, moment that data was retrieved
        labels:
          this.monthArray,
        //##### specific data for specific bank
        datasets: [
          {

            data: this.absaFirstSecondThirdMonthSellAverages,
            label: "ABSA",
            borderColor: "#BE0028",
            fill: true,
            lineTension: 0.2,
            backgroundColor: "#be002821",
            borderWidth: 1,
            hoverBackgroundColor: "#be002821",
          },
          {

            data: this.fnbFirstSecondThirdMonthSellAverages,
            label: "FNB",
            borderColor: "rgba(1, 170, 173)",
            fill: true,
            //lineTension: 0.2,
            backgroundColor: "#01aaad2b",
            borderWidth: 1,
            hoverBackgroundColor: "#01aaad2b",

          },
          {

            data: this.nedbankFirstSecondThirdMonthSellAverages,
            label: "NEDBANK",
            borderColor: "#005641",
            fill: true,
            //lineTension: 0.2,
            backgroundColor: "#00634124",
            borderWidth: 1,
            hoverBackgroundColor: "#00634124",

          },
          {
            //
            data: this.standardFirstSecondThirdMonthSellAverages,
            label: "STD BANK",
            borderColor: "rgb(0, 51, 160)",
            fill: true,
            //lineTension: 0,
            backgroundColor: "#0033aa4a",
            borderWidth: 1,
            hoverBackgroundColor: "#0033aa4a",

          }
          ,
          {

            data: this.bidvestFirstSecondThirdMonthSellAverages,
            label: "BIDVEST",
            borderColor: "rgb(0, 51, 160)",
            fill: true,
            //lineTension: 0,
            backgroundColor: "rgb(100, 100, 100)",
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Banks History Selling Currency"
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: this.bankSellValueMin,
              max: this.bankSellValueMax,
              stepSize: 2,
            }
          }],
          xAxes: [{ barThickkness: 30 }]
        },
        animation: {
          duration: 8000 // general animation time
        }
      }
    });
  }
} // #end of the class
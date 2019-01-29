import { Component, OnInit } from "@angular/core";
//##### imports Auth service (access to AngularFire);
import { AuthService } from "./../shared/auth.service";
//#### import charts
import { Chart } from "chart.js";
//#### import evrything from lodash
import * as _ from "lodash";
//##### import everything from moment
import * as moment from "moment";
//##### import custom bank-data-type from our model
import { TypeBank } from "./../shared/data.model";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from "ngx-spinner";
//##### import setting service
import { SettingService } from "../shared/setting.service";
import { addListener } from "cluster";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  //##### hold bankData from the storage
  bankData: Array<TypeBank> = [];
  //##### last updated data
  updatedDate: any;

  //##### best deal data-variables
  usd: Array<TypeBank> = [];
  usdBuy: TypeBank;
  usdSell: TypeBank;

  gbp: Array<TypeBank> = [];
  gbpBuy: TypeBank;
  gbpSell: TypeBank;

  eur: Array<TypeBank> = [];
  eurBuy: TypeBank;
  eurSell: TypeBank;
 
  //***** chart data
  //##### chart object variables
  chartBuying: any;
  chartSelling: any;
  // bar charts banks names variable
  barChartLabel: string[] = [];
  //usd currency variables for bar chart
  usdBuyChart: number[] = [];
  usdSellChart: number[] = [];
  // eur currency variables for bar chart
  eurBuyChart: number[] = [];
  eurSellChart: number[] = [];
  // gbp currency variables for bar chart
  gbpBuyChart: number[] = [];
  gbpSellChart: number[] = [];

  //##### constructor
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private setting: SettingService
  ) {}

  //#### OnInit...
  ngOnInit() {
    console.log(this.authService.isAuthenticated());
    // spinner starts on init
    this.spinner.show();
    // get bankData, set deal data, updated time, chart
    this.getBankDataAsync();
  }  // end ngOnInit

  //##### run only when localstorage is ready
  async getBankDataAsync() {
    // wait until bankdata is ready in the storage then, assign it a variable or assign an empty array 
    this.bankData = (await localStorage.bankStorage) !== undefined ? JSON.parse(localStorage.bankStorage) : [];
    // format as time updated data from the first element of bankdata
    this.updatedDate = moment(this.bankData[0][5], "YYYY-MM-DD h:mm:ss").fromNow();
    // update time every 1 minute
    setInterval(() => { this.updatedDate = moment(this.bankData[0][5], "YYYY-MM-DD h:mm:ss").fromNow(); }, 60000);
    // call getDealData function set values to our primary 3 currencies (usd, eur, gbp)
    this.getDealData();
    // call chartMethod to populate charts
    this.chartMethod();
    // stop spinner half second after everything excuted
    setTimeout(() => { this.spinner.hide() }, 500);

  }


  //##### get all the best deal data
  getDealData(): void {
    // get unique banks names
    this.barChartLabel = _.uniq(this.bankData.map(data => data[0]));
    // extract usd, gpb, eur from bankdata and push them into arrays
    this.usd = this.bankData.filter(data => data[2] === "USD");
    this.eur = this.bankData.filter(data => data[2] === "EUR");
    this.gbp = this.bankData.filter(data => data[2] === "GBP");
    // separate usd, eur and gbp data into buy and sell arrays (tobe used in chart and will keep a copy)
    this.usd.map(data => { this.usdBuyChart.push(data[3]); this.usdSellChart.push(data[4]); });
    this.eur.map(data => { this.eurBuyChart.push(data[3]); this.eurSellChart.push(data[4]); });
    this.gbp.map(data => { this.gbpBuyChart.push(data[3]); this.gbpSellChart.push(data[4]); });
    // local variables that has a copy buying and selling currencies chart
    // this helps to keep a copy instead of modifying chart data
    let usdbuy: any[] = [...this.usdBuyChart], usdsell: any[] = [...this.usdSellChart];
    let eurbuy: any[] = [...this.eurBuyChart], eursell: any[] = [...this.eurSellChart];
    let gbpbuy: any[] = [...this.gbpBuyChart], gbpsell: any[] = [...this.gbpSellChart];
    
    // get the highest Banks buying currencies as best deal
    this.usdBuy = [...this.usd.filter(data => data[3] === usdbuy.sort()[usdbuy.length - 1])][0];
    this.eurBuy = [...this.eur.filter(data => data[3] === eurbuy.sort()[eurbuy.length - 1])][0];
    this.gbpBuy = [...this.gbp.filter(data => data[3] === gbpbuy.sort()[gbpbuy.length - 1])][0];
    // get the lowest Banks selling currencies as best deal
    this.usdSell = this.usd.filter(data => data[4] === usdsell.sort()[0])[0];
    this.eurSell = this.eur.filter(data => data[4] === eursell.sort()[0])[0];
    this.gbpSell = this.gbp.filter(data => data[4] === gbpsell.sort()[0])[0];
  } // end getDealData


  chartMethod(): void {
    //Selling bar graph
    this.chartSelling = new Chart(document.getElementById("chartSellHome"), {
      type: "bar",
      data: {
        labels: this.barChartLabel,
        datasets: [
          {
            label: "USD",
            backgroundColor: "#7b8599",
            data: this.usdSellChart,
            hoverBackgroundColor: "#7b8599"
          },
          {
            label: "EUR",
            backgroundColor: "#01aaad47",
            data: this.eurSellChart,
            hoverBackgroundColor: "#01aaad47"
          },
          {
            label: "GBP",
            backgroundColor: "#34495e61",
            data: this.gbpSellChart,
            hoverBackgroundColor: "#34495e61"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: " Banks Sell Currencies"
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: false } }],
          xAxes: [{ barThickness: 30 }]
        },
        animation: {
          duration: 8000 // general animation time
        }
      }
    });

    // Buying Chart
    this.chartBuying = new Chart(document.getElementById("chartBuyHome"), {
      type: "bar",
      data: {
        labels: this.barChartLabel,
        datasets: [
          {
            label: "USD",
            data: this.usdBuyChart,
            backgroundColor: "#7b8599",
            hoverBackgroundColor: "#7b8599"
          },
          {
            label: "EUR",
            data: this.eurBuyChart,
            backgroundColor: "#01aaad47",
            hoverBackgroundColor: "#01aaad47"
          },
          {
            label: "GBP",
            data: this.gbpBuyChart,
            backgroundColor: "#34495e61",
            hoverBackgroundColor: "#34495e61"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Banks Buy Currencies"
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: false } }],
          xAxes: [{ barThickness: 30 }]
        },
        animation: {
          duration: 8000 // general animation time
        }
      }
    });

    // Define a plugin to provide data labels
    Chart.plugins.register({
      afterDatasetsDraw: function(chart) {
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset, i) {
          var meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function(element, index) {
              // Draw text with the specified font color
              ctx.fillStyle = "#343030";
              var fontSize = 12;
              var fontStyle = "normal";
              var fontFamily = "Helvetica Neue";
              ctx.font = Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              );

              // Just naively convert to string for now
              var dataString = dataset.data[index].toString();
              // Make sure alignment settings are correct
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              var padding = -1;
              var position = element.tooltipPosition();
              ctx.fillText(
                dataString,
                position.x,
                position.y - fontSize / 2 - padding
              );
            });
          }
        });
      }
    });
  }

} // end HomeComponent
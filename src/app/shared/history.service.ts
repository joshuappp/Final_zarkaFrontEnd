import { Injectable } from "@angular/core";
import { TypeBank } from "./data.model";
//#### import evrything from lodash
import * as _ from "lodash";
//##### Import NgxSpinner library module
import { NgxSpinnerService } from "ngx-spinner";
//##### import toast service
import { ToastService } from "../shared/toast.service";
//##### import everything from moment
import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class HistoryService {
  //##### hold histotyData from the storage
  historyData: Array<TypeBank> = [];
  historyLast2Years: Array<TypeBank> = [];
  historyLast3Months: Array<TypeBank> = [];
  // hold 3 lastest months for both chart label month
  chartLabels: string[] = [];
  // hold uniq year
  years: string[] = [];
  

  constructor(private spinner: NgxSpinnerService) {}

  //##### run only when localstorage is ready (void<Promise>)
  getHistoryData() {
    // spinner starts on init
    this.spinner.show();

    // stop interval until u get data from storage
    let historyInterval = setInterval(() => {
      //##### Check if localStorage is set
      if (localStorage.generalStorage !== undefined) {
        //##### Clear general interval
        clearInterval(historyInterval);
        // wait until historydata is ready in the storage then...
        this.historyData = JSON.parse(localStorage.historyStorage);
        // call set data to labelChart
        this.setChartLabels();
        // copy history data in reverse to get access to latest data first
        const copyHistoryData: TypeBank[] = [...this.historyData].reverse();

        // set distinct years
        this.years = _.uniq(copyHistoryData.map(data => data[5].toString().substring(0, 4)));

        // set history with last 2 years data (year 1 and 2)
        this.historyLast2Years = [...copyHistoryData.filter(data => data[5].substring(0, 4) == this.years[0])];
        this.historyLast2Years = [...copyHistoryData.filter(data => data[5].substring(0, 4) == this.years[1])];

        // call function
        this.setLast3MonthsData();
        //console.dir(this.historyData);
      }
    }, 500);

    // stop spinner
    this.spinner.hide();
  }

  //##### set values to both chart label date
  setChartLabels() {
    // get uniq month from history data
    let months: string[] = _.uniq( this.historyData.map(data => moment(data[5], "YYYY-MM-DD, hh:mm").format("MMM")) );
    // assign only the last 3 months to chart in specific order
    for (let i = 1; i <= 3; i++) {
      if (months[months.length - i] !== undefined) {
        this.chartLabels.push(months[i]);
      }
    }
  }

  //#### set Last 3 Months data
  setLast3MonthsData() {
    // local variable to keep each months data
    let firstMonth: Array<TypeBank> = [], secondMonth: Array<TypeBank> = [], thirdMonth: Array<TypeBank> = [];
    // set history with the last 3 months
    for (let i = 0; i < this.historyLast2Years.length; i++) {
      // get latest 3 months
      if (moment(this.historyLast2Years[i][5], "YYYY-MM-DD, hh:mm").format("MMM") == this.chartLabels[0]) {
        firstMonth.push(this.historyLast2Years[i]);
      }

      if (moment(this.historyLast2Years[i][5], "YYYY-MM-DD, hh:mm").format("MMM") == this.chartLabels[1]) {
        secondMonth.push(this.historyLast2Years[i]);
      }

      if (moment(this.historyLast2Years[i][5], "YYYY-MM-DD, hh:mm").format("MMM") == this.chartLabels[2]) {
        thirdMonth.push(this.historyLast2Years[i]);
      }
    }
    // assign the 3 months arrays to historyLast3Months
    this.historyLast3Months = [...firstMonth, ...secondMonth, ...thirdMonth];
  }
}

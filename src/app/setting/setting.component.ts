import { Component, OnInit } from '@angular/core';
import { AuthService } from './../shared/auth.service';
import { CurrencyService } from "./../shared/currency.service";
import { Settings } from '../settings';
import { User } from '../user';


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  
  ngOnInit(){

    console.log("Got Inside Settings");

  }

}

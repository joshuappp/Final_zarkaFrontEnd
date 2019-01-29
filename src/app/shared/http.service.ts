import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  //##### HttpClient in the contructor
  constructor(private http: HttpClient) {}

  //##### get data from any rest-api url, return an observale
  getDataFromServer = (url: string) => {
    return this.http.get(url);
  };

  //##### Post data from any rest-api url, return an observale
  postToFire = (url: string, data: any) => {
    return this.http.post(url, data);
  };
}

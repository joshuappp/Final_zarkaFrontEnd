import { Injectable } from "@angular/core";
//##### import TypeNotification interface
import { TypeNotification } from "./data.model";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  //##### native push notification
  notifiy(param: TypeNotification) {
    //##### body string
    let options = {
      body: `${param.body}`
    };
    //##### header string
    let notification = new Notification(param.header, options);
    //##### use a callback function
    notification.onclick = () => {};
  }
}

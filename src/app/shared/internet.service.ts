import { Injectable } from "@angular/core";
//##### connection servise
import { ConnectionService } from "ng-connection-service";
//##### import toast service
import { ToastService } from "../shared/toast.service";

@Injectable({
  providedIn: "root"
})
export class InternetService {
  isConnected = true;

  constructor(
    private connectionService: ConnectionService,
    private toast: ToastService
  ) {}

  internetCheck() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      console.log(this.isConnected);
      if (this.isConnected) {
        this.toast.toastInfo("Internet", "Zarka back online 🤓");
      } else {
        this.toast.toastError("Internet", "Zarka is offline 😴");
      }
    });
  }
}

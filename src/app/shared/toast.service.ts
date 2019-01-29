import { Injectable } from "@angular/core";
//##### access to angular toastr
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  //##### toast blue
  toastInfo(body: string, head: string): void {
    this.toastr.info(head, body);
  }

  //##### toast green
  toastSuccess(body: string, head: string): void {
    this.toastr.success(head, body);
  }

  //##### toast orange
  toastWarning(body: string, head: string): void {
    this.toastr.warning(head, body);
  }

  //##### toast red
  toastError(body: string, head: string): void {
    this.toastr.error(head, body);
  }
}

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private pending = 0;
  private visibilitySubject = new BehaviorSubject<boolean>(false);
  visibility$ = this.visibilitySubject.asObservable();

  show() {
    this.pending++;
    this.visibilitySubject.next(true);
  }

  hide() {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) {
      this.visibilitySubject.next(false);
    }
  }

  reset() {
    this.pending = 0;
    this.visibilitySubject.next(false);
  }
}

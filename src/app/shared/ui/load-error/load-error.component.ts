import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "platx-load-error",
  templateUrl: "./load-error.component.html",
})
export class LoadErrorComponent {
  @Input() title = "COMMON.LOAD_FAILED";
  @Input() hint = "COMMON.LOAD_FAILED_HINT";
  @Input() compact = false;
  @Output() retry = new EventEmitter<void>();
}

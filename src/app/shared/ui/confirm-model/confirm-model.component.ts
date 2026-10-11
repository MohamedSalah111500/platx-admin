import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "platx-confirm-model",
  templateUrl: "./confirm-model.component.html",
})
export class ConfirmModelComponent {
  @Input() title: string;
  @Input() imagePath: string;
  @Input() busy = false;
  @Input() confirmLabel = "COMMON.CONFIRM";
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}

import { Component, Input } from "@angular/core";

@Component({
  selector: "platx-empty-state",
  templateUrl: "./empty-state.component.html",
  styleUrls: ["./empty-state.component.css"],
})
export class EmptyStateComponent {
  @Input() type: string = "";
  @Input() message!: string;

  imagePath: string = "";

  // Define the mappings for type to message and image
  private typeMappings: {
    [key: string]: { message: string; imagePath: string };
  } = {
    emptyRecords: {
      message: this.message ? this.message : "No records found.",
      imagePath: "assets/images/empty-records.svg",
    },
    noResults: {
      message: this.message ? this.message : "No results match your search.",
      imagePath: "assets/images/no-results.png",
    },
  };

  ngOnInit() {
    this.updateEmptyState();
  }

  ngOnChanges() {
    this.updateEmptyState();
  }

  private updateEmptyState() {
    const mapping = this.typeMappings[this.type];
    if (mapping) {
      this.message = this.message ? this.message : mapping.message;
      this.imagePath = mapping.imagePath;
    } else {
      // Default case if type is not found
      this.message = this.message ? this.message : "No data available.";
      this.imagePath = "assets/images/default-empty.png";
    }
  }
}

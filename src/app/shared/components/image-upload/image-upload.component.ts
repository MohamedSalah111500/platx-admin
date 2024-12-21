import { Component, Output, EventEmitter, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FilemanagerService } from "../../services/filemanager.service";

@Component({
  selector: "platx-image-upload",
  templateUrl: "./image-upload.component.html",
  styleUrls: ["./image-upload.component.css"],
})
export class ImageUploadComponent {
  @Input() fileUrl: string | null = null;
  @Output() fileUploadSuccess = new EventEmitter<{ id: string; url: string }>();
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  loading: boolean = false;

  constructor(
    public toastr: ToastrService,
    private fileServices: FilemanagerService
  ) {}

  ngOnInit(event: Event): void {
    if (this.fileUrl) {
      this.filePreview = this.fileUrl;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      // reader.onload = () => (this.filePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
      this.uploadFile(this.selectedFile);
    }
  }

  uploadFile(file: File): void {
    this.loading = true;
    let fdPayload = new FormData();
    fdPayload.append("file", file);

    this.fileServices.uploadGeneralFile(fdPayload).subscribe(
      (response: any) => {
        this.fileUploadSuccess.emit(response);
        this.filePreview = response.url;
        this.toastr.success("File Uploaded successfully", "Successfully");
        this.loading = false;
      },
      (error) => {
        this.toastr.error("Could not created ", "Error");
        this.loading = false;

      }
    );
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = null;
    this.fileUploadSuccess.emit({ id: null, url: null });
  }
}

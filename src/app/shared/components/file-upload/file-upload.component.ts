import { Component, Output, EventEmitter, Input } from "@angular/core";
import { co, er } from "@fullcalendar/core/internal-common";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ToastrService } from "ngx-toastr";
import { getIconClass } from "src/app/utiltis/functions";

@Component({
  selector: "platx-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.css"],
})
export class FileUploadComponent {
  getIconClass = getIconClass;
  @Output() fileUploadSuccess = new EventEmitter<{ id: string; url: string }>();
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  loading: boolean = false;
  dropzoneConfig: DropzoneConfigInterface = {
    url: "/upload", // Specify your server upload URL
    maxFilesize: 5, // Max file size in MB
    acceptedFiles: "image/png, image/jpeg, image/jpg'", // Accept only PDFs
    dictInvalidFileType: "Only PDF files are allowed.",
    addRemoveLinks: true, // Option to remove files
    maxFiles: 1, // Limit to 1 file (optional)
  };

  uploadedFiles: any[] = [];

  constructor(
    public toastr: ToastrService,
  ) {}

  ngOnInit(event: Event): void {}

  onUploadSuccess(file: any) {
    setTimeout(() => {
      this.fileUploadSuccess.emit(file);
      this.uploadedFiles.push(file);
    }, 100);
  }

  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }
}

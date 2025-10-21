import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from "@angular/core";
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
  @Input() fileUrl: string | null = null;
  @Input() imageFile: any = null;
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

  constructor(public toastr: ToastrService) {}

  ngOnInit(event: Event): void {}

  async urlToFile(
    url: string,
    filename: string,
    mimeType: string = "image/jpeg"
  ): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  onUploadSuccess(file: any) {
    this.uploadedFiles = [];
    setTimeout(() => {
      this.fileUploadSuccess.emit(file);
    }, 50);
  }

  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["imageFile"]) {
      if (this.imageFile) {
        this.uploadedFiles.push(this.imageFile);
      }
    }
  }
}

import { FormControl } from "@angular/forms";

export interface GetAllFilesResponse {
  items: FileItem[];
  totalCount: number;
}

export interface GetAllFilesSizeResponse {
  wordSize: null;
  pdfSize: null;
  imageSize: string;
  videoSize: null;
  wordCount: number;
  pdfCount: number;
  imageCount: number;
  videoCount: number;
  linkCount: number;
  linkSize: null;
  usedSizeGB?:number
}
export interface FileItem {
  id: number;
  name: string;
  path: string;
  attachementType: number;
  attachementTypeText: string;
  link: string;
  creationTime: string;
  updateTime: null;
  size: string;
}

export interface CreateFileForm {
  name: FormControl;
  fileContent: FormControl;
  attachmentType: FormControl;
  link: FormControl;
}

export interface CreateFilePayload {
  name: string;
  fileContent: string;
  attachementType: number;
  link: string;
}

export interface UpdateFilePayload {
  id: number;
  name: string;
  link: string;
}


export interface FileSizes {
  wordSize: string | null;
  pdfSize: string | null;
  imageSize: string | null;
  videoSize: string | null;
  wordCount: number;
  pdfCount: number;
  imageCount: number;
  videoCount: number;
  linkCount: number;
}

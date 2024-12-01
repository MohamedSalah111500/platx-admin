export interface IGeneralSuccessMessageResponse {
  success: boolean | string;
  message: string;
}

export interface IGeneralErrorMessageResponse {
  errors: boolean | string;
  message: string;
}

export interface ModalData {
  mode?: string;
  gradeId?:number;
  dataPass?: any;
  dataBack?: any;
}

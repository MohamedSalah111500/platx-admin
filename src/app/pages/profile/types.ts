export interface QualificationsPayloadPut {
  id: number;
  name: string;
  staffId: number;
  description: null;
  qualificationDocuments: QualificationDocumentPut[];
  qualificationExperiences: QualificationExperiencePut[];
}

export interface QualificationExperiencePut {
  id: string;
  placeName: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  jobTitle: string;
  responsibility: string;
  qualificationId: number;
  date?: string[];
}

export interface QualificationDocumentPut {
  id: number;
  name: string;
  documentPath: null;
  qualificationId: number;
}


export interface QualificationsPayload {
  id:number;
  name: string;
  staffId: string;
  description: string;
  qualificationDocuments: QualificationDocument[];
  qualificationExperiences: QualificationExperience[];
}

export interface QualificationExperience {
  placeName: string;
  startDate: string;
  endDate: string;
  date?:string[];
  isPresent: boolean;
  jobTitle: null;
  responsibility: null;
}


export interface QualificationDocument {
  name: string;
  documentPath: null;
}

// Chart data
export interface ChartType {
  chart?: any;
  plotOptions?: any;
  dataLabels?: any;
  stroke?: any;
  colors?: any;
  series?: any;
  fill?: any;
  xaxis?: any;
  yaxis?: any;
}


export interface StaffResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  subjectsTaught: null;
  address: string;
  emergencyContact: string;
  userId: null;
  dateOfBirth: string;
  password: null;
  groups: any[];
  qualification: any;
  roles: any[];
}

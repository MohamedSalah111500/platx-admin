import { Injectable } from "@angular/core";
import { Observable, Observer} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { QUALIFICATIONS_URLS } from "src/app/utiltis/urls";
import { QualificationsPayload, QualificationsPayloadPut } from "../types";

@Injectable({ providedIn: "root" })

export class ProfileService {

  constructor(private http: HttpClient) {}

  createQualification(
    payload: QualificationsPayload
  ): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .post(QUALIFICATIONS_URLS.CREATE, payload)
        .subscribe((responseData: any) => {
          observer.next(responseData);
        });
    });
  }

  updateQualification(
    payload: QualificationsPayloadPut
  ): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .put(QUALIFICATIONS_URLS.CREATE, payload)
        .subscribe((responseData: any) => {
          observer.next(responseData);
        });
    });
  }

  // getGroup(id: string): Observable<GetAllGroupsResponse> {
  //   return new Observable((observer: Observer<GetAllGroupsResponse>) => {
  //     this.http
  //       .get(GROUPS_URLS.GET_GROUP(id))
  //       .subscribe((responseData: GetAllGroupsResponse) => {
  //         observer.next(responseData);
  //       });
  //   });
  // }

  // getGroupStudents(
  //   id: string,
  //   pageNumber?: number,
  //   pageSize?: number
  // ): Observable<GetAllStudentsResponse> {
  //   return new Observable((observer: Observer<GetAllStudentsResponse>) => {
  //     this.http
  //       .get(
  //         pagination(GROUPS_URLS.GET_GROUP_STUDENTS(id), pageNumber, pageSize)
  //       )
  //       .subscribe((responseData: GetAllStudentsResponse) => {
  //         observer.next(responseData);
  //       });
  //   });
  // }


}

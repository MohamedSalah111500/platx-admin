// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";

import { FILE_MANAGER_URLS } from "src/app/utiltis/urls";
import { paginationWithSearch } from "src/app/utiltis/functions";

import {
  IGeneralErrorMessageResponse,
  IGeneralSuccessMessageResponse,
} from "src/app/shared/general-types";
import { environment } from "src/environments/environment";
import { GetAllFilesResponse, GetAllFilesSizeResponse, UpdateFilePayload } from "../types";

@Injectable({
  providedIn: "root",
})
export class FilemanagerService {
  constructor(private http: HttpClient) {}

  // STUDENTS
  createFile(payload: any): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http.post(FILE_MANAGER_URLS.CREATE, payload).subscribe(
        (responseData: any) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAllFiles(
    pageNumber: number,
    pageSize: number,
    search: string
  ): Observable<GetAllFilesResponse> {
    return new Observable((observer: Observer<GetAllFilesResponse>) => {
      this.http
        .get(
          paginationWithSearch(
            FILE_MANAGER_URLS.GET_ALL,
            search,
            pageNumber,
            pageSize
          )
        )
        .subscribe(
          (responseData: GetAllFilesResponse) => {
            observer.next(responseData);
          },
          (error) => observer.error(error)
        );
    });
  }

  getAllFilesSize(): Observable<GetAllFilesSizeResponse> {
    return new Observable((observer: Observer<GetAllFilesSizeResponse>) => {
      this.http.get(FILE_MANAGER_URLS.GET_SIZE).subscribe(
        (responseData: GetAllFilesSizeResponse) => {
          observer.next(responseData);
        },
        (error) => observer.error(error)
      );
    });
  }

  updateStudent(
    payload: UpdateFilePayload
  ): Observable<IGeneralSuccessMessageResponse> {
    return new Observable(
      (observer: Observer<IGeneralSuccessMessageResponse>) => {
        this.http.put(FILE_MANAGER_URLS.UPDATE, payload).subscribe(
          (responseData: IGeneralSuccessMessageResponse) => {
            observer.next(responseData);
          },
          (error: IGeneralErrorMessageResponse) => {
            observer.error(error);
          }
        );
      }
    );
  }

  deleteFile(id: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(FILE_MANAGER_URLS.DELETE(id)).subscribe(
        () => {
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  uploadGeneralFile(payload: any): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http.post(FILE_MANAGER_URLS.CREATE_GENERAL_FILE, payload).subscribe(
        (responseData: any) => {
          responseData.url = environment.apiURL + responseData.url.slice(1);
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}

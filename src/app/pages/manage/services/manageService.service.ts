// roles.service.ts

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";
import {
  Role,
  GetAllRolesResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  Student,
  GetAllStudentsResponse,
  Staff,
  GetAllStaffsResponse,
} from "../types";
import { ROLES_URLS, STAFF_URLS, STUDENTS_URLS } from "src/app/utiltis/urls";
import { pagination } from "src/app/utiltis/functions";

@Injectable({
  providedIn: "root",
})
export class ManageService {
  constructor(private http: HttpClient) {}

// ROLES
  getAllRoles(
    pageNumber: number,
    pageSize: number
  ): Observable<GetAllRolesResponse> {
    return new Observable((observer: Observer<GetAllRolesResponse>) => {
      this.http
        .get<GetAllRolesResponse>((pagination(ROLES_URLS.GET_ALL,pageNumber, pageSize)))
        .subscribe(
          (responseData: GetAllRolesResponse) => {
            observer.next(responseData);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  getRoleById(id: number): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.get<Role>(ROLES_URLS.GET_BY_ID(id)).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  createRole(payload: CreateRoleRequest): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.post<Role>(ROLES_URLS.CREATE, payload).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  updateRole(payload: UpdateRoleRequest): Observable<Role> {
    return new Observable((observer: Observer<Role>) => {
      this.http.put<Role>(ROLES_URLS.UPDATE, payload).subscribe(
        (responseData: Role) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteRole(id: number): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(ROLES_URLS.DELETE(id)).subscribe(
        () => {
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
// STUDENTS
  createStudent(payload: Student): Observable<Student> {
    return new Observable((observer: Observer<Student>) => {
      this.http.post<Student>(STUDENTS_URLS.CREATE, payload).subscribe(
        (responseData: Student) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAllStudents(pageNumber: number, pageSize: number): Observable<GetAllStudentsResponse> {
    return new Observable((observer: Observer<GetAllStudentsResponse>) => {
      this.http
        .get(pagination(STUDENTS_URLS.GET_ALL, pageNumber, pageSize))
        .subscribe((responseData: GetAllStudentsResponse) => {
          observer.next(responseData);
        },(error) => observer.error(error));
    });
  }

  getStudent(id: string): Observable<Student> {
    return new Observable((observer: Observer<Student>) => {
      this.http
        .get(STUDENTS_URLS.GET_BY_ID(id))
        .subscribe((responseData: Student) => {
          observer.next(responseData);
        },((error) => observer.error(error)));
    });
  }

  updateStudent(id: string, payload: Student): Observable<Student> {
    return new Observable((observer: Observer<Student>) => {
      this.http.put<Student>(STUDENTS_URLS.UPDATE, payload).subscribe(
        (responseData: Student) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteStudent(id: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(STUDENTS_URLS.DELETE(id)).subscribe(
        () => {
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  // STAFF
  createStaff(payload: Staff): Observable<Staff> {
    return new Observable((observer: Observer<Staff>) => {
      this.http.post<Staff>(STAFF_URLS.CREATE, payload).subscribe(
        (responseData: Staff) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  getAllStaff(pageNumber: number, pageSize: number): Observable<GetAllStaffsResponse> {
    return new Observable((observer: Observer<GetAllStaffsResponse>) => {
      this.http
        .get(pagination(STAFF_URLS.GET_ALL, pageNumber, pageSize))
        .subscribe((responseData: GetAllStaffsResponse) => {
          observer.next(responseData);
        },(error) => observer.error(error));
    });
  }

  getStaff(id: string): Observable<Staff> {
    return new Observable((observer: Observer<Staff>) => {
      this.http
        .get(STAFF_URLS.GET_BY_ID(id))
        .subscribe((responseData: Staff) => {
          observer.next(responseData);
        },((error) => observer.error(error)));
    });
  }

  updateStaff( payload: Staff): Observable<Staff> {
    return new Observable((observer: Observer<Staff>) => {
      this.http.put<Staff>(STAFF_URLS.UPDATE, payload).subscribe(
        (responseData: Staff) => {
          observer.next(responseData);
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  deleteStaff(id: string): Observable<void> {
    return new Observable((observer: Observer<void>) => {
      this.http.delete<void>(STAFF_URLS.DELETE(id)).subscribe(
        () => {
          observer.next();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}

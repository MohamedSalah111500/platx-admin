import { environment } from "src/environments/environment";

const AUTH_BASE = "api/Auth/";
const GROUPS_BASE = "api/Groups/";
const ROLES_BASE = "api/Roles";
const STUDENT_BASE = "api/Students";
const STAFF_BASE = "api/Staffs";
const QUALIFICATIONS_BASE = "api/Qualifications";
const FILE_MANAGER_BASE = "api/Attachements";
const GENERAL_FILE_BASE = "api/Files";
const EVENTS_BASE = "api/Events";
const EVENT_DETAILS_BASE = "api/EventDetails";
const CHAT_BASE = "api/Messages";
const GRADES_BASE = "api/Grades";
const UNIT_BASE = "api/Unit";
const EXAM_BASE = "api/Exam";
const TENANT_BASE = "api/Tenant";

export const AUTH_URLS = {
  LOGIN: `${environment.apiURL.concat(AUTH_BASE)}login`,
  REGISTRATION: `${environment.apiURL.concat(AUTH_BASE)}register`,
  FORGOT_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}forgot-password`,
  RESET_PASSWORD: `${environment.apiURL.concat(AUTH_BASE)}reset-password`,
};

export const GROUPS_URLS = {
  CREATE: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET: `${environment.apiURL.concat(GROUPS_BASE)}`,
  GET_GROUP: (groupId) => `${environment.apiURL.concat(GROUPS_BASE)}${groupId}`,
  GET_GROUP_STUDENTS: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/students`,
  GET_GROUP_STAFF: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/staff`,
  GET_GROUP_FILES: (groupId) =>
    `${environment.apiURL.concat(GROUPS_BASE)}${groupId}/files`,
  PATCH_STUDENT: (groupId: string, studentId: string, newGroupId: string) =>
    `${environment.apiURL.concat(
      GROUPS_BASE
    )}move-student/${groupId}/${studentId}/${newGroupId}`,
  REMOVE_STUDENT_FROM_GROUP: (groupId: string, studentId: number) =>
    `${environment.apiURL.concat(
      GROUPS_BASE
    )}remove-student/${groupId}/${studentId}`,
};

export const ROLES_URLS = {
  GET_ALL: `${environment.apiURL.concat(ROLES_BASE)}`,
  GET_BY_ID: (rolesId: number) =>
    `${environment.apiURL.concat(ROLES_BASE)}/${rolesId}`,
  CREATE: `${environment.apiURL.concat(ROLES_BASE)}`,
  UPDATE: `${environment.apiURL.concat(ROLES_BASE)}`,
  DELETE: (rolesId: number) =>
    `${environment.apiURL.concat(ROLES_BASE)}/${rolesId}`,
};

export const STUDENTS_URLS = {
  CREATE: `${environment.apiURL.concat(STUDENT_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(STUDENT_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(STUDENT_BASE)}/${id}`,
  UPDATE: `${environment.apiURL.concat(STUDENT_BASE)}`,
  DELETE: (id: string) => `${environment.apiURL.concat(STUDENT_BASE)}/${id}`,
};

export const STAFF_URLS = {
  CREATE: `${environment.apiURL.concat(STAFF_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(STAFF_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(STAFF_BASE)}/${id}`,
  UPDATE: `${environment.apiURL.concat(STAFF_BASE)}`,
  DELETE: (id: string) => `${environment.apiURL.concat(STAFF_BASE)}/${id}`,
};

export const QUALIFICATIONS_URLS = {
  CREATE: `${environment.apiURL.concat(QUALIFICATIONS_BASE)}`,
};

export const FILE_MANAGER_URLS = {
  CREATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  CREATE_GENERAL_FILE: `${environment.apiURL.concat(GENERAL_FILE_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_SIZE: `${environment.apiURL.concat(
    FILE_MANAGER_BASE
  )}/GetAttachementsSize`,
  UPDATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  GET_DOWNLOAD_FILE: (id: number) =>
    `${environment.apiURL.concat(FILE_MANAGER_BASE)}/DownloadFile/${id}`,
  DELETE: (id: string) =>
    `${environment.apiURL.concat(FILE_MANAGER_BASE)}/${id}`,
};

export const EVENT_URLS = {
  GET_ALL: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  CREATE: `${environment.apiURL.concat(EVENTS_BASE)}`,
  // GET_SIZE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}/GetAttachementsSize`,
  // UPDATE: `${environment.apiURL.concat(FILE_MANAGER_BASE)}`,
  // GET_DOWNLOAD_FILE: (id: number) =>`${environment.apiURL.concat(FILE_MANAGER_BASE)}/DownloadFile/${id}`,
  // DELETE: (id: string) =>`${environment.apiURL.concat(FILE_MANAGER_BASE)}/${id}`,
};

export const EVENT_DETAILS_URLS = {
  GET_ALL: (date: string, viewType: number) =>
    `${environment.apiURL.concat(
      EVENT_DETAILS_BASE
    )}?date=${date}&viewType=${viewType}`,

  GET_EVENT: (id: number) =>
    `${environment.apiURL.concat(EVENT_DETAILS_BASE)}/${id}`,
  DELETE: (mainEventId: number, eventDetailsId: number) =>
    `${environment.apiURL.concat(
      EVENT_DETAILS_BASE
    )}/${mainEventId}/${eventDetailsId}`,
  UPDATE: `${environment.apiURL.concat(EVENT_DETAILS_BASE)}`,

  // CREATE: `${environment.apiURL.concat(EVENT_DETAILS_BASE)}`,
  // GET_SIZE: `${environment.apiURL.concat(EVENT_DETAILS_BASE)}/GetAttachementsSize`,
  // GET_DOWNLOAD_FILE: (id: number) =>`${environment.apiURL.concat(EVENT_DETAILS_BASE)}/DownloadFile/${id}`,
};

export const CHAT_URLS = {
  GET_MESSAGE_WITH_STUDENT: (studentId: number, groupId: number) =>
    `${environment.apiURL.concat(
      CHAT_BASE
    )}/GetMessagesWithStudent?studentId=${studentId}&groupId=${groupId}`,

  GET_MESSAGE_FOR_TEACHER_IN_GROUP: (groupId: number) =>
    `${environment.apiURL.concat(
      CHAT_BASE
    )}/GetMessagesForTeacherInGroup?groupId=${groupId}`,

  GET_STUDENT_HAVE_MESSAGES: (teacherId: number) =>
    `${environment.apiURL.concat(
      CHAT_BASE
    )}/GetStudentsHaveMessages?teacherId=${teacherId}`,

  POST_TEACHER_SEND_MESSAGE_TO_GROUP: `${environment.apiURL.concat(
    CHAT_BASE
  )}/SendMessageToGroup`,

  POST_TEACHER_SEND_MESSAGE_TO_STUDENT: `${environment.apiURL.concat(
    CHAT_BASE
  )}/SendMessageToStudent`,

  POST_STUDENT_SEND_MESSAGE_TO_GROUP: `${environment.apiURL.concat(
    CHAT_BASE
  )}/SendMessageToGroupFromStudent`,
  DELETE_MESSAGES: (messageId: number) =>
    `${environment.apiURL.concat(CHAT_BASE)}/DeleteMessage/${messageId}`,

  DELETE_MESSAGES_WITH_GROUP: (groupId: number) =>
    `${environment.apiURL.concat(CHAT_BASE)}/DeleteMessageWithGroup/${groupId}`,

  DELETE_MESSAGES_WITH_STUDENT: (studentId: number) =>
    `${environment.apiURL.concat(
      CHAT_BASE
    )}/DeleteMessageWithStudent/${studentId}`,
};

export const GRADES_URLS = {
  CREATE: `${environment.apiURL.concat(GRADES_BASE)}`,
  GET: `${environment.apiURL.concat(GRADES_BASE)}`,
  DELETE: (id: number) => `${environment.apiURL.concat(GRADES_BASE)}/${id}`,
};

export const UNIT_URLS = {
  CREATE: `${environment.apiURL.concat(UNIT_BASE)}`,
  GET_UNITES_IN_GRADE: (gradeId: number) =>
    `${environment.apiURL.concat(UNIT_BASE)}/GetUnitsInGrade/${gradeId}`,
  DELETE: (id: string) => `${environment.apiURL.concat(UNIT_BASE)}/${id}`,
};

export const EXAM_URLS = {
  CREATE: `${environment.apiURL.concat(EXAM_BASE)}`,
  GET_EXAMS: `${environment.apiURL.concat(EXAM_BASE)}`,
  GET_EXAM: (examId: number) =>
    `${environment.apiURL.concat(EXAM_BASE)}/${examId}`,
  UPDATE: `${environment.apiURL.concat(EXAM_BASE)}`,
  DELETE: (examId: number) =>
    `${environment.apiURL.concat(EXAM_BASE)}/${examId}`,
};


export const TENANT_URLS = {
  CREATE: `${environment.apiURL.concat(TENANT_BASE)}`,
  GET_ALL: `${environment.apiURL.concat(TENANT_BASE)}`,
  UPDATE:`${environment.apiURL.concat(TENANT_BASE)}`,
  GET_BY_ID: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/${id}`,
  DELETE: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/${id}`,
  ACTIVATE: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/ActivateTenant/${id}`,
  DEACTIVATE: (id: string) => `${environment.apiURL.concat(TENANT_BASE)}/DeActivateTenant/${id}`,
};

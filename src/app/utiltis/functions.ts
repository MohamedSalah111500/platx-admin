import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function randId(prefix = "id"): string {
  return String(
    Math.random()
      .toString(36)
      .replace("0.", prefix || "")
  );
}

export function pagination(
  url: string,
  pageNumber: number = 1,
  pageSize: number = 10
): string {
  return `${url}?page=${pageNumber}&size=${pageSize}`;
}
export function paginationWithSearch(
  url: string,
  search: string = "",
  pageNumber: number = 1,
  pageSize: number = 10
): string {
  return `${url}?search=${search}&?page=${pageNumber}&size=${pageSize}`;
}

export function convertObjectToArray(obj: { [key: number]: string }): any[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: value,
    value: Number(key),
  }));
}

export function getIconClass(mimeType: string): string {
  if (mimeType.includes("document")) mimeType = "application/document";

  switch (mimeType) {
    case "application/pdf":
      return "fa fa-file-pdf text-danger";
    case "application/document":
      return "mdi mdi-file-document text-primary ";
    case "image/png":
    case "image/jpeg":
    case "image/gif":
      return "fa fa-file-image";
    case "video/mp4":
    case "video/avi":
    case "video/mpeg":
      return "fa fa-file-video";
    case "text/html":
    case "text/plain":
      return "fa fa-file-alt";
    default:
      return "fa fa-file"; // Font Awesome default file icon class
  }
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function downloadFileUseURL(url: string): void {
  window.open(url, "_blank");
  URL.revokeObjectURL(url);
}

function parseSize(sizeStr: string): number {
  if (sizeStr.toLowerCase().endsWith("kb")) {
    return parseFloat(sizeStr) * 1024; // Convert KB to bytes
  } else if (sizeStr.toLowerCase().endsWith("mb")) {
    return parseFloat(sizeStr) * 1024 * 1024; // Convert MB to bytes
  } else if (sizeStr.toLowerCase().endsWith("gb")) {
    return parseFloat(sizeStr) * 1024 * 1024 * 1024; // Convert GB to bytes
  }
  return 0;
}

export function calculateTotalSizeInGB(fileSizes: any): number {
  let totalBytes = 0;

  if (fileSizes.wordSize) {
    totalBytes += parseSize(fileSizes.wordSize);
  }
  if (fileSizes.pdfSize) {
    totalBytes += parseSize(fileSizes.pdfSize);
  }
  if (fileSizes.imageSize) {
    totalBytes += parseSize(fileSizes.imageSize);
  }
  if (fileSizes.videoSize) {
    totalBytes += parseSize(fileSizes.videoSize);
  }

  // Convert total size from bytes to GB
  return totalBytes / (1024 * 1024 * 1024);
}

export function formatStorageUsage(
  usedSizeGB: number,
  totalSizeGB: number
): { usedSizeDisplay: string; usedPercentage: number } {
  let usedSizeDisplay = "";
  let usedPercentage = (usedSizeGB / totalSizeGB) * 100;

  if (usedSizeGB < 1) {
    const usedSizeMB = usedSizeGB * 1024; // Convert GB to MB for display
    usedSizeDisplay = `${usedSizeMB.toFixed(2)} MB`;
  } else {
    usedSizeDisplay = `${usedSizeGB.toFixed(2)} GB`;
  }
  return {
    usedSizeDisplay,
    usedPercentage,
  };
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function formatDateCustomForCalender(dateString: string): string {
  // Parse the date string to a Date object
  const date = new Date(dateString);

  // Format the date as "dd-MM-yyyy"
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const [month, day, year] = formattedDate.split("/");
  return `${day}-${month}-${year}`;
}

export function convertBackendEventToFullCalendarEvent(backendEvent: any): any {
  const { id, name, date, startTime, duration, status, statusText } =
    backendEvent;

  // Construct the start datetime from date and startTime
  const startDateTime = new Date(`${date.split("T")[0]}T${startTime}`);

  // Calculate the end datetime by adding the duration (in hours) to the start time
  const endDateTime = new Date(
    startDateTime.getTime() + duration * 60 * 60 * 1000
  );

  // Return the FullCalendar event object
  return {
    id: id.toString(),
    title: name,
    start: startDateTime,
    end: endDateTime,
    description: backendEvent.description, // Optionally include more details
  };
}

export function getKeysFromEnum(enumObj: any): string[] {
  return Object.keys(enumObj).filter((key) => isNaN(Number(key)));
}

export function getHourAndMinuteFromDate(date: Date): string {
  debugger;
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export function generateDaysOfMonth() {
  return Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    name: (i + 1).toString(),
  }));
}

export function generateFileTypesIcons(attachementType: number, fontSize = 16) {
  let icon: string, color: string;
  switch (attachementType) {
    case 1:
      icon = "mdi-file-document";
      color = "primary";
      break;
    case 2:
      icon = "mdi-file-pdf";
      color = "danger";
      break;
    case 3:
      icon = "mdi-image";
      color = "success";
      break;
    case 4:
      icon = "mdi-play-circle-outline";
      color = "danger";
      break;
    case 5:
      icon = "mdi-link";
      color = "info";
      break;
    default:
      icon = "mdi-file-document";
      color = "primary";
      break;
  }
  return `<i class="mdi ${icon} font-size-${fontSize} text-${color} me-2"></i>`;
}

export function convertDateToLocalDate(date: string) {
  const utcDate = new Date(date + "Z"); // Date from server (UTC)
  return utcDate.toLocaleString();
}

export function atLeastOneRadioSelected(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controller = control.get(controlName)?.value;
    const isAnySelected = controller?.some((answer: any) => answer.isCorrect);
    return isAnySelected ? null : { required: true };
  };
}

export function errorMapper(errors: any): string {
  const errorList = Object.entries(errors as Record<string, string[]>).map(
    ([field, messages]) => `${field}: ${messages.join(", ")}`
  );
  return errorList.join(", ");
}

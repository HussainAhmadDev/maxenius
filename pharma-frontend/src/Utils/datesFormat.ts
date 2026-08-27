import { format } from "date-fns";

export function getFormattedDate() {
  const now = new Date();
  return format(now, "ddMMyyHHmmss");
}

export function convertToFormattedFileName(originalFileName: string) {
  const timestamp = getFormattedDate();
  const extension = originalFileName.split(".").pop();
  return `Private-Prescription-Register-${timestamp}.${extension}`;
}

export const dateFormat = "MM/d/yyyy";

export const ukDateFormat = (date: Date | string, time: boolean) => {
  // Check if the input date is already in the "dd/MM/yyyy" format
  if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date + (time ? " hh:mm a" : "");
  }
  return date ? format(new Date(date), `dd/MM/yyyy ${time ? "hh:mm a" : ""}`) : "";
};

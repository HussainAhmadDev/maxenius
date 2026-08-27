import dayjs from "dayjs";

export function getFormattedDate() {
  const now = dayjs();
  return now.format("DDMMYYHHmmss");
}

export function convertToFormattedFileName(originalFileName: string) {
  const timestamp = getFormattedDate();
  const extension = originalFileName.split(".").pop();
  return `Private-Prescription-Register-${timestamp}.${extension}`;
}

export function uuid(): string {
  let dt = new Date().getTime();
  const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return id;
}

export const dateFormat = "MM/D/YYYY";

export const ukDateFormat = (date: Date | string | undefined | null, time: boolean) => {
  try {
    if (!date) {
      throw new Error("No Date");
    }

    if (typeof date === "string" && new RegExp(/^\d{2}\/\d{2}\/\d{4}$/).test(date)) {
      return date + (time ? " hh:mm A" : "");
    }

    if (typeof date === "string" && new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(date)) {
      return date + (time ? " hh:mm A" : "");
    }

    if (typeof date === "string") {
      return dayjs(date).format(`DD/MM/YYYY ${time ? "hh:mm A" : ""}`);
    }

    if (date instanceof Date) {
      return dayjs(date).format(`DD/MM/YYYY ${time ? "hh:mm A" : ""}`);
    }

    return "---";
  } catch (e) {
    return "---";
  }
};

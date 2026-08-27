/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { toast, ToastOptions } from "react-toastify";

export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 1000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined
};

export const showSuccess = (message: string) => {
  toast.success(message, toastConfig);
};
export const showError = (message: string) => {
  toast.error(message, toastConfig);
};
export const showWarning = (message: string) => {
  toast.warning(message, toastConfig);
};
export const showInfo = (message: string) => {
  toast.info(message, toastConfig);
};

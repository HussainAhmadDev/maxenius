export interface WarningMessageBody {
  warningNumber: string | number;
  message: string;
  warning_id?: string;
}
export interface WarningMessageResponse {
  id: string;
  created: string;
  updated: string;
  warningNumber: string;
  brand_id: string;
  message: string;
  is_trash: boolean;
}

export interface WarningMessageList {
  id: string;
  created: string;
  updated: string | null;
  warningNumber: string;
  brand_id: string;
  message: string;
  is_trash: boolean;
}

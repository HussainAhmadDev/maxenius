export interface Fridge {
  brand_id: string;
  created: string;
  description: string;
  fridge_number: string;
  id: string;
  is_active: boolean;
  is_trash: string;
  location: string;
  updated: string;
  user_id: string;
  notify_to: string;
}
export interface FridgeResponse {
  total: number;
  count: number;
  pages: number;
  page: number;
  results: Fridge[];
}
export interface UpdateFridge {
  readonly brand_id: string;
  readonly fridge_number: string;
  readonly location: string;
  readonly description: string;
  readonly is_active: boolean;
  readonly notify_to: string;
  readonly id: string;
}
export interface FridgePurchase {
  readonly brand_id: string;
  readonly fridge_number: string;
  readonly location: string;
  readonly description: string;
  readonly is_active: boolean;
  readonly notify_to: string;
}

export interface PurchaseFridgeState {
  brand_id: string;
  fridge_number: string;
  location: string;
  description: string;
  is_active: boolean;
  notify_to: string;
}

export interface UpdateFridgeState extends PurchaseFridgeState {
  id: string;
}

export interface FridgeLogs {
  "AM/PM": "AM" | "PM";
  entry_date: string;
  entry_time: string;
  fridge_number: string;
  id?: string;
  fridge_id?: string;
  max_temp: string;
  min_temp: string;
  notes: string;
  room_temp: string;
}

export interface FridgeLogsResponse {
  total: number;
  count: number;
  pages: number;
  page: number;
  results: FridgeLogs[];
}

export interface FridgeLogCreate {
  id?: string;
  fridge_id: string;
  min_temp: string;
  max_temp: string;
  room_temp: string;
  notes: string;
  initials?: string;
  is_trash?: boolean;
}

export interface UpdateFridgeLog {
  id?: string;
  brand_id?: string;
  fridge_number?: string;
  fridge_id: string;
  min_temp: string;
  max_temp: string;
  room_temp: string;
  notes: string;
  initials?: string;
  is_trash?: boolean;
}

interface User {
  is_pharmacist: boolean;
  id: string;
  created: string;
  updated: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  password: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_manager: boolean;
  is_associate: boolean;
  email: string;
  mobile_phone: string;
  office_phone: string;
  last_login: string;
  date_joined: string;
  is_active: string;
  username: string;
  token: string;
  token_expiry: string;
  type: string;
  profilePic: string;
  auth0_user_id: string;
  auth0_blocked_status: string;
  is_trash: string;
}
interface Brand {
  id: string;
  name: string;
}
interface UserWithBrands extends User {
  brands: Brand[];
}
interface UserData {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly middle_name?: string;
  password?: string;
  readonly email: string;
  readonly mobile_phone?: string;
  readonly office_phone?: string;
  readonly date_joined?: string;
  readonly last_login?: string;
  readonly external_id?: string;
  readonly type?: "organization" | "brand" | "company" | "contact" | "user";
  readonly created?: string;
  readonly updated?: string;
  readonly is_trash?: boolean | string;
  readonly is_active?: boolean;
  readonly is_staff?: boolean;
  readonly is_superuser?: boolean;
  readonly is_supersuper?: boolean;
  readonly is_manager?: boolean;
  readonly profilePic?: string;
  readonly is_associate?: boolean;
  brand_id?: string;
  brands?: Brand[];
  auth0_blocked_status?: boolean;
  auth0_user_id?: string;
}

interface UserResponse {
  readonly results: Array<User>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export type { User, UserResponse, UserWithBrands, UserData, Brand };

export interface LogoutData {
  user_id: string;
  note: string;
}

export interface LogoutResponse {
  // Define the expected response fields from the API if known
  // For example:
  success: boolean;
}

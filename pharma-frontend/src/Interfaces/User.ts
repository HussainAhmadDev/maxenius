export type BrandType = {
  name: string;
  id: string;
};

export interface UserData {
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
  readonly is_associate?: boolean;

  readonly profilePic?: string;
  brand_id?: string;
  brands?: string | string[] | BrandType[];
  auth0_blocked_status?: boolean;
  auth0_user_id?: string;
}

export interface UserResponse {
  readonly results: Array<UserData>;
  readonly page?: number;
  readonly count?: number;
  readonly total?: number;
  readonly pages?: number;
}

export interface User {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly middle_name: string;
  readonly email: string;
  readonly is_superuser: boolean;
  readonly is_staff: boolean;
  readonly is_manager: boolean;

  external_id?: string;
}

export interface AuthUser {
  created: string;
  created_at: string;
  date_joined: string;
  email: string;
  first_name: string;
  identities: Identity[];
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_trash: boolean;
  last_name: string;
  middle_name: string;
  mobile_phone: string;
  name: string;
  nickname: string;
  office_phone: string;
  picture: string;
  profilePic: string;
  type: string;
  updated: string;
  updated_at: string;
  user_id: string;
  username: string;
  blocked: boolean;
  multifactor: string[];
  multifactor_last_modified: string;
  last_login: string;
  last_ip: string;
  logins_count: number;
}

interface Identity {
  user_id: string;
  provider: string;
  connection: string;
  isSocial: boolean;
}

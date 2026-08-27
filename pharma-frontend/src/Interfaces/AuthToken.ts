export interface AuthResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly access_token_expire: number;
  readonly refresh_token_expire: number;
  readonly permissions: Array<string>;
}

type UserData = {
  readonly first_name: string;
  readonly last_name: string;
  readonly middle_name?: string;
  readonly is_staff: boolean;
  readonly is_superuser: boolean;
  readonly email: string;
  readonly mobile_phone?: string;
  readonly office_phone?: string;
  readonly is_active: boolean;
  readonly date_joined: string;
  readonly last_login?: string;
  readonly updated?: string;
};
export interface UserResponse {
  readonly results: Array<UserData>;
  readonly page: number;
  readonly count: number;
  readonly total: number;
  readonly pages: number;
}

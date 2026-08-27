interface SideMenus {
  title: string;
  route: string;
  icon: string | unknown;
  key?: string;
  tabSystem?: boolean;
  relativeRoutes?: string[];
}
interface SelectOption {
  label: string;
  value: string;
  received_quantity?: number | string;
}
type AllowedActionColumns = ("manager" | "staff" | "static")[];
export type { SideMenus, SelectOption, AllowedActionColumns };

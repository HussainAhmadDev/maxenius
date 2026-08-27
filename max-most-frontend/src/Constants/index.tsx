import { SelectOption, SideMenus } from "../Interfaces/ui";

interface CurrencyOption extends SelectOption {
  label: CurrencyLabel;
}
export const currencyOptions: Array<CurrencyOption> = [
  { label: "AUD", value: "aud" },
  { label: "CAD", value: "cad" },
  { label: "CNY", value: "cny" },
  { label: "EUR", value: "eur" },
  { label: "GBP", value: "gbp" },
  { label: "MXN", value: "mxn" },
  { label: "USD", value: "usd" }
];
export type CurrencyLabel = "AUD" | "CAD" | "CNY" | "EUR" | "GBP" | "MXN" | "USD";

export const currencySymbols: Record<CurrencyLabel, string> = {
  AUD: "$",
  CAD: "$",
  CNY: "¥",
  EUR: "€",
  GBP: "£",
  MXN: "$",
  USD: "$"
};

export const asideMenus: SideMenus[] = [
  {
    title: "Dashboard",
    icon: "/assets/icons/dashboard.svg",
    route: "/dashboard",
    key: "dashboard"
  },
  {
    title: "Orders",
    route: "/orders",
    icon: "/assets/icons/orderIcon.svg",
    key: "orders",
    relativeRoutes: ["edit-order"]
  },
  {
    title: "Create Order",
    route: "/create-order",
    icon: "/assets/icons/create-order-icon.svg",
    key: "none"
  },
  {
    title: "Patients",
    route: "/patients",
    icon: "/assets/icons/patientIcon.svg",
    key: "patients"
  },
  {
    title: "Products",
    route: "/products",
    icon: "/assets/icons/productIcon.svg",
    key: "products",
    relativeRoutes: ["edit-product"]
  },
  {
    title: "Products Activity Log",
    route: "/products-activity-log",
    icon: "/assets/icons/productIcon.svg",
    key: "product-activity-log"
  },
  {
    title: "Reports",
    route: "/reports/overview",
    icon: "/assets/icons/reportIcon.svg",
    key: "reports",
    tabSystem: true
  },
  {
    title: "Purchase Orders",
    route: "/purchase-orders",
    icon: "/assets/icons/purchaseOrder.svg",
    key: "purchase-order",
    relativeRoutes: ["edit-purchaseOrder", "create-purchaseOrder"]
  },

  {
    title: "Product Transactions",
    route: "/product-transactions",
    icon: "/assets/icons/productTransaction.svg",
    key: "product-transaction"
  },
  {
    title: "Product Expiry",
    route: "/product-expiry",
    icon: "/assets/icons/productTransaction.svg",
    key: "product-expiry"
  },

  {
    title: "Temperature Log",
    route: "/fridges-log",
    icon: "/assets/icons/purchaseOrder.svg",
    key: "fridges-log"
  }
];
export const adminMenus: SideMenus[] = [
  {
    title: "Vendors",
    route: "/admin/vendors",
    icon: "/assets/icons/Mask group.svg",
    relativeRoutes: ["edit-vendor", "add-vendor"]
  },
  {
    title: "Users",
    route: "/admin/users",
    icon: "/assets/icons/Mask group (1).svg",
    relativeRoutes: ["create-user", "edit-user"]
  },
  {
    title: "Warehouses",
    icon: "/assets/icons/Mask group.svg",
    route: "/admin/Warehouse",
    relativeRoutes: ["add-warehouse", "edit-warehouse"]
  },
  {
    title: "Stock Adjustment",
    icon: "/assets/icons/StockAdjustment.svg",
    route: "/admin/stock-adjustment/increase stock",
    tabSystem: true
  },
  {
    title: "Stock Transfer",
    icon: "/assets/icons/stock-transfer-icon.svg",
    route: "/admin/stock-transfer"
  },
  {
    title: "Warning Messages",
    icon: "/assets/icons/warning-messages.svg",
    route: "/admin/warning-messages"
  },
  {
    title: "Websites",
    icon: "/assets/icons/websites-icon.svg",
    route: "/admin/websites",
    relativeRoutes: ["update-website", "create-website"]
  },
  {
    title: "Brands",
    icon: "/assets/icons/brands-icon.svg",
    route: "/admin/brands",
    relativeRoutes: ["add-brand", "edit-brand"]
  },
  {
    title: "Quotes",
    icon: "/assets/icons/quotes-icon.svg",
    route: "/admin/quotes",
    relativeRoutes: ["add-quotes", "edit-quotes"]
  },
  {
    title: "Brand Settings",
    icon: "/assets/icons/brand-settings-icon.svg",
    route: "/admin/brand-settings"
  },
  {
    title: "Meta Fields",
    icon: "/assets/icons/brand-settings-icon.svg",
    route: "/admin/meta-fields"
  },
  {
    title: "Fridge List",
    icon: "/assets/icons/brand-settings-icon.svg",
    route: "/admin/fridges-lists"
  },
  {
    title: "Temperature Log",
    icon: "/assets/icons/brand-settings-icon.svg",
    route: "/admin/temperature-log"
  },
  {
    title: "Access Logs",
    icon: "/assets/icons/brand-settings-icon.svg",
    route: "/admin/AccessLogs"
  }
];
export const otherMenus: SideMenus[] = [
  {
    title: "Trash",
    icon: "/assets/delete-icon.svg",
    route: "/trash/orders",
    tabSystem: true
  }
];
export const dashboardCards = [
  {
    cardImage: "/assets/icons/orderCardIcon.svg",
    card_heading: "Orders",
    card_arrow: "View orders",
    card_link: "/orders",
    key: "orders"
  },
  {
    cardImage: "/assets/icons/productCardIcon.svg",
    card_heading: "Products",
    card_arrow: "View Products",
    card_link: "/products",
    key: "products"
  },

  {
    cardImage: "/assets/icons/patientCardIcon.svg",
    card_heading: "Patients",
    card_arrow: "View Patients",
    card_link: "/patients",
    key: "patients"
  },
  {
    cardImage: "/assets/icons/precriptionCardIcon.svg",
    card_heading: "Private Prescription Register",
    card_arrow: "Select Website",
    key: "private-prescription"
  }
];

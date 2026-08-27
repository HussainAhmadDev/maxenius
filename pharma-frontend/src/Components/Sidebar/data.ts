import {
  CustomersIcon,
  DashboardIcon,
  OrdersIcon,
  ProductsIcon,
  ReportsIcon
} from "../icons";
export const brands = [
  {
    id: "7Zq0kW",
    address_id: "WkbBk3",
    organization_id: "7Zq0kW",
    address: {
      is_residental: false,
      company: null,
      description: null,
      email2: null,
      phone: null,
      last_name: "Smith",
      is_default: false,
      country: "pk",
      type: "contact",
      city: "my city",
      middle_name: null,
      phone2: null,
      first_name: "Jhon",
      email3: null,
      is_billing: false,
      zip: "39933",
      street3: null,
      fax: null,
      street4: null,
      state: null,
      email4: null,
      email: null,
      street2: null,
      id: "WkbBk3",
      street1: "str#02",
      label: null,
      is_shipping: false
    },
    name: "Refine Pharma",
    description: "Refine pharma main site",
    url: "refinepharma.com",
    logo: "logo.png",
    email: "info@refinepharma.com",
    domain: "refinepharma.com",
    office_phone: "89798",
    fax_phone: "699",
    twitter: null,
    facebook: null,
    linkedin: null,
    instagram: null,
    pinterest: null,
    tiktok: null
  }
];
export const navLinks = [
  { to: "/", title: "Dashboard", brandSetting: "dashboard", Icon: DashboardIcon },
  { to: "/orders", title: "Orders", brandSetting: "orders", Icon: OrdersIcon },
  { to: "/Patients", title: "Patients", brandSetting: "patients", Icon: CustomersIcon },
  { to: "/products", title: "Products", brandSetting: "products", Icon: ProductsIcon },
  { to: "/reports", title: "Reports", brandSetting: "reports", Icon: ReportsIcon },
  {
    to: "/purchase-orders",
    title: "Purchase Orders",
    brandSetting: "purchase-order",
    Icon: OrdersIcon
  },
  {
    to: "/product-transactions",
    title: "Product Transactions",
    brandSetting: "product-transaction",

    Icon: OrdersIcon
  },
  {
    to: "/product-expiry",
    title: "Product Expiry",
    brandSetting: "product-expiry",
    Icon: OrdersIcon
  }
];

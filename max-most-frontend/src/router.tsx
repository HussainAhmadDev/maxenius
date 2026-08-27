import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import IntervalServerError from "./Pages/IntervalServerError";
import { Suspense, lazy } from "react";
import SuspenseLoader from "./Pages/SuspenseLoader";

function component(path: string) {
  const Component = lazy(async () => import(`./${path}`));
  return <Component />;
}

const router = createBrowserRouter([
  {
    element: component("Guards/authGuard.tsx"),
    errorElement: <IntervalServerError />,
    children: [
      {
        element: component("Layouts/Default"),
        children: [
          {
            path: "/",
            element: <Navigate to={"/dashboard"} />
          },
          {
            path: "/dashboard",
            element: component("Pages/Dashboard")
          },
          {
            path: "/orders",
            element: component("Pages/Order")
          },
          {
            path: "/edit-order/:orderId",
            element: component("Pages/Order/Components/EditOrder")
          },
          {
            path: "/edit-customer/:id",
            element: component("Pages/Customer")
          },
          {
            path: "/edit-customer/:id/contact",
            element: component("Pages/Contact")
          },
          {
            path: "/purchase-orders",
            element: component("Pages/PurchaseOrder")
          },
          {
            path: "/fridges-log",
            element: component("Pages/Fridges/Components/FridgesLog")
          },
          {
            path: "/edit-purchaseOrder/:orderId",
            element: component("Pages/PurchaseOrder/Components/editPurchaseOrder")
          },
          {
            path: "/create-purchaseOrder",
            element: component("Pages/PurchaseOrder/Components/CreatePurchaseOrder")
          },
          {
            path: "/patients",
            element: component("Pages/Patients")
          },
          {
            path: "/products",
            element: component("Pages/Product")
          },
          {
            path: "/products-activity-log",
            element: component("Pages/ActiveProducts")
          },
          {
            path: "/create-product",
            element: component("Pages/Product/Components/createProduct.tsx")
          },
          {
            path: "/edit-product/:sku",
            element: component("Pages/Product/Components/editProduct")
          },
          {
            path: "/reports/:tab",
            element: component("Pages/Reports")
          },
          {
            path: "/product-transactions",
            element: component("Pages/ProductTransaction")
          },
          {
            path: "/product-expiry",
            element: component("Pages/ProductExpiry")
          },
          {
            path: "/create-order",
            element: component("Pages/Order/Components/CreateOrder.tsx")
          },
          {
            element: component("Guards/adminGuard.tsx"),
            children: [
              {
                path: "/trash/:tab",
                element: component("Pages/Trash")
              },
              {
                path: "/admin/vendors",
                element: component("Pages/Admin/Vendors")
              },
              {
                path: "/admin/add-vendor",
                element: component("Pages/Admin/Vendors/Components/Addvendor")
              },
              {
                path: "/admin/edit-vendor/:id",
                element: component("Pages/Admin/Vendors/Components/Addvendor")
              },
              {
                path: "/admin/users",
                element: component("Pages/Admin/Users")
              },
              {
                path: "/admin/edit-user/:id",
                element: component("Pages/Admin/Users/Components/CreateUser")
              },
              {
                path: "/admin/create-user",
                element: component("Pages/Admin/Users/Components/CreateUser")
              },
              {
                path: "/admin/warehouse",
                element: component("Pages/Admin/WareHouse")
              },
              {
                path: "/admin/add-warehouse",
                element: component("Pages/Admin/WareHouse/Components/AddWareHouse")
              },
              {
                path: "/admin/edit-warehouse/:id",
                element: component("Pages/Admin/WareHouse/Components/AddWareHouse")
              },
              {
                path: "/admin/stock-adjustment/:tab",
                element: component("Pages/Admin/StockAdjustment")
              },
              {
                path: "/admin/warning-messages",
                element: component("Pages/Admin/WarningMessages")
              },
              {
                path: "/admin/brand-settings",
                element: component("Pages/Admin/BrandSettings")
              },
              {
                path: "/admin/stock-transfer",
                element: component("Pages/Admin/StockTransfer")
              },
              {
                path: "/admin/quotes",
                element: component("Pages/Admin/Quotations")
              },
              {
                path: "/admin/create-quote",
                element: component("Pages/Admin/Quotations/Components/createQuote")
              },
              {
                path: "/admin/edit-quote/:id",
                element: component("Pages/Admin/Quotations/Components/editQuote")
              },
              {
                path: "/admin/brands",
                element: component("Pages/Admin/Brands")
              },
              {
                path: "/admin/add-brand",
                element: component("Pages/Admin/Brands/Components/addEditBrand")
              },
              {
                path: "/admin/edit-brand/:id",
                element: component("Pages/Admin/Brands/Components/addEditBrand")
              },
              {
                path: "/admin/websites",
                element: component("Pages/Admin/Websites")
              },
              {
                path: "/admin/create-website",
                element: component("Pages/Admin/Websites/Components/CreateWebsite.tsx")
              },
              {
                path: "/admin/update-website/:id",
                element: component("Pages/Admin/Websites/Components/CreateWebsite.tsx")
              },
              {
                path: "/admin/meta-fields",
                element: component("Pages/Admin/MetaFields/index.tsx")
              },
              {
                path: "/admin/meta-fields/products",
                element: component(
                  "Pages/Admin/MetaFields/Component/ProductsMetaFields/index.tsx"
                )
              },
              {
                path: "/admin/meta-fields/products/create",
                element: component(
                  "Pages/Admin/MetaFields/Component/ProductsMetaFields/CreateMetaFields.tsx"
                )
              },
              {
                path: "/admin/meta-fields/products/edit/:id",
                element: component(
                  "Pages/Admin/MetaFields/Component/ProductsMetaFields/EditMetaField.tsx"
                )
              },
              {
                path: "/admin/fridges-lists",
                element: component("Pages/Admin/FridgesLists/index.tsx")
              },
              {
                path: "/admin/AccessLogs",
                element: component("Pages/Admin/AccessLogs/index.tsx")
              },
              {
                path: "/admin/temperature-log",
                element: component("Pages/Fridges/Components/FridgesLog/index.tsx")
              }
            ]
          }
        ]
      }
    ]
  },
  {
    element: component("Pages/PageNotFound"),
    path: "*"
  },
  {
    element: component("Layouts/Auth"),
    errorElement: <IntervalServerError />,
    children: [
      {
        element: component("Pages/Login"),
        path: "/login"
      },
      {
        element: component("Pages/ResetPassword"),
        path: "/reset-password/:email/:token"
      }
    ]
  },
  {
    path: "/unauthorized",
    element: component("Pages/NotAuthorizedPage"),
    errorElement: <IntervalServerError />
  }
]);

const Router = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <RouterProvider router={router} fallbackElement={<SuspenseLoader />} />
    </Suspense>
  );
};
export default Router;

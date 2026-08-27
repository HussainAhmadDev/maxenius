import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import MetaFieldDefinitions from "./Component/metaFieldSelectionList";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import ReceiptIcon from "@mui/icons-material/Receipt";

const metaFieldDefinitionsData = [
  {
    label: "Products",
    path: "product_field_definition",
    to: "/admin/meta-fields/products",
    count: 1,
    icon: <ShoppingCartIcon />
  }

  // ? Not used yet
  // {
  //   label: "Orders",
  //   path: "order_field_definition",
  //   count: 0,
  //   icon: <ReceiptIcon />,
  //   to: ""
  // },
  // {
  //   label: "Purchase Order",
  //   path: "purchase_order_field_definition",
  //   to: "",
  //   count: 0,
  //   icon: <ReceiptIcon />
  // },
  // {
  //   label: "Company",
  //   count: 0,
  //   path: "company_field_definition",
  //   icon: <ReceiptIcon />,
  //   to: ""
  // }
];

const DynamicForm: React.FC = () => {
  const [selectedMetaFieldFor, setSelectedMetaFieldFor] = useState<{
    label: string;
    status: boolean;
    path: string;
    to: string;
  } | null>(null);

  useEffect(() => {
    setSelectedMetaFieldFor(null);
  }, []);

  return (
    <>
      {!selectedMetaFieldFor?.status && (
        <Card>
          <MetaFieldDefinitions
            setSelectedMetaFieldFor={setSelectedMetaFieldFor}
            definitions={metaFieldDefinitionsData}
          />
        </Card>
      )}
    </>
  );
};

export default DynamicForm;

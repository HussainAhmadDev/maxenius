import { TableColumn } from "react-data-table-component";
import { Box, Button } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ProductDetails } from "@interfaces/productActiveLogType"; // Ensure you are
import dayjs from "dayjs";

type Columns = TableColumn<ProductDetails>[]; // Change User to ProductDetails

type Props = {
  HandleSendPayload(row: ProductDetails): void;
  HandleSendResponse(row: ProductDetails): void;
};

const ProductsActivityLogConst = (props: Props): Columns => {
  const { HandleSendPayload, HandleSendResponse } = props;

  return [
    {
      name: "Product Id",
      selector: row => row?.product_id,
      sortable: true,
      minWidth: "120px"
    },
    {
      name: "Product Name",
      selector: row => row.product_name,
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Inventory Item Id",
      selector: row => row?.inventory_item_id,
      sortable: true,
      minWidth: "150px"
    },
    {
      name: "Platform Product Id",
      selector: row => row?.paltform_product_id,
      sortable: true,
      minWidth: "165px"
    },
    {
      name: "Sku",
      selector: row => row?.sku,
      sortable: true,
      minWidth: "100px"
    },

    {
      name: "Website Domain",
      selector: row => row.website_domain,
      sortable: true,
      minWidth: "150px"
    },

    {
      name: "Quantity",
      selector: row => row.quantity,
      sortable: true,
      minWidth: "100px",
      cell: row => <Box sx={{ pl: 3 }}>{row.quantity}</Box>
    },
    {
      name: "Price",
      selector: row => row.price,
      sortable: true,
      minWidth: "100px"
    },
    {
      name: "Action",
      selector: row => row.action,
      sortable: true,
      minWidth: "100px"
    },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
      minWidth: "100px"
    },
    {
      name: "Request by",
      selector: row => row.request_by,
      sortable: true,
      minWidth: "130px"
    },
    {
      name: "Request at",
      selector: row => dayjs(row.request_at).format("YYYY-MM-DD"),
      sortable: true,
      minWidth: "130px"
    },
    {
      name: "Payload",
      selector: row => row.paltform_product_id,
      sortable: true,
      minWidth: "80px",

      cell: row => {
        return (
          <Button
            variant="text"
            color="primary"
            onClick={() => HandleSendPayload(row)}
            endIcon={<Visibility />}
            size="small"
          />
        );
      },
      button: true
    },
    {
      name: "Response",
      selector: row => row.paltform_product_id,
      sortable: true,
      minWidth: "80px",
      cell: row => {
        return (
          <Box>
            <Button
              variant="text"
              color="primary"
              onClick={() => HandleSendResponse(row)}
              endIcon={<Visibility />}
              size="small"
            />
          </Box>
        );
      },
      button: true
    }
  ];
};

export { ProductsActivityLogConst };

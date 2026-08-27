import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import DataTable from "Components/DataTable/Table";
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import AddReturnModel from "Components/Modals/AddReturn";
import { useModal } from "Hooks/useModal";
import { EmptyData } from "Components/icons/EmptyData";
// import { Avatar } from "@mui/material";
// import get from "lodash/get";
import { OrderData } from "Interfaces/Order";

interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: string;
  readonly selector: (row: Returned) => string | React.ReactNode | undefined;
}

// TODO : fix this according to API
interface Returned {
  sku: string;
  name: string;
  quantityOrdered: number;
  quantityReturned: number;
  currentQuantity: number;
  amountRefunded: number;
  quantityShipped: number;
  date: string;
  image?: string;
  prescription_id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      marginTop: "6px"
    },
    imgDiv: {
      display: "flex",
      textAlign: "center",
      color: "red"
    },
    productName: {
      whiteSpace: "normal"
    },
    productNameSku: {
      maxWidth: "300px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "5px"
    },
    productNameReturn: {
      color: "rgb(255, 23, 61)",
      fontSize: "12px"
    }
  })
);

interface Props {
  order: OrderData;
}

const Return: React.FC<Props> = ({ order }) => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => null
  });
  const [checked, setChecked] = React.useState(false);

  const returnedProducts = React.useMemo(() => {
    if (order.products && order.products.length > 0) {
      const filteredReturns: Array<Returned> = [];

      order.products?.forEach(product => {
        product?.order_product_return?.forEach(productReturn => {
          filteredReturns.push({
            sku: product.sku || "",
            name: product.product?.name || "",
            quantityOrdered: product.quantity || 0,
            quantityShipped: product.shipped_quantity || 0,
            quantityReturned: productReturn.return_shipment.quantity,
            image: product.product?.image,
            currentQuantity: product.quantity,
            date: new Date(productReturn.created).toLocaleDateString(),
            amountRefunded: 0,
            prescription_id: product.prescription_id
          });
        });
      });
      return filteredReturns;
    }
    return [];
  }, [order.products]);

  const columns: ColumnsProps[] = [
    // {
    //   name: "Product Number",
    //   selector: row => (
    //     <div className={classes.productNameSku}>

    //       <p> {row.sku}</p>
    //     </div>
    //   )
    // },
    {
      name: "Product Name",
      selector: row => (
        <div className={classes.productNameReturn}>
          {row.name || "--"}
          <br />
          <p>{row.prescription_id ? "Prescription id: " + row.prescription_id : ""}</p>
        </div>
      )
    },
    {
      name: "Qty Ordered",
      selector: row => `${row.quantityOrdered || 0}`
    },
    {
      name: "Returned",
      selector: row => `${row.quantityReturned || 0}`
    },
    {
      name: "Shipped",
      selector: row => `${row.quantityShipped || 0}`
    },

    {
      name: "Date",
      selector: row => `${row.date || "--"}`
    },
    {
      name: "Amount Refunded",
      selector: row => `${row.amountRefunded || "--"}`
    }
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <AddReturnModel
        saveText="Confirm Return"
        title="Add Return"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
        checkBox={{ text: "Refund Shipping", value: checked, handleChange: handleChange }}
        order={order}
      />
      <h2>Return History</h2>
      {returnedProducts?.length > 0 ? (
        <DataTable columns={columns} data={returnedProducts} />
      ) : (
        <div style={{ width: "40%", marginLeft: "40%" }}>
          <EmptyData height={100} />
          <p>No return added yet</p>
        </div>
      )}
      <br />
      <Grid container>
        <Grid lg={2} xs={6} item>
          <Button
            text="Add Return"
            type="secondary"
            icon={<MuiIcon icon="add" />}
            onClick={() => handleModalOpen()}
            disabled={!order.products?.length || order.is_trash}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Return;

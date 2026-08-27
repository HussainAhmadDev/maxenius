import * as React from "react";
import ProdcutEditableRow from "./ProdcutEditableRow";
import OrderSummary from "../OrderSummary";
import useStyles from "./indexStyles";
// import { EmptyData } from "../../icons/EmptyData";
import { OrderData } from "Interfaces/Order";
import { CompanyData } from "Interfaces/Company";

interface Props {
  order: OrderData;
  customer: CompanyData;
}
const PrescriptionProductsTable: React.FC<Props> = ({ order, customer }) => {
  const classes = useStyles();

  return (
    <div>
      <h2 className={classes.tableTitle}> Products</h2>
      <div>
        <table className={classes.table}>
          <thead className={classes.tHead}>
            <tr className={classes.tableHeader}>
              <th className={classes.tableCellSku}>Product</th>
              <th className={classes.tableCell}>Cost</th>
              <th className={classes.tableCell}>Qty</th>
              <th className={classes.tableCell}>Total Price</th>
            </tr>
          </thead>
          <ProdcutEditableRow />
        </table>
        {/* <div style={{ width: "50%", marginLeft: "40%" }}>
            <EmptyData height={100} />
          </div> */}
      </div>
      <OrderSummary
        orderProductsIds={order?.products?.map(product => product.product_id || "") || []}
        order={order || ({} as OrderData)}
        customer={customer || ({} as CompanyData)}
      />
    </div>
  );
};

export default PrescriptionProductsTable;

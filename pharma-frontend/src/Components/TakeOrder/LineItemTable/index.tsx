import * as React from "react";
import ProdcutEditableRow from "./ProdcutEditableRow";
import OrderSummary from "../OrderSummary";
import useStyles from "./indexStyles";
import { EmptyData } from "../../icons/EmptyData";
import { OrderData } from "Interfaces/Order";
import { CompanyData } from "Interfaces/Company";

interface Props {
  order: OrderData;
  customer: CompanyData;
}
const OrderProductsTable: React.FC<Props> = ({ order, customer }) => {
  const classes = useStyles();
  return (
    <div>
      <h2 className={classes.tableTitle}> Products</h2>
      <div>
        {order?.products && order?.products?.length > 0 ? (
          <table className={classes.table}>
            <thead className={classes.tHead}>
              <tr className={classes.tableHeader}>
                {/* <th className={classes.tableCell}>Product Number</th> */}
                <th className={classes.tableCell}>Name</th>
                <th className={classes.tableCell}>Batch & Expiry</th>
                <th className={classes.tableCell}>Qty</th>
                <th className={classes.tableCell}>Returned</th>
                <th className={classes.tableCell}>Unit Price</th>
                {/* <th className={classes.tableCell}>Shipping Cost</th> */}
                {/* <th className={classes.tableCell}>Is Saas</th> */}
                {/* <th className={classes.tableCell}>Is Tax Exempts</th> */}
                {/* <th className={classes.tableCell}>Tax Rate</th> */}
                <th className={classes.tableCell}>Shipping Date</th>

                <th className={classes.tableCell}>Total Price</th>
                {/* {user?.is_superuser && <th className={classes.tableCell}>Action</th>} */}
              </tr>
            </thead>
            {order?.products?.map((item, index) => (
              <ProdcutEditableRow key={index} data={item} order={order} />
            ))}
          </table>
        ) : (
          <div style={{ width: "50%", marginLeft: "40%" }}>
            <EmptyData height={100} />
          </div>
        )}
      </div>

      <OrderSummary
        orderProductsIds={order?.products?.map(product => product.product_id || "") || []}
        order={order || ({} as OrderData)}
        customer={customer || ({} as CompanyData)}
      />
    </div>
  );
};

export default OrderProductsTable;

import * as React from "react";
// import Button from "../../Button";
import useStyles from "./orderCalculationStyles";
// import Select from "../../Form/Select";
// import MuiIcon from "../../../Components/icons/MuiIcons";
import { OrderData } from "Interfaces/Order";
// import TextInput from "Components/Form/TextInput";
// import { useEditOrder, useEditOrderTaxRate } from "Hooks/useOrders";
import { CompanyData } from "Interfaces/Company";
// import { Typography } from "@material-ui/core";

interface Props {
  readonly label: string;
  readonly amount: number;
  readonly percentage?: boolean;
  readonly block?: boolean;
  readonly children?: JSX.Element;
}

// const options: { label: string; value: OrderCategory }[] = [
//   {
//     label: "Yes",
//     value: "standing"
//   },
//   {
//     label: "No",
//     value: "order"
//   }
// ];

const CalculatedLabel: React.FC<Props> = ({
  label,
  amount,
  block,
  percentage,
  children
}) => {
  const classes = useStyles();
  return (
    <div className={!block ? classes.textDiv : classes.textDivBlock}>
      <p className={classes.label}>{label}:</p>
      {amount === null || amount === undefined ? (
        <p>
          <b className={classes.amount}> -- -- </b>
          &nbsp;
        </p>
      ) : (
        <p>
          <b className={classes.amount}>
            {percentage ? `${amount.toFixed(2)}%` : `$${amount.toFixed(2)}`}
          </b>
        </p>
      )}
      {children}
    </div>
  );
};

const OrderSummary: React.FC<{ currentOrder: OrderData; customer: CompanyData }> = ({
  currentOrder
  // customer
}) => {
  const classes = useStyles();

  // const [editShipping, setEditShipping] = React.useState(false);
  // const [editTaxRate, setEditTaxRate] = React.useState(false);
  // const [shippingCost, setShippingCost] = React.useState(currentOrder.shipping_cost || 0);
  // const [taxRate, setTaxRate] = React.useState(currentOrder.custom_tax_percentage || 0);
  // const [isStandingOrder, setIsStandingOrder] = React.useState(
  //   currentOrder.category === "standing" ? options[0] : options[1]
  // );

  // const { mutate, isLoading } = useEditOrder(currentOrder.id);
  // const { mutate: editOrderTaxRate, isLoading: isLoadingEditOrderTaxRate } =
  //   useEditOrderTaxRate(currentOrder.id);

  // const toggleEditShippingCost = () => {
  //   setEditShipping(e => !e);
  // };

  // const toggleEditTaxRate = () => {
  //   setEditTaxRate(e => !e);
  // };

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.content}>
            <CalculatedLabel
              label="Items SubTotal"
              amount={currentOrder?.sub_total || 0}
            />
            {/* {!editShipping ? (
              <CalculatedLabel label="Shipping" amount={currentOrder?.shipping_cost || 0}>
                <Button
                  loading={isLoading}
                  icon={<MuiIcon fontSize="small" icon="edit" />}
                  onlyIcon
                  disabled={currentOrder.is_trash}
                  onClick={() => {
                    setShippingCost(currentOrder.shipping_cost || 0);
                    toggleEditShippingCost();
                  }}
                />
              </CalculatedLabel>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between"
                }}
              >
                <TextInput
                  name="shipping_cost"
                  margin="dense"
                  type="number"
                  value={shippingCost}
                  variant="outlined"
                  onChange={e => {
                    const { value } = e.target;
                    if (Number(value) >= 0) {
                      setShippingCost(Number.parseFloat(value));
                    }
                  }}
                  style={{ marginRight: 10 }}
                />
                <Button
                  icon={<MuiIcon fontSize="small" icon="check" />}
                  onlyIcon={true}
                  type="secondary"
                  variant="outlined"
                  onClick={() => {
                    mutate({
                      source: "phone",
                      shipping_cost: shippingCost,
                      category: "order"
                    });
                    toggleEditShippingCost();
                  }}
                  size="small"
                  style={{ marginRight: 10 }}
                />
                <Button
                  icon={<MuiIcon fontSize="small" icon="cancel" />}
                  onlyIcon={true}
                  type="secondary"
                  variant="outlined"
                  onClick={toggleEditShippingCost}
                  size="small"
                />
              </div>
            )}

            {!customer.is_tax_exempt ? (
              !editTaxRate ? (
                <CalculatedLabel
                  label="Tax Rate"
                  percentage={true}
                  amount={currentOrder?.custom_tax_percentage}
                >
                  <Button
                    loading={isLoadingEditOrderTaxRate}
                    icon={<MuiIcon fontSize="small" icon="edit" />}
                    onlyIcon
                    disabled={currentOrder.is_trash}
                    onClick={() => {
                      setTaxRate(currentOrder.custom_tax_percentage || 0);
                      toggleEditTaxRate();
                    }}
                  />
                </CalculatedLabel>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between"
                  }}
                >
                  <TextInput
                    name="tax_rate"
                    margin="dense"
                    type="number"
                    value={taxRate}
                    variant="outlined"
                    onChange={e => {
                      const { value } = e.target;
                      if (Number(value) >= 0 && Number(value) <= 99) {
                        setTaxRate(Number.parseFloat(value));
                      }
                    }}
                    style={{ marginRight: 10 }}
                  />
                  <Button
                    icon={<MuiIcon fontSize="small" icon="check" />}
                    onlyIcon={true}
                    type="secondary"
                    variant="outlined"
                    onClick={() => {
                      editOrderTaxRate({
                        has_custom_tax_rate: true,
                        custom_tax_percentage: taxRate
                      });
                      toggleEditTaxRate();
                    }}
                    size="small"
                    style={{ marginRight: 10 }}
                  />
                  <Button
                    icon={<MuiIcon fontSize="small" icon="cancel" />}
                    onlyIcon={true}
                    type="secondary"
                    variant="outlined"
                    onClick={toggleEditTaxRate}
                    size="small"
                  />
                </div>
              )
            ) : (
              <Typography className={classes.taxExempted}>
                Customer is tax exempted
              </Typography>
            )}

            <CalculatedLabel label="tax" amount={currentOrder?.sales_tax || 0} /> */}

            <CalculatedLabel
              label="Net Total"
              amount={currentOrder?.total_amount || 0}
              block={true}
            />
            {/* <CalculatedLabel label="Paid" amount={currentOrder?.paid_amount || 0} />
            <CalculatedLabel
              label={"Amount Due"}
              amount={currentOrder?.due_amount || 0}
              block
            />
            <CalculatedLabel
              label={"Amount Refundable"}
              amount={currentOrder?.return_amount || 0}
            /> */}
          </div>
          {/* <div className={classes.footerSection}>
            <p>
              <b className={classes.amount}>Standing Order</b>
            </p>
            <Select
              loading={isLoading}
              options={options}
              value={isStandingOrder}
              disabled={currentOrder.is_trash}
              onChange={value => {
                setIsStandingOrder(value);
                mutate({
                  source: "website",
                  category: `${isStandingOrder ? "standing" : "order"}`
                });
              }}
            />
            <br />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

// category: order, quote, standing.
//  source:  website, phone, mail.

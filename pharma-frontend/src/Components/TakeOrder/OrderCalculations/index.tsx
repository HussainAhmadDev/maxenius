import * as React from "react";
import Button from "../../Button";
import useStyles from "./orderCalculationStyles";
import MuiIcon from "../../../Components/icons/MuiIcons";
import { OrderData } from "Interfaces/Order";
import TextInput from "Components/Form/TextInput";
import { useEditOrder } from "Hooks/useOrders";
import { CompanyData } from "Interfaces/Company";
import { useBrand } from "Context/BrandContext";

interface Props {
  readonly label: string;
  readonly amount: number;
  readonly percentage?: boolean;
  readonly block?: boolean;
  readonly children?: JSX.Element;
  readonly isMinus?: boolean;
}

const CalculatedLabel: React.FC<Props> = ({
  label,
  amount,
  block,
  percentage,
  children,
  isMinus
}) => {
  const classes = useStyles();
  const { currencySymbol } = useBrand();
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
          {isMinus ? (
            <b className={classes.amount}>
              {percentage
                ? `${amount.toFixed(2)}%`
                : amount === 0
                ? `${currencySymbol}${amount.toFixed(2)}`
                : ` - ${currencySymbol}${amount.toFixed(2)}`}
            </b>
          ) : (
            <b className={classes.amount}>
              {percentage
                ? `${amount.toFixed(2)}%`
                : `${currencySymbol}${amount.toFixed(2)}`}
            </b>
          )}
        </p>
      )}
      {children}
    </div>
  );
};

const OrderSummary: React.FC<{ currentOrder: OrderData; customer?: CompanyData }> = ({
  currentOrder
}) => {
  const classes = useStyles();

  const [editShipping, setEditShipping] = React.useState(false);
  const [shippingCost, setShippingCost] = React.useState(currentOrder.shipping_cost || 0);

  const { mutate } = useEditOrder(currentOrder.id);

  const toggleEditShippingCost = () => {
    setEditShipping(e => !e);
  };

  const totalNet =
    Number(currentOrder?.sub_total || 0) +
    Number(currentOrder?.insurance_fee || 0) +
    Number(currentOrder?.sales_tax || 0) +
    Number(currentOrder?.shipping_cost || 0) -
    Number(currentOrder?.discount_total || 0);

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.subContainer}>
          <div className={classes.content}>
            <CalculatedLabel
              label="Items SubTotal"
              amount={currentOrder?.sub_total || 0}
            />
            {!editShipping ? (
              <CalculatedLabel
                label="Shipping"
                amount={currentOrder?.shipping_cost || 0}
              />
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

            <CalculatedLabel
              label="Vat"
              isMinus={false}
              amount={currentOrder?.sales_tax || 0}
            />

            <CalculatedLabel
              label="Insurrance Fee"
              amount={currentOrder?.insurance_fee || 0}
            />
            <CalculatedLabel
              label="Discount"
              isMinus={true}
              amount={currentOrder?.discount_total || 0}
            />
            <CalculatedLabel label="Net Total" amount={totalNet} block={true} />
            <CalculatedLabel label="Paid" amount={currentOrder?.paid_amount || 0} />
            {currentOrder?.return_amount > 0 && (
              <CalculatedLabel
                label="Returned"
                amount={currentOrder?.return_amount || 0}
              />
            )}

            <CalculatedLabel label={"Amount Due"} amount={0} block />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

import * as React from "react";
import Grid from "@mui/material/Grid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
//interfaces
import { ModalInterface } from "Interfaces/ModalInterface";
import { OrderData } from "Interfaces/Order";
import { AccountType, AddOrderPaymentBody, PaymentType } from "Interfaces/Payment";
import { CreditCardState, ECheckState, OfflineState, PaymentMethod } from "./types";
// components
import Button from "Components/Button";
import MuiIcon from "Components/icons/MuiIcons";
import ModalPopup from "../ModalPopup";
import PaymentAccordion from "./PaymentAccodion";
import PaymentDetails from "./PaymentDetails";
import CreditCard from "./PaymentsSection/CreditCards";
import Offline from "./PaymentsSection/Offline";
import ECheck from "./PaymentsSection/ECheck";
// Images
import authImage from "Assets/images/authorizepng.png";
import creditCardImage from "Assets/images/credit.png";
import offlineImage from "Assets/images/offline.png";
// data
import { initialCardState, initialOfflineState, initialEcheckState } from "./data";
import { createFormReducer } from "Reducers/formReducer";
import { UseMutateFunction } from "react-query";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardBody: {
      width: "100%",
      height: "145px",
      borderRadius: "6px",
      border: `0.5px solid ${theme.palette.gray[300]}`,
      padding: "16px",
      minWidth: "304px"
    },
    heading: {
      fontWeight: "bold",
      fontSize: "14px",
      margin: 0,
      marginBottom: 8
    },
    cardHeading: {
      fontWeight: "bold",
      fontSize: "14px",
      color: `0.5px solid ${theme.palette.gray[500]}`
    },
    cardFooter: {
      justifyContent: "space-between",
      display: "flex",
      color: `0.5px solid ${theme.palette.gray[500]}`
    },
    scrollLeft: {
      position: "absolute",
      left: "-2px",
      top: "68px",
      borderRadius: "50%",
      background: "#fff",
      border: `1px solid ${theme.palette.gray[300]}`,
      cursor: "pointer"
    },
    scrollRight: {
      position: "absolute",
      right: "-2px",
      top: "68px",
      borderRadius: "50%",
      background: "#fff",
      border: `1px solid ${theme.palette.gray[300]}`,
      cursor: "pointer"
    }
  })
);

interface Props extends ModalInterface {
  hasSavedPaymentMethods?: boolean;
  paymentSuccess: boolean;
  order: OrderData;
  addPayment: UseMutateFunction<
    OrderData,
    Error,
    AddOrderPaymentBody & {
      callback?: (() => void) | undefined;
    },
    unknown
  >;
}

const offlineReducer = createFormReducer<OfflineState>(initialOfflineState);
const eCheckReducer = createFormReducer<ECheckState>(initialEcheckState);
const creditCardReducer = createFormReducer<CreditCardState>(initialCardState);

const PaymentModal: React.FC<Props> = ({
  hasSavedPaymentMethods = true,
  paymentSuccess,
  order,
  addPayment,
  ...rest
}) => {
  const classes = useStyles();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [cardState, cardDispatch] = React.useReducer(creditCardReducer, initialCardState);
  const [offlineState, offlineDispatch] = React.useReducer(
    offlineReducer,
    initialOfflineState
  );
  const [checkState, checkDispatch] = React.useReducer(eCheckReducer, initialEcheckState);

  const [requestBody, setRequestBody] = React.useState<AddOrderPaymentBody>();

  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);

  const [activePaymentMethod, setActivePaymentMethod] =
    React.useState<PaymentType>("none");

  const disableSaveButton = (): boolean => {
    if (activePaymentMethod === "sticky") {
      const { exp_date, csc, card_number } = cardState;
      return (
        exp_date.length < 4 ||
        csc.length < 3 ||
        card_number.length < 13 ||
        card_number.length > 16
      );
    }
    if (activePaymentMethod === "offline") {
      const { amount, receipt } = offlineState;
      //@ts-ignore
      return amount <= 0 || !receipt.length;
    }
    if (activePaymentMethod === "echeck") {
      const { name, number, routing, type } = checkState;
      return !type || number.length < 12 || name.length < 3 || routing.length < 12;
    }
    return true;
  };

  const scroll = (offset: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += offset;
  };

  const editPaymentMethod = (paymentMethod: PaymentMethod) => {
    setActivePaymentMethod(paymentMethod?.type);
  };

  const deletePaymentMethod = (index: number) => {
    const newPaymentMethods = [...paymentMethods];
    newPaymentMethods.splice(index, 1);
    setPaymentMethods(newPaymentMethods);
  };

  React.useEffect(() => {
    if (activePaymentMethod === "echeck") {
      const { routing, number, name, type } = checkState;
      setRequestBody({
        type: activePaymentMethod,
        data: {
          routing_number: routing,
          account_number: number,
          account_name: name,
          type: type as AccountType
        }
      });
    } else if (activePaymentMethod === "offline") {
      setRequestBody({
        type: activePaymentMethod,
        data: { receipt: offlineState.receipt, amount: Number(offlineState.amount) }
      });
    } else if (activePaymentMethod === "sticky") {
      const { card_number, exp_date, csc } = cardState;
      setRequestBody({
        type: "credit_card",
        data: { ccv: csc, exp_date, card_number }
      });
    }
  }, [order.due_amount, activePaymentMethod, offlineState, cardState, checkState]);

  React.useEffect(() => {
    if (paymentSuccess) {
      offlineDispatch({ type: "RESET" });
      checkDispatch({ type: "RESET" });
      cardDispatch({ type: "RESET" });
    }
  }, [paymentSuccess]);

  const scrollButtons = Boolean(paymentMethods.length) && (
    <>
      <MuiIcon
        icon="arrowLeft"
        className={classes.scrollLeft}
        onClick={() => scroll(-100)}
      />
      <MuiIcon
        icon="arrowRight"
        className={classes.scrollRight}
        onClick={() => scroll(100)}
      />
    </>
  );

  const savedPaymentMethods = hasSavedPaymentMethods && (
    <Grid item lg={12} md={12} sm={12} xs={12} style={{ position: "relative" }}>
      <Grid
        container
        direction="row"
        spacing={1}
        wrap="nowrap"
        style={{ overflow: "hidden" }}
        ref={scrollRef}
      >
        {paymentMethods?.map((method, index) => (
          <Grid item key={index}>
            <div className={classes.cardBody}>
              <Grid container direction="row">
                <Grid item xs={6} style={{ alignSelf: "center" }}>
                  <img alt="" width="50" src={method?.logo} style={{ height: 37 }} />
                </Grid>
                <Grid container item xs={6} direction="row" justifyContent="flex-end">
                  <Button
                    icon={<MuiIcon icon="edit" />}
                    variant="outlined"
                    type="secondary"
                    size="small"
                    onlyIcon
                    style={{ marginRight: 8 }}
                    onClick={() => editPaymentMethod(method)}
                  />
                  <Button
                    icon={<MuiIcon icon="delete" />}
                    variant="outlined"
                    type="secondary"
                    size="small"
                    onClick={() => deletePaymentMethod(index)}
                    onlyIcon
                  />
                </Grid>
              </Grid>
              <p className={classes.cardHeading}>{method.number}</p>
              <div className={classes.cardFooter}>
                <div>{method.exp}</div>
                <div>Checking</div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      {scrollButtons}
    </Grid>
  );

  return (
    <ModalPopup
      {...rest}
      maxWidth="md"
      modalTitle="Add Payments"
      saveBtnText="Update Payments"
      disableSaveBtn={disableSaveButton() || !(order.due_amount > 0)}
      handleSaveChanges={() => {
        if (requestBody) {
          addPayment(requestBody as AddOrderPaymentBody);
        }
        if (paymentSuccess) {
          setActivePaymentMethod("none");
        }
      }}
    >
      {hasSavedPaymentMethods && false && (
        <p className={classes.heading}>Saved Payment Methods</p>
      )}
      <Grid container justifyContent="center" spacing={2}>
        {savedPaymentMethods}
        <Grid xs={12} item>
          <span className={classes.heading}>New Payment Method</span>
        </Grid>
        <Grid lg={7} md={12} item>
          <>
            {/* <PaymentAccordion
              expanded={activePaymentMethod === "sticky"}
              image={creditCardImage}
              title="Credit Card/ Sticky.io"
              handleAccordion={() => setActivePaymentMethod("sticky")}
            >
              <CreditCard
                amountDue={order.due_amount}
                cardState={cardState}
                dispatch={cardDispatch}
              />
            </PaymentAccordion> */}

            <PaymentAccordion
              expanded={activePaymentMethod === "offline"}
              image={offlineImage}
              title="Online Payment"
              handleAccordion={() => setActivePaymentMethod("offline")}
            >
              <Offline dispatch={offlineDispatch} state={offlineState} />
            </PaymentAccordion>
            {/* <PaymentAccordion
              expanded={activePaymentMethod === "echeck"}
              image={authImage}
              title="Authorize.net Echeck Payments"
              handleAccordion={() => setActivePaymentMethod("echeck")}
            >
              <ECheck
                amountDue={order.due_amount}
                dispatch={checkDispatch}
                state={checkState}
              />
            </PaymentAccordion> */}
          </>
        </Grid>
        <Grid lg={5} md={12} item>
          <PaymentDetails order={order} />
        </Grid>
      </Grid>
    </ModalPopup>
  );
};

export default PaymentModal;

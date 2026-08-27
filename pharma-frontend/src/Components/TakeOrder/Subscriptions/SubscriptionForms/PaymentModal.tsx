import * as React from "react";
import Grid from "@material-ui/core/Grid";
import ModalPopup from "Components/ModalPopup";
import { ModalInterface } from "Interfaces/ModalInterface";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import PaymentAccordion from "Components/Payments/PaymentAccodion";
import { PaymentType } from "Interfaces/Payment";
import creditCardImage from "Assets/images/credit.png";
import offlineImage from "Assets/images/offline.png";
import MaskingInput from "Components/Form/MaskingInput";
import { CreditCardState } from "Components/Payments/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      marginBottom: "0px",
      marginTop: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    },
    buttonDiv: {
      position: "absolute",
      bottom: "0px",
      width: "87%",
      marginBottom: "10px"
    },
    heading: {
      fontWeight: "bold",
      fontSize: "14px",
      margin: 0,
      marginBottom: 8
    },
    root: {
      width: "100%"
    }
  })
);

interface Props extends ModalInterface {
  cardState: CreditCardState;
  activePaymentMethod: PaymentType;
  handleChangePaymentMethod: (method: PaymentType) => void;
  handleInputChange: (name: string, value: string) => void;
}

export const PaymentModal: React.FC<Props> = ({
  cardState,
  handleInputChange,
  activePaymentMethod,
  handleChangePaymentMethod,
  ...props
}) => {
  const classes = useStyles();
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
      return false;
    }
    return true;
  };
  return (
    <ModalPopup
      maxWidth="md"
      modalTitle="Add Payment Method"
      saveBtnText="Confirm"
      disableSaveBtn={disableSaveButton()}
      {...props}
    >
      <Grid container justifyContent="center" spacing={2}>
        <Grid xs={12} item>
          <span className={classes.heading}>New Payment Method</span>
        </Grid>
        <Grid lg={7} md={12} item>
          <>
            <PaymentAccordion
              expanded={activePaymentMethod === "sticky"}
              image={creditCardImage}
              title="Credit Card/ Sticky.io"
              handleAccordion={() => handleChangePaymentMethod("sticky")}
            >
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid lg={12} item>
                    <p className={classes.label}>Card Number</p>
                    <MaskingInput
                      type="text"
                      maskType="card"
                      name="card_number"
                      placeholder="Card Number"
                      value={cardState.card_number}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid lg={6} item>
                    <p className={classes.label}>Expiration</p>
                    <MaskingInput
                      type="text"
                      showMask={true}
                      maskType="expDate"
                      name="exp_date"
                      placeholder="MM / YY"
                      value={cardState.exp_date}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid lg={6} item>
                    <p className={classes.label}>Security Code</p>
                    <MaskingInput
                      type="text"
                      maskType="csc"
                      name="csc"
                      placeholder="CSC"
                      value={cardState.csc}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </div>
            </PaymentAccordion>

            <PaymentAccordion
              expanded={activePaymentMethod === "offline"}
              image={offlineImage}
              title="Offline Payment"
              handleAccordion={() => handleChangePaymentMethod("offline")}
            ></PaymentAccordion>
          </>
        </Grid>
      </Grid>
    </ModalPopup>
  );
};

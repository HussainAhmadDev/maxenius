import {
  Box,
  Button,
  Card,
  CardContent,
  CardOwnProps,
  Grid,
  Skeleton,
  Stack,
  Typography,
  styled
} from "@mui/material";
import React, { useMemo } from "react";
import { getBrandDetails } from "../../../Hooks/api";
import { OrderData } from "../../../Interfaces/Orders";

interface OrderSummaryProps {
  mode: "view" | "full";
  loading: boolean;
  order?: OrderData;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ mode = "full", loading, order }) => {
  const totalNet = useMemo(
    () =>
      Number(order?.sub_total || 0) +
      Number(order?.insurance_fee || 0) +
      Number(order?.sales_tax || 0) +
      Number(order?.shipping_cost || 0) -
      Number(order?.discount_total || 0),
    [order]
  );

  return (
    <StyledCard mode={mode}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={mode === "full" ? 9 : undefined}>
            <Grid container spacing={mode === "full" ? 2 : 1}>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Items SubTotal"
                  loading={loading}
                  amount={order?.sub_total || 0}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Discount"
                  isMinus={true}
                  loading={loading}
                  amount={order?.discount_total || 0}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Insurrance Fee"
                  loading={loading}
                  amount={order?.insurance_fee || 0}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Shipping"
                  loading={loading}
                  amount={order?.shipping_cost || 0}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Vat"
                  isMinus={false}
                  loading={loading}
                  amount={order?.sales_tax || 0}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CalculatedLabel
                  label="Paid"
                  loading={loading}
                  amount={order?.paid_amount || 0}
                />
              </Grid>
              {Boolean(order?.return_amount && order?.return_amount > 0) && (
                <Grid item xs={6} sm={4}>
                  <CalculatedLabel
                    label="Returned"
                    loading={loading}
                    amount={order?.return_amount || 0}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={mode === "full" ? 3 : undefined}>
            <Stack
              width={"100%"}
              sx={{
                flexDirection: mode === "full" ? { xs: "row", md: "column" } : "row"
              }}
              justifyContent={"end"}
              gap={1}
              flexWrap={"wrap"}
            >
              <Button variant="contained" disabled={loading}>
                Net Total:&nbsp;{" "}
                <CalculatedLabel loading={loading} amount={totalNet || 0} />
              </Button>
              <Button variant="contained" color="secondary" disabled={loading}>
                Amount Due:&nbsp; <CalculatedLabel loading={loading} amount={0} />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

interface StyledCard extends CardOwnProps {
  mode: "view" | "full";
}
const StyledCard = styled(Card)((props: StyledCard) => {
  const { mode } = props;
  const styles: {
    boxShadow?: string;
    borderRadius?: string;
    ".MuiCardContent-root"?: {
      paddingLeft?: number;
      paddingRight?: number;
      padding?: string;
    };
  } = {};
  if (mode === "view") {
    styles.borderRadius = "0";
    styles.boxShadow = "unset";
    styles[".MuiCardContent-root"] = {
      paddingLeft: 0,
      paddingRight: 0
    };
  } else {
    styles[".MuiCardContent-root"] = {
      padding: "2rem"
    };
  }
  return {
    ...styles
  };
});
export default OrderSummary;
interface Props {
  readonly label?: string;
  readonly amount: number;
  readonly percentage?: boolean;
  readonly isMinus?: boolean;
  readonly loading?: boolean;
}
const CalculatedLabel: React.FC<Props> = ({
  label,
  amount,
  percentage,
  isMinus,
  loading
}) => {
  const brand = getBrandDetails();
  const currencySymbol = brand?.currency_symbol;
  return (
    <Box>
      {amount === null || amount === undefined ? (
        loading ? (
          <Skeleton width={"100%"} variant="text" />
        ) : (
          <Typography fontWeight={"bold"} variant="body2">
            {amount}
          </Typography>
        )
      ) : loading ? (
        <Skeleton width={"100%"} variant="text" />
      ) : (
        <Typography fontWeight={"bold"} variant="body2">
          {isMinus
            ? percentage
              ? `${amount.toFixed(2)}%`
              : amount === 0
                ? `${currencySymbol} ${amount.toFixed(2)}`
                : ` - ${currencySymbol} ${amount.toFixed(2)}`
            : percentage
              ? `${amount.toFixed(2)}%`
              : `${currencySymbol} ${amount.toFixed(2)}`}
        </Typography>
      )}

      {label &&
        (loading ? (
          <Skeleton width={"100%"} variant="text" />
        ) : (
          <Typography variant="body2">{label} :</Typography>
        ))}
    </Box>
  );
};

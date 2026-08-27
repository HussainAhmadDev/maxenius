import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { OrderData } from "../../../Interfaces/Orders";
import { useMemo } from "react";
import { CompanyData } from "../../../Interfaces/companyType";

interface CustomerInfoProps {
  order?: OrderData;
  loading: boolean;
  selectedCompany?: CompanyData;
}
const CustomerInfo: React.FC<CustomerInfoProps> = ({
  order,
  loading,
  selectedCompany
}) => {
  const billingInformation = useMemo(() => {
    const billAddressInfo = order ? order : selectedCompany?.billing_contact;
    const data = [
      `${billAddressInfo?.billing_address?.first_name} ${billAddressInfo?.billing_address?.last_name}`,
      billAddressInfo?.billing_address?.street1,
      `${billAddressInfo?.billing_address?.city} ${billAddressInfo?.billing_address?.country}`,
      billAddressInfo?.billing_address?.zip,
      billAddressInfo?.billing_address?.email,
      billAddressInfo?.billing_address?.phone
    ];
    return data.map(el => {
      const newEl = el && el?.replace(" ", "") ? el : "---";
      return newEl;
    });
  }, [order, selectedCompany]);
  const shippingInformation = useMemo(() => {
    const shippingAddressInfo = order ? order : selectedCompany?.shipping_contact;

    const data = [
      `${shippingAddressInfo?.shipping_address?.first_name} ${shippingAddressInfo?.shipping_address?.last_name}`,
      shippingAddressInfo?.shipping_address?.street1,
      `${shippingAddressInfo?.shipping_address?.city} ${shippingAddressInfo?.shipping_address?.country}`,
      shippingAddressInfo?.shipping_address?.zip,
      shippingAddressInfo?.shipping_address?.email,
      shippingAddressInfo?.shipping_address?.phone
    ];
    return data.map(el => {
      const newEl = el && el?.replace(" ", "") ? el : "---";
      return newEl;
    });
  }, [order, selectedCompany]);
  return (
    <>
      <Card>
        <CardHeader
          title="Customer"
          titleTypographyProps={{
            fontWeight: "bold",
            fontSize: 20
          }}
        />
        <Divider />
        <CardContent>
          <Stack
            gap={1}
            alignItems={"start"}
            justifyContent={"center"}
            direction={"row"}
            flexWrap={"wrap"}
          >
            <Box flex={1}>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Billing Information
              </Typography>
              {loading
                ? [...Array(6)].map((_, key) => (
                    <Skeleton
                      variant="text"
                      key={key}
                      sx={{ fontSize: 20 }}
                      width={60 + key * 20}
                    />
                  ))
                : billingInformation?.map((item, key) => (
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "14px", lineHeight: "30px" }}
                      key={key}
                    >
                      {item}
                    </Typography>
                  ))}
            </Box>
            <Box flex={1}>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                Shipping Information
              </Typography>
              {loading
                ? [...Array(6)].map((_, key) => (
                    <Skeleton
                      variant="text"
                      key={key}
                      sx={{ fontSize: 20 }}
                      width={60 + key * 20}
                    />
                  ))
                : shippingInformation?.map((item, key) => (
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "14px", lineHeight: "30px" }}
                      key={key}
                    >
                      {item}
                    </Typography>
                  ))}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default CustomerInfo;

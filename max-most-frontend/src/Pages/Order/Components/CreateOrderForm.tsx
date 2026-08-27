import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import SelectField from "../../../Components/SelectField";
import { SelectOption } from "../../../Interfaces/ui";
import { useWebsites } from "../../../Hooks/usePatients";
import { useCompanies } from "../../../Hooks/useCompany";
import { useSearchParams } from "react-router-dom";
import CustomerInfo from "./CustomerInfo";
import { CompanyData } from "../../../Interfaces/companyType";
import { Stack } from "@mui/system";
import PageTitle from "../../../Components/PageTitle";
import {
  useAddCustomer,
  useAddOrderProduct,
  useCreateOrder
} from "../../../Hooks/useOrders";
import { getBrandId } from "../../../Hooks/api";
import { toast } from "react-toastify";
import CreateOrderTable from "./CreateOrderTable";
import SeeDocumentation from "../../../Components/SeeDocumentation";
import LoadingButton from "../../../Components/LoadingButton";
import ConfirmationModal from "../../../Components/ConfirmationModal";

interface Product {
  title: string | null;
  price: number;
  // cost_price: number;
  quantity: number;
  total: number | undefined;
  sub_total_tax: number | undefined;
  value: string;
  orderedProductId?: string;
  vat_percent: number;
}

const CreateOrderForm = () => {
  const [searchParams] = useSearchParams();
  const { data: websitesResponse, isLoading: websitesFetchLoading } = useWebsites();
  const { data: companiesResponse, isLoading: companiesFetchLoading } =
    useCompanies(searchParams);
  const { mutate: AddLineItems } = useAddOrderProduct();
  const { mutateAsync, isLoading: createOrderLoading } = useCreateOrder();

  const companies = useMemo(() => {
    return (
      companiesResponse?.results?.map(company_item => ({
        value: company_item.id,
        label: company_item.name
      })) || []
    );
  }, [companiesResponse]);

  const websites = useMemo(() => {
    return (
      websitesResponse?.results?.map(website_id => ({
        value: website_id.id,
        label: website_id.title
      })) || []
    );
  }, [websitesResponse]);

  const [selectedWebsite, setSelectedWebsite] = useState<SelectOption>({
    label: "",
    value: ""
  });
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | undefined>(
    undefined
  );
  const [rows, setRows] = useState<Product[]>([
    {
      title: "",
      // cost_price: 0,
      price: 0,
      quantity: 1,
      vat_percent: 0,
      total: 0,
      sub_total_tax: 0,
      value: ""
    }
  ]);

  const handelOrderFilter = (event: SelectOption) => {
    const { label, value } = event;
    if (label === "website") {
      setSelectedWebsite({ label, value });
    } else {
      const companyFound = companiesResponse?.results?.find(itm => itm.id === value);
      companyFound && setSelectedCompany(companyFound);
    }
  };

  const addLineItemsForAllRows = useCallback(async () => {
    for (const row of rows) {
      const addLineItems = {
        product_id: row.value,
        quantity: row.quantity.toString(),
        unit_price: row.price.toString(),
        // cost_price: row.cost_price.toString(),
        vat_percent: row.vat_percent.toString(),
        total_cost: row.total?.toString(),
        sub_total_tax: row.sub_total_tax?.toString()
      };
      if (addLineItems.product_id) {
        try {
          await AddLineItems(addLineItems);
        } catch (error) {
          console.error("Error adding line items:", error);
          toast.error("Failed to add line items.");
        }
      }
    }

    setSelectedWebsite({ label: "Select...", value: "" });
    setRows([
      {
        title: "",
        price: 1,
        quantity: 1,
        // cost_price: 0,
        vat_percent: 0,
        total: 1,
        sub_total_tax: 1,
        value: ""
      }
    ]);
    setSelectedCompany(undefined);
  }, [rows, AddLineItems]);

  const createOrderHandler = async () => {
    const activeBrand = getBrandId();
    const obj = {
      brand_id: activeBrand.brand_id,
      contact_id: selectedCompany?.billing_contact_id ?? "",
      company_id: selectedCompany?.id ?? "",
      website_id: selectedWebsite?.value
    };

    const { contact_id, company_id, website_id } = obj;
    if (!contact_id || !company_id || !website_id) {
      const missingFields = [];
      if (!contact_id) missingFields.push("contact ID");
      if (!company_id) missingFields.push("company ID");
      if (!website_id) missingFields.push("website ID");
      toast.error(`Following fields are required: ${missingFields.join(", ")}`);
      return;
    }

    try {
      await mutateAsync(obj);
      addLineItemsForAllRows();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    }
  };

  const { mutate } = useAddCustomer();
  const brand = getBrandId();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  return (
    <>
      <PageTitle
        icon="/assets/icons/create-order-icon.svg"
        title="Create Order"
        endComponent={
          <Button
            disabled={createOrderLoading}
            onClick={createOrderHandler}
            size="medium"
            variant="contained"
            id="cy__PlaceOrderbtn"
          >
            Place Order
          </Button>
        }
      />
      <SeeDocumentation fileName={"useCreateOrder"} title={"See Documentation"} />

      <Card>
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <Close />
        </IconButton>
        <CardContent>
          <Stack gap={2}>
            <SelectField
              handleSelect={opt =>
                handelOrderFilter({
                  label: "website",
                  value: opt?.value || ""
                })
              }
              value={selectedWebsite.value}
              loading={websitesFetchLoading}
              label="Website :"
              name="website_id"
              options={websites}
              id="cy__CreateOrderWebsite"
            />

            <SelectField
              handleSelect={opt =>
                handelOrderFilter({
                  label: "Customer",
                  value: opt?.value || ""
                })
              }
              value={selectedCompany?.id}
              loading={companiesFetchLoading}
              label="Customer :"
              name="company_id"
              options={companies}
              id="cy__CreateOrderCustomer"
            />
          </Stack>
        </CardContent>
        <Dialog
          open={open}
          onClose={() => onClose()}
          fullWidth
          maxWidth="xs"
          aria-describedby="alert-dialog-slide-description"
        >
          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <DialogTitle variant="h6" fontWeight={"bold"}>
            Create new customer
          </DialogTitle>
          <DialogContent>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"start"}
              gap={1}
            >
              <Typography fontSize={16} color={"black"} fontWeight={"normal"}>
                This will create a customer with the customer number only. You'll have to
                add the rest of the customer information after creation.
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between" }}>
            <Button color="secondary" variant="contained" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              onClick={() => mutate({ brand_id: brand.brand_id })}
              id="cy__ProcessBtn"
            >
              Process
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <ConfirmationModal open={false} onClose={onClose} />
        <Box p={1}>
          <Button
            size="medium"
            variant="contained"
            id="cy__addNewCustomer"
            onClick={() => setOpen(true)}
          >
            Add Customer
          </Button>
        </Box>
      </Card>
      {selectedCompany?.id && (
        <CustomerInfo loading={companiesFetchLoading} selectedCompany={selectedCompany} />
      )}
      <CreateOrderTable rows={rows} setRows={setRows} />
    </>
  );
};

export default CreateOrderForm;

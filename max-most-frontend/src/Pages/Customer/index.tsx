import {
  Stack,
  TextField,
  Button,
  Typography,
  Switch,
  Box,
  Grid,
  IconButton,
  CardContent
} from "@mui/material";
import { useCustomerByID } from "../../Hooks/useOrders";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import AddPopupNotesModal from "../Order/Components/AddPopupNotesModal";
import { useContactList, useTrashContactByID } from "../../Hooks/useContact";
import { DeleteForever } from "@mui/icons-material";
import LoadingButton from "../../Components/LoadingButton";
import { useUpdateCustomer } from "../../Hooks/useCompany";
import { getBrandId } from "../../Hooks/api";

const EditCustomer = () => {
  const { id } = useParams();
  const { data } = useCustomerByID(id as string);
  const { data: contactsList } = useContactList(id as string);
  const [name, setName] = useState<string>("");
  const [isIndividual, setIsIndividual] = useState<boolean>(false);
  const [isTaxExempt, setIsTaxExempt] = useState<boolean>(false);
  const [taxExemptID, setTaxExemptID] = useState<string>("");

  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const { mutate: deleteCompanyAddress, isLoading: isDeletingAddress } =
    useTrashContactByID(id);
  const { mutate: updateCustomer } = useUpdateCustomer(id ?? null);

  // Populate form fields with customer data
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setIsIndividual(data.is_individual || false);
      setIsTaxExempt(data.is_tax_exempt || false);
      setTaxExemptID(data.tax_exempt_id || "");
    }
  }, [data]);
  const acitveBrand = getBrandId();
  // Save customer handler
  const handleSaveCustomer = () => {
    const updatedCustomer = {
      name,
      is_individual: isIndividual,
      is_tax_exempt: isTaxExempt,
      tax_exempt_id: taxExemptID,
      brand_id: acitveBrand.brand_id
    };

    updateCustomer(updatedCustomer);
  };

  return (
    <Stack gap={4} bgcolor={"white"} p={2}>
      {/* Navigation */}
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="subtitle2"
          color="primary"
          onClick={() => navigate("/create-order")}
        >
          ← Customers
        </Typography>
        <LoadingButton variant="contained" onClick={handleSaveCustomer}>
          Save Customer
        </LoadingButton>
      </CardContent>

      {/* Basic Information Section */}
      <Stack spacing={3}>
        <Typography variant="h6">Basic Information</Typography>

        <TextField
          label="Customer Number"
          variant="outlined"
          disabled
          value={data?.number}
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
        />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={toggleModal}
            >
              Add Popup Notes
            </Button>
          </Grid>
        </Grid>
      </Stack>
      {/* Contacts Section */}
      <Stack spacing={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">Contacts</Typography>
          </Grid>
          <Grid item>
            <Button
              onClick={() => navigate(`/edit-customer/${data?.id}/contact`)}
              variant="outlined"
              sx={{ borderRadius: "8px", padding: "6px 16px" }}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {contactsList?.results?.length ? (
          contactsList?.results.map(contactItem => (
            <Box
              key={contactItem.id}
              sx={{
                backgroundColor: "#f9f9f9",
                padding: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)"
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                  {contactItem.contact.billing_address.first_name +
                    " " +
                    contactItem?.contact.billing_address.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {contactItem.contact.billing_address.street1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {contactItem.contact.billing_address.city},{" "}
                  {contactItem.contact.billing_address.state},{" "}
                  {contactItem.contact.billing_address.zip}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {contactItem.contact.billing_address.country}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  color="error"
                  disabled={isDeletingAddress}
                  onClick={() => deleteCompanyAddress({ contactID: contactItem.id })}
                >
                  <DeleteForever sx={{ color: "error.main" }} />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No Contact
            </Typography>
          </Box>
        )}
      </Stack>
      {/* Tax Exemption Section */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Tax Exemption ID</Typography>
          <TextField
            label="Tax Exemption ID"
            variant="outlined"
            value={taxExemptID}
            onChange={e => setTaxExemptID(e.target.value)}
            disabled={!isTaxExempt}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Switch
            checked={isTaxExempt}
            onChange={e => setIsTaxExempt(e.target.checked)}
          />
        </Grid>
      </Grid>
      {isModalOpen && <AddPopupNotesModal open={isModalOpen} onClose={toggleModal} />}
    </Stack>
  );
};

export default EditCustomer;

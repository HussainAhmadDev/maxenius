import React, { useMemo, useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { Close } from "@mui/icons-material";

import SelectField from "../../../Components/SelectField";

import { SelectOption } from "../../../Interfaces/ui";
import { useWebsites } from "../../../Hooks/usePatients";
import { useCompanies } from "../../../Hooks/useCompany";
import { useSearchParams } from "react-router-dom";

interface IProps {
  open: boolean;
  onClose(): void;
}
const CreateOrderModal: React.FC<IProps> = ({
  onClose,

  open
}) => {
  const [searchParams] = useSearchParams();

  const { data: websitesResponse, isLoading: websitesFetchLoading } = useWebsites();
  const { data: companiesResponse, isLoading: companiesFetchLoading } =
    useCompanies(searchParams);

  const companies = useMemo(() => {
    const data: SelectOption[] = [];
    if (companiesResponse?.results?.length) {
      companiesResponse?.results?.forEach(company_item => {
        data.push({
          value: company_item.id,
          label: company_item.name
        });
      });
    }
    return data;
  }, [companiesResponse]);

  const websites = useMemo(() => {
    const data: SelectOption[] = [];
    if (websitesResponse?.results?.length) {
      websitesResponse?.results?.forEach(website_id => {
        data.push({
          value: website_id.id,
          label: website_id.title
        });
      });
    }
    return data;
  }, [websitesResponse]);

  const [selectedWebsite, setSelectedWebsite] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  const [selectedCompany, setSelectedCompany] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  const handelOrderFilter = (event: { label: string; value: string | null }) => {
    if (event) {
      const { label, value } = event;
      if (label === "website") {
        value && setSelectedWebsite({ label: label, value: value });
      } else {
        value && setSelectedCompany({ label: label, value: value });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Create Order
        </Typography>{" "}
      </DialogTitle>
      <IconButton
        id="cy__ReturnClosebtn"
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
      <DialogContent dividers>
        <SelectField
          handleSelect={opt => {
            handelOrderFilter({
              label: "website",
              value: opt?.value === "" ? "" : opt.value
            });
          }}
          value={selectedWebsite.value}
          loading={websitesFetchLoading}
          label="Website :"
          name="website_id"
          options={websites}
        />

        <SelectField
          handleSelect={opt => {
            handelOrderFilter({
              label: "company",
              value: opt?.value === "" ? "" : opt.value
            });
          }}
          value={selectedCompany.value}
          loading={companiesFetchLoading}
          label="Company :"
          name="company_id"
          options={companies}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" onClick={onClose}>
          Close
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal;

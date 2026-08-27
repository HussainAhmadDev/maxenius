import { Stack } from "@mui/material";
import PagesSettings from "./Components/pagesSettings";
import VendorSettings from "./Components/vendorSettings";
import PageTitle from "../../../Components/PageTitle";

const BrandSettings = () => {
  return (
    <Stack gap={2}>
      <PageTitle title="Brand Settings" icon="/assets/icons/brand-settings-icon.svg" />
      <PagesSettings />
      <VendorSettings />
    </Stack>
  );
};

export default BrandSettings;

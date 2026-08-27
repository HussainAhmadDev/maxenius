import { Stack } from "@mui/material";
import BrandForm from "./brandForm";
import PageTitle from "../../../../Components/PageTitle";
import { useParams } from "react-router-dom";

const AddEditBrand = () => {
  const { id } = useParams();
  return (
    <Stack gap={2}>
      <PageTitle
        title={`${id ? "Edit" : "Add"} Brand`}
        icon="/assets/icons/brands-icon.svg"
      />
      <BrandForm />
    </Stack>
  );
};

export default AddEditBrand;

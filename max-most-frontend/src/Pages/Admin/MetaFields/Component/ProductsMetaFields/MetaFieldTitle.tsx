import React from "react";
import { Button } from "@mui/material";
import PageTitle from "../../../../../Components/PageTitle";
import { Link } from "react-router-dom";

const MetaFieldTitle: React.FC = () => {
  return (
    <>
      <PageTitle
        icon="/assets/icons/productIcon.svg"
        title="Product Meta Fields"
        endComponent={
          <Link to={"/admin/meta-fields/products/create"}>
            <Button size="medium" variant="contained" id="cy__CreateProductMetaFieldsBtn">
              Create Product Meta Fields
            </Button>
          </Link>
        }
      />
    </>
  );
};

export default MetaFieldTitle;

import { useState } from "react";

import ProductExpiryFilter from "./Components/ProductExpiryFilter";

import { Stack } from "@mui/material";

import { ProductExpiryResponse } from "../../Interfaces/productExpiryType";
import ProductExpiryTable from "./Components/ProductExpiryTable";

function ProductExpiry() {
  const [expiryData, setExpiryData] = useState<ProductExpiryResponse | undefined>();
  const [isLoading, setIsloading] = useState<boolean>(false);

  return (
    <>
      <Stack gap={2}>
        <ProductExpiryFilter setExpiryData={setExpiryData} setIsloading={setIsloading} />
        <ProductExpiryTable productExpiry={expiryData} isLoading={isLoading} />
      </Stack>
    </>
  );
}
export default ProductExpiry;

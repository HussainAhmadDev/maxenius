import * as React from "react";
import VendorFilters from "Components/Admin/Vendors/VendorFilters";
import VendorsTable from "Components/Admin/Vendors/VendorsTable";
import { useDebounce } from "Hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useVendors } from "Hooks/useVendors";

const VendorTrash: React.FC = () => {
  const [searchParams] = useSearchParams();

  const debouncedParams = useDebounce(searchParams, 800);
  const { data: vendors, isLoading } = useVendors(debouncedParams);
  return (
    <div>
      <VendorFilters />
      <br />
      <VendorsTable isLoading={isLoading} vendors={vendors} />
    </div>
  );
};

export default VendorTrash;

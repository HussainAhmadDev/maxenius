import { Button, Stack } from "@mui/material";
import PageTitle from "../../../Components/PageTitle";
import { Link, useSearchParams } from "react-router-dom";
import { useBrands } from "../../../Hooks/useBrand";
import BrandsTable from "./Components/brandsTable";
import { useDebounce } from "../../../Hooks/useDebounce";
import { useState } from "react";
import { BrandData } from "@interfaces/brandType";
import RestoreBrandsTable from "./Components/RestoreBrandsTable";

interface BrandsFiltersProps {
  isTrash?: boolean;
}

const Brands: React.FC<BrandsFiltersProps> = ({ isTrash }) => {
  const [params] = useSearchParams();
  const searchParams = useDebounce(params, 700);
  const { data: brands, isLoading } = useBrands(searchParams, isTrash);

  const [action, setAction] = useState<{
    type: "del" | "view" | "restore" | null;
    row: BrandData | null;
  }>({ row: null, type: null });

  const handleClear = () => setAction({ row: null, type: null });

  return (
    <Stack gap={2}>
      {!isTrash && (
        <PageTitle
          title="Brands"
          icon="/assets/icons/brands-icon.svg"
          endComponent={
            <Link to={"/admin/add-brand"}>
              <Button variant="contained" size="medium">
                Add Brand
              </Button>
            </Link>
          }
        />
      )}

      <BrandsTable
        brands={brands}
        loading={isLoading}
        isTrash={isTrash}
        setAction={setAction}
      />
      <RestoreBrandsTable
        onClose={handleClear}
        open={action.type === "restore"}
        row={action?.row}
      />
    </Stack>
  );
};

export default Brands;

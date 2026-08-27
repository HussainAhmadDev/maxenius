import * as React from "react";
import OrdersFilters from "./OrdersFilters";
import HistoryTble from "Components/Orders/HistoryPetientTable";
import { useDebounce } from "Hooks/useDebounce";
import { useParams, useSearchParams } from "react-router-dom";
import { usePatientHistory, useSingleWebsite } from "Hooks/usePatients";

const CustomersOrders: React.FC<{ customerNumber?: string }> = ({ customerNumber }) => {
  const [searchParams] = useSearchParams();
  const debouncedParams = useDebounce(searchParams, 800);

  const { id } = useParams<string>();

  const { website_id } = useParams<string>();

  const { data } = useSingleWebsite(website_id as string);

  const site_url = data?.site_url || "";
  const authorization_key = data?.authorization_key || "";

  const {
    data: patientHistory,
    isLoading,
    refetch
  } = usePatientHistory(
    `${site_url}/wp-json/inventory/v1/patient_purchased_products?id=${id}`,
    authorization_key,
    debouncedParams
  );
  React.useEffect(() => {
    refetch();
    //eslint-disable-next-line
  }, [site_url, authorization_key]);
  return (
    <div>
      <OrdersFilters />
      <HistoryTble isLoading={isLoading} history={patientHistory} />
    </div>
  );
};

export default CustomersOrders;

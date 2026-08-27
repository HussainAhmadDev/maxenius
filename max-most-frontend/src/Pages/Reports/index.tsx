import PageTitle from "../../Components/PageTitle";
// import All from "./Components/all";
import Overview from "./Components/overview";
import Products from "./Components/product";
import Cutomers from "./Components/customer";
import BatchDetails from "./Components/batchDetails";
import Tabs from "../../Components/Tabs";
import SeeDocumentation from "../../Components/SeeDocumentation";
const tabs = [
  // {
  //   title: "All",
  //   comp: <All />
  // },
  {
    title: "Overview",
    comp: <Overview />
  },
  {
    title: "Products",
    comp: <Products />
  },
  {
    title: "Customers",
    comp: <Cutomers />
  },
  {
    title: "Batch Details",
    comp: <BatchDetails />
  }
];
function Reports() {
  return (
    <>
      <PageTitle icon="/assets/icons/reportIcon.svg" title="Reports" />

      <Tabs list={tabs} hasOwnPanel={["Products", "Overview"]} urlBase />
      <SeeDocumentation
        title="See Report Generation Documentation"
        fileName={"useCreateCustomerReport"}
      />
    </>
  );
}

export default Reports;

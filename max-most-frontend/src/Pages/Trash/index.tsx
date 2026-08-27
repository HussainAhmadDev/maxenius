import PageTitle from "../../Components/PageTitle";
import Tabs from "../../Components/Tabs";
import Orders from "../Order";
import PurchaseOrders from "../PurchaseOrder";
import Product from "../Product";
import Vendors from "../Admin/Vendors";
import WareHouse from "../Admin/WareHouse";
import Users from "../Admin/Users";
import Quotes from "../Admin/Quotations";
import Websites from "../Admin/Websites";
// import FridgeList from "../Fridges/Components/FridgesList";
import FridgeLog from "../Fridges/Components/FridgesLog";
import Brands from "../Admin/Brands";
import Fridges from "../Admin/FridgesLists";
import ActiveProducts from "../ActiveProducts";

const tabs = [
  {
    title: "Orders",
    comp: <Orders isTrash />
  },
  {
    title: "Purchase Orders",
    comp: <PurchaseOrders isTrash />
  },
  {
    title: "Products",
    comp: <Product isTrash />
  },
  {
    title: "Products Activity Log",
    comp: <ActiveProducts isTrash />
  },
  {
    title: "Vendors",
    comp: <Vendors isTrash />
  },
  {
    title: "Warehouses",
    comp: <WareHouse isTrash />
  },
  {
    title: "Users",
    comp: <Users isTrash />
  },
  {
    title: "Quotes",
    comp: <Quotes isTrash />
  },
  { title: "Websites", comp: <Websites isTrash /> },
  { title: "Fridges", comp: <Fridges isTrash /> },
  { title: "Temperature Log", comp: <FridgeLog isTrash /> },
  { title: "Brands", comp: <Brands isTrash /> }
];
function Trash() {
  return (
    <>
      <PageTitle icon="/assets/delete-icon.svg" title="Trash" />
      <Tabs list={tabs} hasOwnPanel={tabs.map(item => item.title)} urlBase />
    </>
  );
}
export default Trash;

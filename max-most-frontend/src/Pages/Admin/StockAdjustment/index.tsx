import { Box } from "@mui/material";
import PageTitle from "../../../Components/PageTitle";
import Tabs from "../../../Components/Tabs";
import IncreaseStock from "./Components/increaseStock";
import DecreaseStock from "./Components/decreaseStock";
import StockHistory from "./Components/stockHistory";
import { Add, Remove } from "@mui/icons-material";
function Stock() {
  return (
    <>
      <PageTitle icon="/assets/icons/StockAdjustment.svg" title="Stock Adjustment" />
      <Box>
        <Tabs
          list={[
            {
              title: "INCREASE STOCK",
              comp: <IncreaseStock />,
              icon: <Add />,
              iconPosition: "start",
              id: "cy__IncreaseStock"
            },
            {
              title: "DECREASE STOCK",
              comp: <DecreaseStock />,
              icon: <Remove />,
              iconPosition: "start",
              id: "cy__DecreaseStock"
            },
            {
              title: "HISTORY",
              comp: <StockHistory />,
              id: "cy__StockHistory"
            }
          ]}
          hasOwnPanel={["INCREASE STOCK", "DECREASE STOCK"]}
          dense
          urlBase
        />
      </Box>
    </>
  );
}

export default Stock;

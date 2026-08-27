import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Layout from "Components/layout";
import { NavBar } from "Components/Navbar";
import IncreaseStock from "./IncreaseStock";
import DecreaseStock from "./DecreaseStock";
import MuiIcon from "Components/icons/MuiIcons";
import StockHistory from "./stockHistory";

const StockAdjustment: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout title="Stock Adjustment">
      <NavBar pageTitle="Stock Adjustment"></NavBar>
      <div style={{ padding: 30 }}>
        <Tabs
          indicatorColor="secondary"
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: `${value === 0 ? 700 : 400}`
                }}
              >
                <MuiIcon icon="add" />
                Increase Stock
              </div>
            }
          />
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: `${value === 1 ? 700 : 400}`
                }}
              >
                <MuiIcon icon="minus" />
                Decrease Stock
              </div>
            }
          />
          <Tab label={"History"} />
        </Tabs>

        {value === 0 && <IncreaseStock />}
        {value === 1 && <DecreaseStock />}
        {value === 2 && <StockHistory />}
      </div>
    </Layout>
  );
};

export default StockAdjustment;

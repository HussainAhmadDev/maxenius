import DashboardCard from "./card";
import { Grid, Skeleton, Stack } from "@mui/material";
import { dashboardCards } from "../../Constants";
import TopSellingProducts from "./TopSellingProducts";
import WebsitesModal from "./WebsitesModal";
import { useMemo, useState } from "react";
import PageTitle from "../../Components/PageTitle";
import { useBrandContext } from "../../Contexts/brandContext";
import { BrandSetting } from "../../Interfaces/brandType";
import NearExpiry from "./NearExpiry";
import OutOfStockProducts from "./OutOfStockProducts";
import LowStockProducts from "./LowStockProducts";

const Dashboard: React.FC = () => {
  const [openWebsModal, setOpenWebsModal] = useState(false);
  const handleOpen = () => setOpenWebsModal(true);
  const handleClose = () => setOpenWebsModal(false);
  const { brand, brandLoading } = useBrandContext();

  const data = useMemo(() => {
    if (brand?.brandSettings) {
      return dashboardCards.filter(
        el =>
          brand?.brandSettings &&
          brand?.brandSettings[el.key as keyof BrandSetting] === true
      );
    } else {
      return [];
    }
  }, [brand]);

  return (
    <>
      <PageTitle icon="/assets/icons/dashboard.svg" title="Dashboard" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={12}>
          <Grid container spacing={2}>
            {brandLoading
              ? [...Array(4)].map((_, key) => (
                  <Grid xs={12} sm={12} lg={6} item key={key}>
                    <Stack
                      direction={"row"}
                      alignItems={"start"}
                      maxHeight={"150px"}
                      overflow={"hidden"}
                    >
                      <Skeleton
                        height={240}
                        sx={{ mt: "-50px" }}
                        width={"100%"}
                        animation="wave"
                      />
                    </Stack>
                  </Grid>
                ))
              : data?.map((item, key) => (
                  <Grid xs={12} sm={12} lg={6} item key={key}>
                    <DashboardCard item={item} openModal={handleOpen} />
                  </Grid>
                ))}
            <Grid item xs={12} sm={12} lg={6}>
              <TopSellingProducts />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <NearExpiry />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <LowStockProducts />
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <OutOfStockProducts />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={4}>
          <TopSellingProducts />
        </Grid> */}
      </Grid>
      <WebsitesModal onClose={handleClose} open={openWebsModal} />
    </>
  );
};
export default Dashboard;

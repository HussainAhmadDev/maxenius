import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { useTopSellingProducts } from "../../Hooks/useProducts";
import Product from "./Product";
import { getBrandId } from "../../Hooks/api";

const TopSellingProducts = () => {
  const brand = getBrandId();
  const { data: products, isLoading } = useTopSellingProducts(brand?.brand_id);
  const [visibleProductsCount, setVisibleProductsCount] = useState(4);

  const handleLoadMore = () => {
    setVisibleProductsCount(prevCount => prevCount + 4);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Box
            component={"img"}
            src="/assets/icons/ToptListIcon.svg"
            width={30}
            alt="check"
          />
        }
        title={
          <Typography variant="h4" fontWeight={"600"}>
            Top Selling Products
          </Typography>
        }
      />
      {!isLoading ? (
        <CardContent
          sx={{
            p: "0 !important",
            height: `${
              products?.results?.length && products?.results?.length < 3 ? "30" : "66vh"
            }`,
            overflowY: "auto",
            display: products?.results?.length ? "block" : "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {!products?.results?.length && "No Data Found"}
          {products?.results?.slice(0, visibleProductsCount).map((product, key, arr) => (
            <React.Fragment key={key}>
              <Product product={product} />
              {arr?.length - 1 !== key && <Divider />}
            </React.Fragment>
          ))}
          {!!products?.results?.length &&
            visibleProductsCount < products?.results?.length && (
              <CardActions
                sx={{
                  width: "100%",
                  position: "sticky",
                  bottom: "0",
                  bgcolor: "white"
                }}
              >
                <Button
                  id="cy__LoadMorebtn"
                  onClick={handleLoadMore}
                  size="large"
                  startIcon={
                    <ArrowBack sx={{ color: "primary.main", rotate: "180deg" }} />
                  }
                  fullWidth
                >
                  Load More
                </Button>
              </CardActions>
            )}
        </CardContent>
      ) : (
        <Stack gap={1} px={1}>
          {[...Array(4)].map((_, index) => (
            <React.Fragment key={index}>
              <Skeleton variant="rounded" width="100%" height={95} animation="wave" />
            </React.Fragment>
          ))}
        </Stack>
      )}
    </Card>
  );
};

export default TopSellingProducts;

import Card from "@mui/material/Card";
import { Box, styled } from "@mui/system";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ListItemButton, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { TopSellingProduct } from "../../Interfaces/Products";
import { getBrandDetails } from "../../Hooks/api";
import { useNavigate } from "react-router-dom";

const CustomCard = styled(Card)({
  borderRadius: "0",
  boxShadow: "none"
});

interface IProps {
  product: TopSellingProduct;
}

const Product: React.FC<IProps> = ({ product }) => {
  const brand = getBrandDetails();
  const navigate = useNavigate();
  return (
    <ListItemButton
      sx={{ p: 0 }}
      onClick={() => navigate(`/edit-product/${product?.product_id}`)}
    >
      <Link className="no-underline" to={"/products"} style={{ width: "100%" }}>
        <CustomCard>
          <CardContent>
            <Stack direction={"row"} gap={1}>
              <Stack gap={1}>
                <Typography>{product?.product_sku}</Typography>
                <Typography variant="h5" color="text.secondary">
                  {product?.product_name}
                </Typography>

                <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"}>
                  <Typography
                    sx={{
                      color: "#585CE4"
                    }}
                  >
                    {brand?.currency_symbol}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#585CE4"
                    }}
                  >
                    {product?.sale_amount}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </CustomCard>
      </Link>
    </ListItemButton>
  );
};
export default Product;

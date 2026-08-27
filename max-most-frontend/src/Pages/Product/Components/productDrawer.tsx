import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Close, DeleteForever, ModeEdit } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSingleProduct } from "../../../Hooks/useProducts";
import { ProductData } from "../../../Interfaces/Products";
import { getBrandDetails } from "../../../Hooks/api";
import Chip from "@mui/material/Chip";
import { useUser } from "../../../Contexts/userContext";

interface ProductDrawerProps {
  open: boolean;
  onClose(): void;
  row?: ProductData | null;
  onDelete(): void;
  isTrash?: boolean;
}
const ProductDrawer: React.FC<ProductDrawerProps> = props => {
  const { onClose, open, row, onDelete, isTrash } = props;

  const { user } = useUser();
  const navigate = useNavigate();
  const brand = getBrandDetails();
  const currency = brand?.currency_symbol;
  const { data, isLoading: fetchLoading } = useSingleProduct(
    open && row?.id ? row?.id : undefined
  );

  const handleEdit = () => {
    if (row?.id) {
      navigate(`/edit-product/${row?.id}`);
    }
  };
  return (
    <StyledDrawer anchor="right" open={open} onClose={() => !fetchLoading && onClose()}>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
        disabled={fetchLoading}
      >
        <Close />
      </IconButton>
      <Stack direction={"row"} gap={1} alignItems={"center"} justifyContent={"start"}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 30 }} width={150} />
        ) : (
          <Typography fontSize={20} fontWeight={"bold"} variant="h3">
            {data?.name}
          </Typography>
        )}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack
        direction={"row"}
        gap={1}
        alignItems={"center"}
        justifyContent={"start"}
        my={1}
      >
        <Button
          startIcon={<ModeEdit />}
          variant="contained"
          color="info"
          size="small"
          onClick={handleEdit}
          disabled={fetchLoading}
        >
          Edit Product
        </Button>
        {isTrash ? (
          <Chip label="Trashed" color="error" sx={{ ml: 1 }} />
        ) : (
          user?.is_superuser && (
            <Button
              startIcon={<DeleteForever />}
              variant="contained"
              color="info"
              size="small"
              onClick={onDelete}
              disabled={fetchLoading}
            >
              Trash
            </Button>
          )
        )}
      </Stack>
      <Box>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Product :{" "}
          </Typography>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Product Number :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.sku}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Bar code :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.sku}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Product Name :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.name}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Box mt={1}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Description :{" "}
          </Typography>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1}>{data?.description || "---"}</Typography>
        )}
      </Box>
      <Box mt={1}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Warning Message :{" "}
          </Typography>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1}>{data?.warning_message || "---"}</Typography>
        )}
      </Box>
      <Box mt={1}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Pricing :{" "}
          </Typography>
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Retail Price ({currency}) :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.retail_price || 0}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Cost Price ({currency}) :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.cost_price || 0}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            // <Typography variant="body2">Shipping Price ({currency}) :</Typography>
            <></>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            // <Typography variant="body2" fontWeight={"bold"}>
            //   {data?.shipping_rate || 0}
            // </Typography>
            <></>
          )}
        </Grid>{" "}
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Quantity Per Pack ({currency}) :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.quantity_per_pack || 0}
            </Typography>
          )}
        </Grid>
      </Grid>
    </StyledDrawer>
  );
};

const StyledDrawer = styled(Drawer)(({
  theme: {
    shape: { borderRadius }
  }
}) => {
  const spaceFromTop = 67;
  return {
    ".MuiDrawer-paper": {
      marginTop: spaceFromTop,
      height: `calc(100% - ${spaceFromTop}px)`,
      width: "100%",
      maxWidth: "500px",
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      boxShadow: "0px 4px 29.3px 0px #0000001A",
      padding: "18px"
    }
  };
});
export default ProductDrawer;

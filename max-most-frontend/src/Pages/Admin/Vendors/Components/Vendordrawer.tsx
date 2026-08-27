import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Close, DeleteForever, ModeEdit } from "@mui/icons-material";
import {
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Skeleton,
  Stack,
  styled
} from "@mui/material";
import { ukDateFormat } from "../../../../Utils/datesFormat";
import { useNavigate } from "react-router-dom";
import { Vendor } from "../../../../Interfaces/vendorsType";
import { useVendorById } from "../../../../Hooks/useVendors";
import Chip from "@mui/material/Chip";
interface VendorDrawerProps {
  open: boolean;
  onClose(): void;
  row?: Vendor;
  onDelete(): void;
  isTrash?: boolean;
}
const VendorDrawer: React.FC<VendorDrawerProps> = props => {
  const { onClose, open, row, onDelete, isTrash } = props;
  const navigate = useNavigate();
  const { data, isLoading: fetchLoading } = useVendorById(
    open && row?.id ? row?.id : undefined
  );
  const handleEdit = () => {
    if (row?.id) {
      navigate(`/admin/edit-vendor/${row?.id}`);
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
        <Typography fontSize={20} fontWeight={"bold"} variant="h3">
          Vendor :
        </Typography>
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
          id="cy__EditVendor"
        >
          Edit Vendor
        </Button>
        {isTrash ? (
          <Chip
            label="Trashed"
            sx={{ backgroundColor: "red", color: "white", marginLeft: 1 }}
          />
        ) : (
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
        )}
      </Stack>
      <Stack justifyContent={"space-between"} direction={"row"}>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
        ) : (
          <Typography mt={1} fontWeight={"bold"} fontSize={18}>
            Basic Information :{" "}
          </Typography>
        )}
        <FormControlLabel control={<Radio />} checked label="Inactive" />
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Name :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Contact Name :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.contact_name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Date Created :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {!!data?.created && ukDateFormat(new Date(data?.created), true)}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Date Updated :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {!!data?.updated && data?.updated?.toString()?.toLowerCase() === "none"
                ? "---"
                : !!data?.updated && ukDateFormat(new Date(data.updated), true)}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Contact Telephone :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.contact_phone}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Secondary Telephone :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.secondary_phone}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Fax :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.fax}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Email :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.email}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Webpage :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.webpage}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Currency :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.currency}
            </Typography>
          )}
        </Grid>
      </Grid>
      {fetchLoading ? (
        <Skeleton variant="text" sx={{ fontSize: 25 }} width={150} />
      ) : (
        <Typography mt={1} fontWeight={"bold"} fontSize={18}>
          Address :
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <Stack width={"100%"} gap={fetchLoading ? 0 : 0.5}>
        {fetchLoading
          ? [...Array(3)].map((_, key) => (
              <Skeleton
                key={key}
                variant="text"
                width={50 + (key + 1) * 50}
                height={20}
              />
            ))
          : [
              data?.address,
              data?.alternative_address,
              `${data?.country || ""}${data?.region ? `, ${data?.region}` : ""}${
                data?.city ? `, ${data?.city}` : ""
              }${data?.post_code ? `, ${data?.post_code}` : ""}`.trim()
            ]
              ?.filter(el => el)
              ?.map((el, key) => (
                <Typography key={key} fontWeight="bold" variant="body2">
                  {el}
                </Typography>
              ))}
      </Stack>
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
export default VendorDrawer;

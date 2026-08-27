import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Close, DeleteForever, ModeEdit } from "@mui/icons-material";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled
} from "@mui/material";
import { ukDateFormat } from "../../../../Utils/datesFormat";
import { useNavigate } from "react-router-dom";
import { User } from "../../../../Interfaces/usersType";
import { useUserByID } from "../../../../Hooks/useUsers";
import Checkbox from "../../../../Components/Checkbox";
interface UserDrawerProps {
  open: boolean;
  onClose(): void;
  row?: User;
  onDelete(): void;
  onResetPassword(): void;
  isTrash?: boolean;
}
const UserDrawer: React.FC<UserDrawerProps> = props => {
  const { onClose, open, row, onDelete, onResetPassword, isTrash } = props;
  const navigate = useNavigate();
  const { data, isLoading: fetchLoading } = useUserByID(
    open && row?.id ? row?.id : undefined
  );
  const handleEdit = () => {
    if (row?.id) {
      navigate(`/admin/edit-user/${row?.id}`);
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
          User :
        </Typography>
        {fetchLoading ? (
          <Skeleton variant="text" sx={{ fontSize: 30 }} width={150} />
        ) : (
          <Typography fontSize={20} fontWeight={"bold"} variant="h3">
            {data?.first_name}
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
          id="cy__EditUser"
        >
          Edit User
        </Button>
        {isTrash ? (
          <Chip label="Trashed" color="error" sx={{ ml: 1 }} />
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
        <Box>
          <Checkbox
            child="radio"
            checked={Boolean(data?.is_active)}
            label={data?.is_active ? "Active" : "Inactive"}
            loading={fetchLoading}
          />
        </Box>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={fetchLoading ? 0 : 2}>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Full Name :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"} textTransform={"capitalize"}>
              {data?.first_name + " " + data?.last_name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Password :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Button
              variant="text"
              color="primary"
              onClick={onResetPassword}
              endIcon={<ModeEdit />}
              size="small"
            >
              ---
            </Button>
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
            <Typography variant="body2">Last Login :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {!!data?.last_login &&
              data?.last_login?.toString()?.toLowerCase() === "none"
                ? "---"
                : !!data?.last_login && ukDateFormat(new Date(data.last_login), true)}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Contact Number :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.mobile_phone}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">Office Contact Number :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.office_phone}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">User Role :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.is_manager
                ? "Manager"
                : data?.is_staff
                  ? "Staff"
                  : data?.is_superuser
                    ? "Admin"
                    : "---"}
            </Typography>
          )}
        </Grid>
        <Grid item xs={6}>
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2">User Brands :</Typography>
          )}
          {fetchLoading ? (
            <Skeleton variant="text" sx={{ fontSize: 20 }} width={80} />
          ) : (
            <Typography variant="body2" fontWeight={"bold"}>
              {data?.brands.map(el => el.name).join(", ")}
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
export default UserDrawer;

import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Close } from "@mui/icons-material";
import {
  Divider,
  Drawer,
  IconButton,
  Stack,
  styled,
  Grid,
  CardContent,
  Switch,
  Button,
  CircularProgress,
  FormHelperText
} from "@mui/material";
import Input from "../../../../Components/Input";
import { useCreateFridge, useUpdateFridge } from "../../../../Hooks/useFridgesList";
import { validateForm, ValidationErrors } from "./validateForm";
import { getBrandId } from "../../../../Hooks/api";
import { PurchaseFridgeState, UpdateFridgeState } from "@interfaces/Fridges";

interface FridgeDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  initialData?: UpdateFridgeState | null;
}

const FridgeDrawer: React.FC<FridgeDrawerProps> = ({
  open,
  onClose,
  mode,
  initialData
}) => {
  const [purchaseFridge, setPurchaseFridge] = useState<PurchaseFridgeState>({
    brand_id: "",
    fridge_number: "",
    location: "",
    description: "",
    is_active: false,
    notify_to: ""
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { mutateAsync: createFridgePurchase, isLoading: isCreating } = useCreateFridge();
  const { mutateAsync: updateFridgePurchase, isLoading: isUpdating } = useUpdateFridge();
  const [fridgeToUpdate, setfridgeToUpdate] = useState<UpdateFridgeState | null>(null);

  useEffect(() => {
    if (mode === "update" && initialData) {
      setfridgeToUpdate(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    if (mode === "create") {
      setPurchaseFridge(prevState => ({
        ...prevState,
        [name]: type === "checkbox" ? (checked ? true : false) : value
      }));
    } else {
      setfridgeToUpdate(prevState => {
        if (!prevState) return null;

        return {
          ...prevState,
          [name]: type === "checkbox" ? (checked ? true : false) : value
        } as UpdateFridgeState;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { brand_id } = getBrandId();
    const fridgeData = { ...purchaseFridge, brand_id };
    const dataToValidate = mode === "create" ? fridgeData : fridgeToUpdate;

    if (dataToValidate && validateFields(dataToValidate)) {
      try {
        if (mode === "create") {
          await createFridgePurchase(fridgeData);
        } else if (mode === "update" && fridgeToUpdate) {
          await updateFridgePurchase(fridgeToUpdate);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error processing fridge data:", error);
      }
    }
  };

  const validateFields = (fridgeData: PurchaseFridgeState) => {
    const validationErrors = validateForm(fridgeData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setPurchaseFridge({
      brand_id: "",
      fridge_number: "",
      location: "",
      description: "",
      is_active: false,
      notify_to: ""
    });
    setfridgeToUpdate(null);
    setErrors({});
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={onClose}>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500]
        }}
        onClick={onClose}
      >
        <Close />
      </IconButton>

      <form onSubmit={handleSubmit} method={mode === "create" ? "POST" : "PUT"}>
        <Stack direction="row" gap={1} alignItems="center" justifyContent="start">
          <Typography fontSize={20} fontWeight="bold" variant="h3">
            {mode === "create" ? "Add Fridge" : "Update Fridge"}
          </Typography>
        </Stack>
        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Fields marked with <span style={{ color: "red" }}>*</span> are required.
        </Typography>

        <Stack direction="row" gap={1} alignItems="center" justifyContent="start" my={1}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  label="Fridge Number * "
                  value={
                    mode === "create"
                      ? purchaseFridge.fridge_number
                      : fridgeToUpdate?.fridge_number
                  }
                  name="fridge_number"
                  type="text"
                  onChange={handleChange}
                />
                {errors.fridge_number && (
                  <FormHelperText error>{errors.fridge_number}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Input
                  label="Location * "
                  value={
                    mode === "create" ? purchaseFridge.location : fridgeToUpdate?.location
                  }
                  name="location"
                  type="text"
                  min={0}
                  onChange={handleChange}
                />
                {errors.location && (
                  <FormHelperText error>{errors.location}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Description * "
                  value={
                    mode === "create"
                      ? purchaseFridge.description
                      : fridgeToUpdate?.description
                  }
                  name="description"
                  type="text"
                  onChange={handleChange}
                  min={0}
                  multiline
                  rows={4}
                />
                {errors.description && (
                  <FormHelperText error>{errors.description}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Notify to * "
                  value={
                    mode === "create"
                      ? purchaseFridge.notify_to
                      : fridgeToUpdate?.notify_to
                  }
                  name="notify_to"
                  type="email"
                  onChange={handleChange}
                />
                {errors.notify_to && (
                  <FormHelperText error>{errors.notify_to}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                Active:
                <Switch
                  checked={
                    mode === "create"
                      ? purchaseFridge.is_active
                      : fridgeToUpdate?.is_active
                  }
                  onChange={handleChange}
                  name="is_active"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            sx={{
              width: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              height: 40,
              backgroundColor: "primary.main",
              color: "white"
            }}
            type={isCreating || isUpdating ? "button" : "submit"}
          >
            {isCreating || isUpdating ? (
              <CircularProgress
                size={25}
                sx={{
                  color: "white"
                }}
              />
            ) : mode === "create" ? (
              "Save"
            ) : (
              "Update"
            )}
          </Button>
        </Stack>
      </form>
    </StyledDrawer>
  );
};

export default FridgeDrawer;

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

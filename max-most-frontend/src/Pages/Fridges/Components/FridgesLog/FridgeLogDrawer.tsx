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
  Button,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Input from "../../../../Components/Input";
import { Fridge, FridgeLogCreate } from "@interfaces/Fridges";
import { ValidationErrors, validateForm } from "./validateForm";
import { useAddFridgeLog, useUpdateFridgeLog } from "../../../../Hooks/useFridgesLog";

interface FridgeDrawerProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "update";
  initialData?: FridgeLogCreate | null;
  dataList?: Fridge[] | null;
}

const FridgeLogDrawer: React.FC<FridgeDrawerProps> = ({
  open,
  onClose,
  mode,
  initialData,
  dataList
}) => {
  const [addFridgeLog, setAddFridgeLog] = useState<FridgeLogCreate>({
    fridge_id: "",
    min_temp: "",
    max_temp: "",
    room_temp: "",
    notes: ""
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedFridge, setSelectedFridge] = useState<string>("");

  const { mutateAsync: createFridgeLog, isLoading: isCreating } = useAddFridgeLog();
  const { mutateAsync: updateFridgeLog, isLoading: isUpdating } = useUpdateFridgeLog();
  const [fridgeLogToUpdate, setFridgeLogToUpdate] = useState<FridgeLogCreate | null>(
    null
  );

  useEffect(() => {
    if (mode === "update" && initialData) {
      setFridgeLogToUpdate(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;

    const updatedValue = type === "checkbox" ? (checked ? true : false) : value;

    if (mode === "create") {
      setAddFridgeLog(prevState => ({
        ...prevState,
        [name]: updatedValue
      }));
    } else {
      setFridgeLogToUpdate(prevState =>
        prevState
          ? {
              ...prevState,
              [name]: updatedValue
            }
          : null
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToValidate = mode === "create" ? addFridgeLog : fridgeLogToUpdate;
    if (dataToValidate && validateFields(dataToValidate)) {
      try {
        if (mode === "create") {
          await createFridgeLog(addFridgeLog);
        } else if (mode === "update" && fridgeLogToUpdate) {
          await updateFridgeLog(fridgeLogToUpdate);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error processing Temperature Log:", error);
      }
    }
  };

  const validateFields = (dataToValidate: FridgeLogCreate) => {
    const validationErrors = validateForm(dataToValidate);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setAddFridgeLog({
      fridge_id: "",
      min_temp: "",
      max_temp: "",
      room_temp: "",
      notes: ""
    });
    setFridgeLogToUpdate(null);
    setSelectedFridge("");
    setErrors({});
  };

  useEffect(() => {
    if (mode === "create") {
      const selectedFridgeListId = dataList?.find(
        item => item?.fridge_number === selectedFridge
      );

      if (selectedFridgeListId) {
        setAddFridgeLog(prevState => ({
          ...prevState,
          fridge_id: selectedFridgeListId?.id || ""
        }));
      }
    }
  }, [selectedFridge, dataList, mode]);

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
            {mode === "create" ? "Add Temperature Log" : "Update Temperature Log"}
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
                {mode === "create" && (
                  <FormControl fullWidth>
                    <InputLabel id="fridge-select-label">Fridge#</InputLabel>
                    <Select
                      labelId="fridge-select-label"
                      value={selectedFridge}
                      // value={
                      //   mode === "create"
                      //     ? selectedFridge
                      //     : fridgeLogToUpdate?.fridge_id || ""
                      // }
                      onChange={event => setSelectedFridge(event.target.value as string)}
                      label="Fridge#"
                    >
                      {dataList?.map((item, index) => (
                        <MenuItem key={index} value={item.fridge_number}>
                          {item.fridge_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Grid>

              <Grid item xs={12}>
                <Input
                  label="Min Temp * "
                  value={
                    mode === "create"
                      ? addFridgeLog.min_temp
                      : fridgeLogToUpdate?.min_temp || ""
                  }
                  name="min_temp"
                  type="text"
                  onChange={handleChange}
                />
                {errors.min_temp && (
                  <FormHelperText error>{errors.min_temp}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Max Temp * "
                  value={
                    mode === "create"
                      ? addFridgeLog.max_temp
                      : fridgeLogToUpdate?.max_temp || ""
                  }
                  name="max_temp"
                  type="text"
                  onChange={handleChange}
                />
                {errors.max_temp && (
                  <FormHelperText error>{errors.max_temp}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Input
                  label="Room Temp * "
                  value={
                    mode === "create"
                      ? addFridgeLog.room_temp
                      : fridgeLogToUpdate?.room_temp || ""
                  }
                  name="room_temp"
                  type="text"
                  onChange={handleChange}
                />
                {errors.room_temp && (
                  <FormHelperText error>{errors.room_temp}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Input
                  label="Notes * "
                  value={
                    mode === "create"
                      ? addFridgeLog.notes
                      : fridgeLogToUpdate?.notes || ""
                  }
                  name="notes"
                  type="text"
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
                {errors.notes && <FormHelperText error>{errors.notes}</FormHelperText>}
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
            type="submit"
            disabled={isCreating || isUpdating}
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

export default FridgeLogDrawer;

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

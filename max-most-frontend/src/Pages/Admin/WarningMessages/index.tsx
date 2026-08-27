import { useState, useMemo, useEffect, useCallback } from "react";
import PageTitle from "../../../Components/PageTitle";
import { useWarnings } from "../../../Hooks/useWarning";
import WarningForm from "./Components/warningForm";
import WarningTable from "./Components/warningTable";
import { WarningMessageList } from "../../../Interfaces/warningMessageType";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Close } from "@mui/icons-material";
import { Stack, IconButton, Typography, MenuItem, Select } from "@mui/material";
import { InputValueAndLabel } from "../../../Interfaces/global";
import { useBrandContext } from "../../../Contexts/brandContext";
import LoadingButton from "../../../Components/LoadingButton";

import { useUserBrand } from "../../../Hooks/useBrand";
import { useUser } from "../../../Contexts/userContext";
import RestoreConfirmation from "./Components/warnigConformation";

function Warning() {
  const { user } = useUser();
  const { data: warningMessages, isLoading: warningMessagesLoading } = useWarnings();
  const [selectedWarningOption, setSelectedWarningOption] = useState<InputValueAndLabel>({
    label: "",
    value: ""
  });
  const { brand } = useBrandContext();
  const [action, setAction] = useState<{
    type: "edit" | "view" | "del" | "restore" | null;
    row: WarningMessageList | null;
  }>({
    row: null,
    type: null
  });

  const { data: brandsData, mutateAsync } = useUserBrand();

  const [isRestoreModalOpen, setRestoreModalOpen] = useState(false);

  const handleClose = () => {
    setAction({ type: null, row: null });
    setRestoreModalOpen(false);
  };

  const handleMutate = useCallback(
    async (id: string | undefined) => {
      if (!id) return;

      try {
        await mutateAsync({ userId: id });
      } catch (error) {
        console.error("Mutation failed", error);
      }
    },
    [mutateAsync]
  );

  useEffect(() => {
    handleMutate(user?.id);
  }, [handleMutate, user?.id]);

  const brandsOptions = useMemo(
    () =>
      brandsData
        ?.filter(brandItem => brandItem.id !== brand?.id)
        .map(item => ({
          label: item.name,
          value: item.id
        })) || [],
    [brandsData, brand?.id]
  );

  return (
    <Stack gap={2}>
      <PageTitle icon="/assets/icons/Group 38.svg" title="Warning Message" />
      <Typography>
        Sync <strong>{brand?.name}</strong> product warning messages with{" "}
        <strong>{selectedWarningOption.label}</strong>?
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Select
          sx={{ width: "30%", height: "40px" }}
          value={selectedWarningOption?.value || ""}
          onChange={event => {
            const selectedValue = event.target.value;
            const selectedOption = brandsOptions.find(
              option => option.value === selectedValue
            );
            setSelectedWarningOption(selectedOption || { label: "", value: "" });
          }}
          name="website_id"
          id="cy__ProductWebsiteSelect"
          displayEmpty
          renderValue={value => {
            if (!value) {
              return <em>Select Brand</em>;
            }
            const selectedOption = brandsOptions.find(option => option.value === value);
            return selectedOption ? selectedOption.label : "";
          }}
        >
          {brandsOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <LoadingButton
          sx={{ height: "40px" }} // Matching the height with the Select component
          variant="contained"
          onClick={() => setRestoreModalOpen(true)}
        >
          Sync
        </LoadingButton>
      </Stack>

      <WarningForm editWarning={false} />
      <WarningTable
        warningMessages={warningMessages}
        isLoading={warningMessagesLoading}
        setAction={setAction}
      />

      <Dialog
        open={action.type === "edit"}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <IconButton
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <WarningForm
            selectedMessage={action?.row}
            editWarning={true}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>

      <RestoreConfirmation
        onClose={handleClose}
        open={isRestoreModalOpen}
        selectedWarningOption={selectedWarningOption}
      />
    </Stack>
  );
}

export default Warning;

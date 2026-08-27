import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import React, { useState } from "react";
import DataTables from "../../Components/DataTable/index";
import { useWebsites } from "../../Hooks/usePatients";
import { Website } from "../../Interfaces/Company";

import { usePrivatePrescription } from "../../Hooks/usePrivatePrescription";
import { PrivatePrescriptionColumns } from "../../Constants/privatePrescriptionConst";
import LoadingButton from "../../Components/LoadingButton";

interface Props {
  open: boolean;
  onClose(): void;
}
const WebsitesModal: React.FC<Props> = props => {
  const { onClose, open } = props;

  const { data: website, isLoading } = useWebsites();

  const [selectedWebsites, setSelectedWebsites] = useState<{ websites: string[] }>({
    websites: []
  });
  const handleRowSelection = (rows: Website[]) => {
    setSelectedWebsites({ websites: rows?.map(itm => itm.site_url) });
  };
  const { mutate, isLoading: privatePrescriptionLoading } = usePrivatePrescription();

  const submitHanlder = () => {
    mutate(selectedWebsites);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        onClick={onClose}
      >
        <Close />
      </IconButton>
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Select Website
        <Typography variant="body1">{website?.results?.length}</Typography>
      </DialogTitle>
      <DialogContent>
        <DataTables
          columns={PrivatePrescriptionColumns}
          data={website?.results?.length ? website?.results : []}
          loading={isLoading}
          onRowSelection={handleRowSelection}
          selectable={true}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "end" }}>
        <LoadingButton
          variant="contained"
          onClick={submitHanlder}
          loading={privatePrescriptionLoading}
          disabled={selectedWebsites?.websites?.length === 0}
        >
          Download CSV
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WebsitesModal;

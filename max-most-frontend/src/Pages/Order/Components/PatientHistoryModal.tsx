/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { HistoryData, OrderData, OrderProduct } from "../../../Interfaces/Orders";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import LoadingButton from "../../../Components/LoadingButton";
import { useLazyPatientHistory } from "../../../Hooks/usePatients";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../Hooks/useDebounce";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import DataTable from "../../../Components/DataTable";
import { OrderProductPatientHistoryColumns } from "../../../Constants/Orders";
interface PatientHistoryModalProps {
  data?: OrderProduct | null;
  order?: OrderData;
  open: boolean;
  onClose(): void;
}
const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  data,
  onClose,
  order,
  open
}) => {
  const [params] = useSearchParams();
  const debouncedParams = useDebounce(params, 1000);
  const getPatientHistory = useLazyPatientHistory();
  const [patientHistory, setPatientHistory] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const getData = async (order: OrderData, data: OrderProduct) => {
    try {
      setLoading(true);
      const patientHistoryData = await getPatientHistory(
        order?.website.site_url,
        order?.website.authorization_key,
        data?.website_patient_id,
        debouncedParams
      );
      setPatientHistory(
        (patientHistoryData?.results?.length
          ? patientHistoryData?.results
          : []) as unknown as HistoryData[]
      );
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (
      open &&
      data &&
      order &&
      order?.website?.site_url &&
      order?.website?.authorization_key &&
      data?.website_patient_id
    ) {
      getData(order, data);
    }
  }, [open, data]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle variant="h6" fontWeight={"bold"}>
        Patient History
      </DialogTitle>
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
      <DialogContent dividers>
        <DataTable
          columns={OrderProductPatientHistoryColumns}
          data={patientHistory}
          loading={loading}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" onClick={onClose}>
          Close
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistoryModal;

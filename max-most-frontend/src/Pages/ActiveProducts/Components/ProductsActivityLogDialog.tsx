import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import React from "react";
import {
  PayloadResponse,
  ProductActiveLogResponse,
  ProductDetails,
  ProductRequest
} from "@interfaces/productActiveLogType";
import { DisplayData } from "./DisplayDialogResult";
import { ResponseDataDisplay } from "./ResponseDataDisplay";

interface Props {
  open: boolean;
  onClose(): void;
  row: ProductActiveLogResponse | ProductRequest | ProductDetails | null;
  actionType: "payload-send" | "response-send";
}

const ProductsActivityLogDialog: React.FC<Props> = props => {
  const { onClose, open, row, actionType } = props;
  if (!row) {
    return null;
  }

  // let data: any;
  let data: PayloadResponse | Record<string, unknown> = {};

  // Function to sanitize and parse JSON
  const sanitizeAndParseJSON = (jsonString: string) => {
    // Replace "None" with null
    const sanitizedString = jsonString.replace(/"None"/g, "null");
    try {
      return JSON.parse(sanitizedString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {}; // Return an empty object or handle the error as needed
    }
  };

  if (actionType === "payload-send") {
    // Handle payload
    if (row && "payload" in row) {
      if (typeof row.payload === "string") {
        data = sanitizeAndParseJSON(row.payload);
      } else if (Array.isArray(row.payload)) {
        data = row.payload.length > 0 ? sanitizeAndParseJSON(row.payload.join(",")) : {};
      }
    }
  } else if (actionType === "response-send") {
    // Handle response
    if (row && "response" in row) {
      if (typeof row.response === "string") {
        data = sanitizeAndParseJSON(row.response);
      } else if (Array.isArray(row.response)) {
        data =
          row.response.length > 0 ? sanitizeAndParseJSON(row.response.join(",")) : {};
      }
    }
  }
  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
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
      <DialogTitle>
        <Typography variant="h6" fontWeight={"bold"}>
          Product Activity Log
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={0.4} justifyContent={"center"} alignItems={"center"}>
          {actionType === "payload-send" && <DisplayData data={data} />}
          {actionType === "response-send" && <ResponseDataDisplay data={data} />}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end" }}></DialogActions>
    </Dialog>
  );
};

export default ProductsActivityLogDialog;

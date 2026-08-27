import React, { useEffect, useState } from "react";
import Input from "../../../../Components/Input";
import TextArea from "../../../../Components/Textarea";
import {
  useCreateWarningMessage,
  useUpdateWarningMessage
} from "../../../../Hooks/useWarning";
import { WarningMessageList } from "../../../../Interfaces/warningMessageType";
import { Card, CardActions, CardContent, Stack } from "@mui/material";
import LoadingButton from "../../../../Components/LoadingButton";

interface IProps {
  selectedMessage?: WarningMessageList | null;
  editWarning?: boolean;
  handleClose?: () => void;
}

const WarningForm: React.FC<IProps> = ({ selectedMessage, editWarning, handleClose }) => {
  const [warningMessageNumber, setWarningMessageNumber] = useState<number | string>("");
  const [description, setDescription] = useState<string>("");
  const { mutateAsync: addWarning, isLoading: addLoading } = useCreateWarningMessage();
  const { mutateAsync: updateWarning, isLoading: updateLoading } =
    useUpdateWarningMessage();

  useEffect(() => {
    if (selectedMessage) {
      setWarningMessageNumber(selectedMessage?.warningNumber);
      setDescription(selectedMessage?.message);
    }
  }, [selectedMessage]);

  const submitHandler = async () => {
    try {
      if (editWarning) {
        await updateWarning({
          warningNumber: warningMessageNumber,
          message: description,
          warning_id: selectedMessage?.id
        });
        handleClose && handleClose();
      } else {
        await addWarning({
          warningNumber: warningMessageNumber,
          message: description
        });
      }
      setWarningMessageNumber("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack gap={1}>
          {" "}
          <Input
            type="number"
            handleChange={({ value }) => setWarningMessageNumber(String(value))}
            name="warning-number"
            label="Warning Message Number"
            value={warningMessageNumber}
          />
          <TextArea
            label="Description"
            placeholder="Warning Message here"
            name="warning-message"
            value={description}
            handleChange={({ value }) => setDescription(value)}
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "end", p: 2 }}>
        <LoadingButton
          style={{ marginTop: "10px" }}
          variant="contained"
          onClick={submitHandler}
          loading={addLoading || updateLoading}
        >
          {editWarning ? "Update" : "Add"} Warning
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default WarningForm;

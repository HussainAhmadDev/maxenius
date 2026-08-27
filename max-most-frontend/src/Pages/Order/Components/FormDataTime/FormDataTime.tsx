import React, { useState } from "react";
import { toast, Slide } from "react-toastify";
import dayjs from "dayjs";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface FormDataTimeProps {
  dateStart?: string;
  dateEnd?: string;
  setIsShowFormDateTime: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveDateStart: (date: string) => void;
  onSaveDateEnd: (date: string, time: string) => void;
}

const FormDataTime: React.FC<FormDataTimeProps> = ({
  dateStart,
  dateEnd,
  setIsShowFormDateTime,
  onSaveDateStart,
  onSaveDateEnd
}) => {
  const [currentDateStart, setCurrentDateStart] = useState(dateStart ?? "");
  const [currentDateEnd, setCurrentDateEnd] = useState(
    dateEnd ?? dayjs().add(2, "day").format("YYYY-MM-DD")
  );
  const [currentTimeEnd, setCurrentTimeEnd] = useState(
    dateEnd ? dayjs(dateEnd).format("HH:mm") : dayjs().format("HH:mm")
  );
  const [isDisabledStart, setIsDisabledStart] = useState(!dateStart);
  const [isDisabledEnd, setIsDisabledEnd] = useState(false);

  const handleChangeDateStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDateStart(event.target.value);
  };

  const handleChangeDateEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDateEnd(event.target.value);
  };

  const handleChangeTimeEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeEnd(event.target.value);
  };

  const handleClickSave = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (currentDateEnd && currentDateStart > currentDateEnd) {
      toast.error("Datum zahájení je později než Datum dokončení!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide
      });
    } else {
      setIsShowFormDateTime(false);
      onSaveDateStart(currentDateStart);
      onSaveDateEnd(currentDateEnd, currentTimeEnd);
    }
  };

  const handleClickDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onSaveDateStart("");
    onSaveDateEnd("", "");
    setIsShowFormDateTime(false);
  };

  const handleCheckboxChangeStart = () => {
    if (isDisabledStart) {
      setCurrentDateStart(dayjs().format("YYYY-MM-DD"));
    } else {
      setCurrentDateStart("");
    }
    setIsDisabledStart(!isDisabledStart);
  };

  const handleCheckboxChangeEnd = () => {
    if (isDisabledEnd) {
      setCurrentDateEnd(dayjs().add(2, "day").format("YYYY-MM-DD"));
      setCurrentTimeEnd(dayjs().format("HH:mm"));
    } else {
      setCurrentDateEnd("");
      setCurrentTimeEnd("");
    }
    setIsDisabledEnd(!isDisabledEnd);
  };

  return (
    <div className="absolute top-40 left-20 p-4 w-[350px] h-[350px] bg-white rounded-[8px] shadow-[0px_0px_6px_1px_#00000024]">
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          className="px-[10px] w-full h-10 text-base text-[#44546f] font-semibold flex justify-center items-center"
        >
          Data
        </Typography>
        <Button onClick={() => setIsShowFormDateTime(false)}>
          <CloseIcon />
        </Button>
      </Grid>
      <form className="mt-4 flex flex-col gap-3">
        <div>
          <FormControlLabel
            control={
              <Checkbox checked={!isDisabledStart} onChange={handleCheckboxChangeStart} />
            }
            label={`Datum zahájení: ${isDisabledStart ? "Není specifikováno" : ""}`}
          />
          <TextField
            type="date"
            value={currentDateStart}
            onChange={handleChangeDateStart}
            disabled={isDisabledStart}
            InputProps={{
              classes: {
                root: isDisabledStart
                  ? "border-white text-[#091e424f] cursor-not-allowed"
                  : "border-[#0c66e4] cursor-text"
              },
              endAdornment: null,
              disableUnderline: true
            }}
          />
        </div>

        <div>
          <FormControlLabel
            control={
              <Checkbox checked={!isDisabledEnd} onChange={handleCheckboxChangeEnd} />
            }
            label={`Date: ${isDisabledEnd ? "Není specifikováno" : ""}`}
          />
          <TextField
            type="date"
            value={currentDateEnd}
            onChange={handleChangeDateEnd}
            disabled={isDisabledEnd}
            InputProps={{
              classes: {
                root: isDisabledEnd
                  ? "border-white text-[#091e424f] cursor-not-allowed"
                  : "border-[#0c66e4] cursor-text"
              },
              endAdornment: null,
              disableUnderline: true
            }}
          />
          <TextField
            type="time"
            value={currentTimeEnd}
            onChange={handleChangeTimeEnd}
            disabled={isDisabledEnd}
            InputProps={{
              classes: {
                root: isDisabledEnd
                  ? "border-white text-[#091e424f] cursor-not-allowed"
                  : "border-[#0c66e4] cursor-text"
              },
              endAdornment: null,
              disableUnderline: true
            }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            className="px-3 py-1.5 w-full bg-[#0c66e4] hover:bg-[#0055cc] text-[16px] text-white font-bold rounded-[3px]"
            onClick={handleClickSave}
          >
            Save
          </Button>
          <Button
            className="px-3 py-1.5 w-full bg-[#e5e6ea] hover:bg-[#d1d4db] text-[16px] text-[#44546f] font-bold rounded-[3px]"
            onClick={handleClickDelete}
          >
            Remove
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormDataTime;

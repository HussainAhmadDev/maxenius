import Grid from "@mui/material/Grid";
import Button from "Components/Button";
import TextInput from "Components/Form/TextInput";
import { NavBar } from "Components/Navbar";
import Layout from "Components/layout";
import React, { ChangeEvent } from "react";
// import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";
import Cancel from "@material-ui/icons/Cancel";
import { useSearchParams } from "react-router-dom";
import {
  useAddWarning,
  useEditWarning,
  // useTrashWarning,
  useWarningMessages
} from "Hooks/useWarningMessage";
import { useBrand } from "Context/BrandContext";
import EditIcon from "@mui/icons-material/Edit";

import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Box } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  padding: "20px 32px 32px 20px"
};

interface IWarningMessage {
  message: string;
  id: string;
  warningNumber: number;
}
interface ColumnsProps {
  readonly name: string;
  readonly sortable?: boolean;
  readonly maxWidth?: number;
  readonly cell?: (row: IWarningMessage) => JSX.Element;
  readonly selector?: (row: IWarningMessage) => string | React.ReactNode | undefined;
}
const customStyles = {
  rows: {
    style: {
      backgroundColor: "#f6f7f7",
      paddingRight: "10px"
    },
    stripedStyle: {
      backgroundColor: "#fbfbfb"
    }
  },
  header: {
    style: {
      borderRadius: "6px 6px 0px 0px"
    }
  },
  headCells: {
    style: {
      paddingLeft: "8px",
      background: "#F1F5F9", //This custom library styles and we are not getting theme here
      color: "#475569", //This custom library styles and we are not getting theme here
      justifyContent: "flex-start",
      textAlign: "center",
      fontSize: "12px",
      "> div": {
        margin: "auto"
      },
      "&:nth-child(1)": {
        borderRadius: "6px 0px 0px 0px",
        paddingLeft: "15px"
      },
      "&:nth-last-child(1)": {
        justifyContent: "flex-end",
        paddingRight: "30px",
        borderRadius: "0px 6px 0px 0px"
      }
    }
  },
  cells: {
    style: {
      textAlign: "flex-end",
      justifyContent: "flex-end"
    }
  }
};

const useStyles = makeStyles(theme => ({
  redField: {
    color: theme.palette.primary.main
  },
  iconDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
}));

const WarningMessage = () => {
  const [searchParams] = useSearchParams();
  const [isEdit, setIsEdit] = React.useState({ id: "" });
  const [updatedMessage, setUpdatedMessage] = React.useState<string>("");
  const [warningMessage, setWarningMessage] = React.useState("");
  const [warningNumber, setWarningNumber] = React.useState<string>("0");
  const [updatedWarningNumber, setUpdatedWarningNumber] = React.useState<string>("0");
  const { data, isLoading } = useWarningMessages(searchParams);
  const [open, setOpen] = React.useState<boolean>(false);
  const classes = useStyles();
  const styles = { ...customStyles };

  const columns: ColumnsProps[] = [
    {
      selector: row => `${row?.warningNumber}`,
      name: "Warning #",
      cell: row => (
        <p style={{ width: "100%", textAlign: "left", marginLeft: "0px" }}>
          {Number(row.warningNumber)}
        </p>
      ),
      sortable: true
    },
    {
      selector: row => `${row?.message}`,
      name: "Warning Message",
      cell: row => (
        <p style={{ width: "100%", textAlign: "left", marginLeft: "0px" }}>
          {row.message}
        </p>
      ),
      sortable: false
    },
    {
      name: "Action",
      maxWidth: 100,
      cell: row => (
        <EditIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setOpen(true);
            row.message && setUpdatedMessage(row.message);
            row.warningNumber && setUpdatedWarningNumber(row.warningNumber.toString());
            setIsEdit({ id: row.id });
          }}
        />
      )
    }
  ];

  const { activeBrand } = useBrand();

  //add
  const { mutate } = useAddWarning();

  const addWarning = () => {
    if (!warningMessage && !warningNumber) {
      toast.info("Please Add Warning message & Number");
      return;
    }
    if (!warningNumber || warningNumber === "0") {
      toast.info("Please Add Warning Number");
      return;
    }
    if (!warningMessage || warningMessage?.length === 0) {
      toast.info("Please Add Warning message");
      return;
    }
    const obj = {
      warningNumber: warningNumber,
      brand_id: activeBrand,
      message: warningMessage
    };
    setWarningMessage("");
    setWarningNumber("");

    mutate(obj);
  };

  //delete
  // const { mutate: trashWarning } = useTrashWarning();

  // const TrashWarning = (id: string) => {
  //   trashWarning({ id: id });
  // };

  //update
  const { mutate: editWarning } = useEditWarning();
  const updateWarnings = () => {
    editWarning({
      id: isEdit.id,
      warningNumber: updatedWarningNumber,
      brand_id: activeBrand,
      message: updatedMessage
    });
    setIsEdit({ id: "" });
  };

  const warningNumberHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    editAble: boolean
  ) => {
    const inputValue = parseInt(e.target.value, 10);

    if (!isNaN(inputValue) && inputValue > 0) {
      editAble
        ? setUpdatedWarningNumber(inputValue?.toString())
        : setWarningNumber(inputValue?.toString());
    } else {
      // Handle the case where the input is not a valid positive number
      // You might want to display an error message or handle it in another way
    }
  };

  const disallowedCharactersRegex = /[:?><,/';[\]+!_"`~@#$%^&*()]/g;

  const handleInputChange = (e: { target: { value: string } }, isEditable: boolean) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(disallowedCharactersRegex, "");

    if (isEditable) {
      setUpdatedMessage(sanitizedValue);
    } else {
      setWarningMessage(sanitizedValue);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit({ id: "" });
  };

  return (
    <Layout>
      <NavBar pageTitle="Warning Messages"></NavBar>
      {/* update modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={classes.iconDiv}>
            <Typography variant="h6" className={classes.redField}>
              Update Warning
            </Typography>
            <span onClick={handleClose}>
              <Cancel
                color="primary"
                style={{ color: "#F7CA2A", fontSize: "50px", cursor: "pointer" }}
              />
            </span>
          </div>
          {/*  */}

          <Grid
            container
            spacing={2}
            alignItems={"center"}
            pt={4}
            justifyContent={"center"}
          >
            <Grid item lg={11} md={12} sm={12} xs={12}>
              <h3> Warning Message Number </h3>
              <TextInput
                value={updatedWarningNumber}
                name="warning_message"
                onChange={e => warningNumberHandler(e, true)}
                type="number"
                isMultiline={false}
                placeholder="Warning Number here"
              />
            </Grid>
            <Grid item lg={11} md={12} sm={12} xs={12}>
              <h3> Update Warning Message </h3>
              <TextInput
                value={updatedMessage || ""}
                name="warning_message"
                onChange={e => handleInputChange(e, true)}
                type="text"
                isMultiline={true}
                minRows={6}
                maxRows={6}
                placeholder="Warning Text here"
                inputProps={{
                  maxLength: 1000
                }}
              />
              <Button
                style={{ marginTop: 15 }}
                text="Update"
                type="primary"
                onClick={() => updateWarnings()}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Grid container spacing={2} alignItems={"center"} pt={4} justifyContent={"center"}>
        <Grid item lg={11} md={12} sm={12} xs={12}>
          <h3> Warning Message Number </h3>
          <TextInput
            value={warningNumber}
            name="warning_message"
            onChange={e => warningNumberHandler(e, false)}
            type="number"
            isMultiline={false}
            placeholder="Warning Number here"
          />
        </Grid>
        <Grid item lg={11} md={12} sm={12} xs={12}>
          <h3> Add Warning Message </h3>
          <TextInput
            value={warningMessage || ""}
            name="warning_message"
            onChange={e => handleInputChange(e, false)}
            type="text"
            isMultiline={true}
            minRows={6}
            maxRows={6}
            placeholder="Warning Text here"
            inputProps={{
              maxLength: 1000
            }}
          />
          <Button
            style={{ marginTop: 15 }}
            text="Add"
            type="primary"
            onClick={addWarning}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        alignItems={"center"}
        justifyContent={"center"}
        mt={1}
        mb={5}
      >
        <Grid item lg={11} md={12} sm={12} xs={12}>
          <Grid item xs={12} lg={4} ml={1}>
            <h3> Warning Messages </h3>
          </Grid>
          {data && (
            <DataTable
              selectableRows={false}
              //eslint-disable-next-line
              //@ts-ignore
              columns={columns}
              //eslint-disable-next-line
              //@ts-ignore
              data={data}
              loading={isLoading}
              showPagination={false}
              customStyles={styles}
            />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};
export default WarningMessage;

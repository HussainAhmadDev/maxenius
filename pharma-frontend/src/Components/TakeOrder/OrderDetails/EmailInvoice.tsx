import * as React from "react";
import Grid from "@mui/material/Grid";
// import { FormikProps } from "formik";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { ModalInterface } from "../../../Interfaces/ModalInterface";
import TextInput from "../../Form/TextInput";
import ModalPopUp from "../../ModalPopup/";
import MuiIcon from "../../icons/MuiIcons";
import Button from "../../Button/index";
import CreatableSelect from "react-select/creatable";
import { Invoice, InvoiceResponse } from "Interfaces/Invoices";
import { getAccessToken } from "Hooks/api";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.text.primary,
      marginBottom: "0px",
      fontWeight: "bold"
    },
    selectlabel: {
      color: theme.palette.text.primary,
      marginBottom: "8px",
      fontWeight: "bold"
    },
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0
    },
    chip: {
      margin: theme.spacing(0.5)
    },
    flex: {
      display: "flex",
      alignItems: "center"
    },
    fileIcon: {
      transform: "rotate(20deg)"
    }
  })
);

interface Props extends ModalInterface {
  //I added formikType here but it didnt work
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any;
  invoiceData?: InvoiceResponse;
}

interface Option {
  label: string;
  value: string;
}

const EmailInvoice: React.FC<Props> = props => {
  const classes = useStyles();
  const { formik, invoiceData } = props;
  const [isFileDownloading, setIsFileDownloading] = React.useState(false);

  const handleChangeCreateable = (newValue: Array<Option>, label: string) => {
    if (newValue?.length === 0) formik.setFieldValue(label, []);
    let checkEmail;
    newValue.forEach(item => {
      const re = /\S+@\S+\.\S+/;
      checkEmail = re.test(item.value);
    });
    if (checkEmail) {
      const fieldArr = newValue?.map(item => item.value);
      formik.setFieldValue(label, fieldArr);
    }
  };
  const handlePrintInvoices = () => {
    invoiceData?.invoices?.forEach(async item => {
      setIsFileDownloading(true);
      const resp = await fetch(item.url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (resp.ok) {
        const pdf = await resp.blob();
        const url = URL.createObjectURL(pdf);
        const link = document.createElement("a");
        link.href = url;
        link.download = item.name;
        link.click();
        link.remove();
        setIsFileDownloading(false);
      }
    });
  };
  return (
    <div>
      <ModalPopUp
        maxWidth="md"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        {...props}
      >
        <div>
          <Grid container spacing={2}>
            {/* To */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <p className={classes.selectlabel}>To</p>

              <CreatableSelect
                isMulti
                value={formik.values.email_to?.map((item: string) => {
                  return { label: item, value: item };
                })}
                // @ts-expect-error fix
                onChange={value => handleChangeCreateable(value, "email_to")}
              />
            </Grid>
            {/* To */}
            {/* Cc */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <p className={classes.selectlabel}>Cc</p>
              <CreatableSelect
                isMulti
                value={formik.values.email_cc?.map((item: string) => {
                  return { label: item, value: item };
                })}
                // @ts-expect-error fix
                onChange={value => handleChangeCreateable(value, "email_cc")}
              />
            </Grid>
            {/* Cc */}
            {/* Bcc */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <p className={classes.selectlabel}>Bcc</p>
              <CreatableSelect
                isMulti
                value={formik.values.email_bcc?.map((item: string) => {
                  return { label: item, value: item };
                })}
                // @ts-expect-error fix
                onChange={value => handleChangeCreateable(value, "email_bcc")}
              />
            </Grid>
            {/* Bcc */}
            {/* Subject and Suggestions */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <p className={classes.label}>Subject</p>
              <TextInput
                variant="outlined"
                name="email_subject"
                margin="dense"
                type="text"
                value={formik.values.email_subject}
                onChange={formik.handleChange}
                error={
                  formik.touched.email_subject && Boolean(formik.errors.email_subject)
                }
                helperText={formik.touched.email_subject && formik.errors.email_subject}
              />
            </Grid>
            {/* Subject and Suggestions */}
            {/* message body */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <p className={classes.label}>Email body</p>
              <TextInput
                type="text"
                margin="dense"
                isMultiline={true}
                minRows={7}
                maxRows={7}
                variant="outlined"
                name="email_body"
                value={formik.values.email_body}
                onChange={formik.handleChange}
                error={formik.touched.email_body && Boolean(formik.errors.email_body)}
                helperText={formik.touched.email_body && formik.errors.email_body}
              />
            </Grid>
            {/* message body */}
            {/* view invoice */}
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className={classes.flex}>
                <div>
                  {invoiceData &&
                    invoiceData?.invoices?.map((item: Invoice) => (
                      <Chip
                        key={item.url}
                        label={item.name}
                        className={classes.chip}
                        avatar={<MuiIcon icon="file" className={classes.fileIcon} />}
                      />
                    ))}
                </div>
                <div>
                  <Button
                    icon={<MuiIcon icon="view" />}
                    onlyIcon={true}
                    size="small"
                    type="secondary"
                    onClick={handlePrintInvoices}
                    loading={isFileDownloading}
                  />
                </div>
              </div>
            </Grid>
            {/* view invoice */}
          </Grid>
        </div>
      </ModalPopUp>
    </div>
  );
};

export default EmailInvoice;

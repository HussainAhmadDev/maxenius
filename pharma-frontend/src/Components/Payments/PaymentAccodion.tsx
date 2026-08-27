import * as React from "react";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles";
// Components
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Radio from "@mui/material/Radio";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordonBody: {
      marginBottom: "6px"
    },
    accordonTitle: {
      marginLeft: "16px",
      position: "relative",
      top: "-10px"
    }
  })
);

const Accordion = withStyles(theme => ({
  root: {
    border: `1px solid ${theme.palette.gray[300]}`,
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto",
      border: "1px solid",
      borderColor: theme.palette.primary.main
    }
  },
  expanded: {}
}))(MuiAccordion);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.primary.main}`
  }
}))(MuiAccordionDetails);

const AccordionSummary = withStyles({
  root: {
    marginBottom: "0px",
    borderRadius: "10px 10px 0px 0px",

    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
      marginBottom: "0px"
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
      marginBottom: "0px",
      marginTop: "6px"
    },
    marginBottom: "0px"
  },
  expanded: {}
})(MuiAccordionSummary);

interface Props {
  expanded: boolean;
  image: string;
  handleAccordion(): unknown;
  title: string;
}

const PaymentAccodian: React.FC<Props> = ({
  children,
  expanded,
  handleAccordion,
  image,
  title
}) => {
  const classes = useStyles();
  return (
    <div className={classes.accordonBody}>
      <Accordion expanded={expanded} onChange={handleAccordion}>
        <AccordionSummary aria-controls="credit-card-content" id="credit-card-header">
          <FormControlLabel
            value="credit-card"
            control={<Radio value="credit_card" checked={expanded} />}
            label=""
          />
          <div>
            <img alt="" width="64" height="34" src={image} />
            <span className={classes.accordonTitle}>{title}</span>
          </div>
        </AccordionSummary>
        {children && <AccordionDetails>{children}</AccordionDetails>}
      </Accordion>
    </div>
  );
};

export default PaymentAccodian;

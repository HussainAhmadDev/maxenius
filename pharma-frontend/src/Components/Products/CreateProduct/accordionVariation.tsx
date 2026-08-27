import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import TextInput from "../../Form/TextInput";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: " 5px"
    },
    text: {
      fontSize: "14px",
      color: theme.palette.gray[600]
    },
    outerContainer: {
      marginBottom: "20px"
    }
  })
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccordionVariations({ data, props }: any) {
  const classes = useStyles();
  return (
    <div style={{ marginTop: "20px" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>{data?.name}</Typography>
        </AccordionSummary>
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data?.variations.map((itm: any, index: number) => (
            <AccordionDetails className={classes.outerContainer} key={index}>
              {/* <Typography className={classes.text}>{index + 1}</Typography> */}
              <Grid container spacing={1}>
                {Object.entries(itm).map(
                  ([key, value]) =>
                    key.startsWith("dimension_") && (
                      <div key={key} className={classes.root}>
                        <Typography fontWeight="bold" className={classes.text}>
                          {" "}
                          {key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                        </Typography>
                        <TextInput
                          value={props.data[key] || 0}
                          name={key}
                          onChange={props.formik.handleChange}
                          type="number"
                          placeholder={key}
                        />
                      </div>
                    )
                )}
              </Grid>
            </AccordionDetails>
          ))
        }
      </Accordion>
    </div>
  );
}

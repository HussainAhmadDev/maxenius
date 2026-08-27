import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      border: "1px solid #E6EBEE",
      height: "339px", // head = 40px, body = 289 px
      borderRadius: "6px"
    },
    listHeader: {
      padding: "10px 10px",
      backgroundColor: theme.palette.gray[1000],
      display: "flex",
      justifyContent: "space-between"
    },
    listBody: {
      padding: "0 10px",
      height: "299px",
      overflowY: "scroll"
    },
    listRow: {
      padding: "5px 0px",
      borderBottom: "1px solid #E6EBEE",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: theme.palette.gray[500],
      fontSize: "12px",
      cursor: "pointer"
    },
    redField: {
      color: theme.palette.primary.main,
      cursor: "pointer"
    }
  })
);

const FilterList: React.FC<{
  onRowClicked?: (row: { id: string; text: string }) => void;
  headingText: string;
  headingButtonText?: string;
  handleHeadingButton?: () => void;
  icon?: React.ReactElement;
  data?: Array<{ id: string; text: string }>;
}> = ({
  headingText,
  headingButtonText,
  handleHeadingButton,
  onRowClicked,
  icon,
  data
}) => {
  const classes = useStyles();
  return (
    <div className={classes.listContainer}>
      <div className={classes.listHeader}>
        <span>{headingText}</span>
        <span className={classes.redField} onClick={handleHeadingButton}>
          {headingButtonText}
        </span>
      </div>
      <div className={classes.listBody}>
        {data?.map(row => (
          <div
            key={row.id}
            className={classes.listRow}
            onClick={e => {
              onRowClicked?.(row);
            }}
          >
            <span>{row.text}</span>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterList;

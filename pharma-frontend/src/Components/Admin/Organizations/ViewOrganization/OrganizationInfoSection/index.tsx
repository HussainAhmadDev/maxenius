import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import OrganizationInfo from "./OrganizationInfo";
import { Organization } from "Interfaces/Org";

interface Props {
  data: Organization | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "20px"
    },
    taxEmpMainDiv: {
      marginTop: "2%"
    },
    taxEmpContainer: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "2%",
      padding: "3%"
    },
    label: {
      marginBottom: "8px"
    }
  })
);
const OrganizationInfoSection: React.FC<Props> = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <OrganizationInfo data={data} />
    </div>
  );
};

export default OrganizationInfoSection;

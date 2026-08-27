import * as React from "react";
import { Radio, Typography } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { ModalInterface } from "../../Interfaces/ModalInterface";
import ModalPopUp from "../ModalPopup";
import Button from "../Button";
import MuiIcon from "../icons/MuiIcons";
import Advocacy3 from "../../Assets/images/advocacy3.png";
import { useOrganizations } from "../../Hooks/useOrgs";
import { useOrg } from "../../Context/OrgContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      overflowY: "scroll",
      maxHeight: "500px",
      minHeight: "300px"
    },
    orgDiv: {
      borderRadius: "6px",
      display: "flex",
      alignItems: "center"
    },
    checkedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.primary.main}`,
      marginRight: "5px",
      width: "100%",
      marginBottom: theme.spacing(2),
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "space-between"
    },
    unCheckedType: {
      borderRadius: "6px",
      border: `2px solid ${theme.palette.gray[300]}`,
      marginRight: "5px",
      width: "100%",
      color: theme.palette.gray[400],
      marginBottom: theme.spacing(2),
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "space-between"
    },
    flex: { display: "flex", alignItems: "center" },
    imageDiv: {
      borderRadius: "6px",
      padding: theme.spacing(0.5),
      border: `1px solid ${theme.palette.gray[700]}`
    },
    redText: {
      color: theme.palette.primary.main
    }
  })
);

const SwtichOrgModal: React.FC<ModalInterface> = props => {
  const classes = useStyles();
  const { data: organizations } = useOrganizations();
  const defaultOrg =
    organizations?.results?.find(org => org?.is_default)?.id ||
    organizations?.results[0].id ||
    "";
  const { activeOrg, setActiveOrg } = useOrg();

  const handleChangeOrg = (id: string) => {
    setActiveOrg(id);
  };

  React.useEffect(() => {
    const local = localStorage.getItem("org");
    if (local) {
      setActiveOrg(local);
    } else if (defaultOrg) setActiveOrg(defaultOrg);
  }, [defaultOrg, setActiveOrg]);

  return (
    <div>
      <ModalPopUp
        maxWidth="sm"
        modalTitle={props.title}
        saveBtnText={props.saveText}
        checkBox={props.checkBox}
        {...props}
      >
        <div className={classes.root}>
          {organizations?.results.map(org => (
            <div key={org?.id} className={classes.orgDiv}>
              <div
                className={org?.is_active ? classes.checkedType : classes.unCheckedType}
              >
                <div className={classes.flex}>
                  <Radio
                    checked={org?.id === activeOrg}
                    onChange={() => handleChangeOrg(org?.id)}
                    value={org?.id}
                    name="radio-button-demo"
                    inputProps={{ "aria-label": "Select Organization" }}
                  />
                  <div className={classes.flex}>
                    <div className={classes.imageDiv}>
                      <img
                        height="50"
                        width="50"
                        src={org?.logo || Advocacy3}
                        alt={org?.name}
                      />
                    </div>
                    &nbsp;&nbsp;
                    <Typography variant="subtitle1">{org?.name}</Typography>
                  </div>
                </div>
                <div>
                  <Button
                    onlyIcon={true}
                    type="secondary"
                    size="small"
                    icon={<MuiIcon icon="edit" fontSize="small" />}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalPopUp>
    </div>
  );
};

export default SwtichOrgModal;

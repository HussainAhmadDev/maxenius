import * as React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar } from "@material-ui/core";
import TextInput from "../../../Form/TextInput";
import Button from "../../../Button";
import FbLogo from "../../../../Assets/images/fb.png";
import TwitterLogo from "../../../../Assets/images/twitter.png";
import PintrestLogo from "../../../../Assets/images/pintrest.png";
import LinkdinLogo from "../../../../Assets/images/linkdin.png";
import InstagramLogo from "../../../../Assets/images/insta.png";
import TiktokLogo from "../../../../Assets/images/tiktok.png";
import OrganizationModal from "./OrganizationModals";
import { useModal } from "../../../../Hooks/useModal";
import { BrandsPropsInterface } from "Interfaces/Brands";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1),
      width: "100%"
    },

    headingSection: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    },
    assignBtn: {
      margin: theme.spacing(2),
      marginLeft: theme.spacing(3)
    },
    fullWidth: {
      width: "100%"
    },
    orgDiv: {
      background: theme.palette.gray[100],
      border: `0.5px solid ${theme.palette.gray[300]}`,
      borderRadius: "6px",
      color: theme.palette.gray[300],
      padding: theme.spacing(3)
    }
  })
);

const AddUserRole: React.FC<BrandsPropsInterface> = ({
  errors,
  handleChange,
  values,
  setFieldValue,
  touched
}) => {
  const classes = useStyles();
  const { handleSave, handleModalOpen, handleModalClose, modalOpen } = useModal({
    onSave: () => {
      //
    }
  });

  return (
    <div>
      <OrganizationModal
        saveText="Confirm Organization"
        title="Assign Organization"
        handleSaveChanges={handleSave}
        handleCloseModal={handleModalClose}
        openModal={modalOpen}
      />
      <div className={classes.headingSection}>
        <Typography variant="h6">Social Media</Typography>
      </div>

      <div>
        <Typography variant="body1">Twitter URL</Typography>
        <div className={classes.flex}>
          <Avatar src={TwitterLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="twitter"
              value={values.twitter}
              onChange={handleChange}
              placeholder="www.twitter.com/orgName"
              error={touched.twitter && Boolean(errors.twitter)}
              helperText={touched.twitter && errors.twitter}
            />
          </div>
        </div>

        <Typography variant="body1">Facebook URL</Typography>
        <div className={classes.flex}>
          <Avatar src={FbLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="facebook"
              value={values.facebook}
              onChange={handleChange}
              placeholder="www.facebook.com/orgName"
              error={touched.facebook && Boolean(errors.facebook)}
              helperText={touched.facebook && errors.facebook}
            />
          </div>
        </div>

        <Typography variant="body1">Pintrest URL</Typography>
        <div className={classes.flex}>
          <Avatar src={PintrestLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="pinterest"
              value={values.pinterest}
              onChange={handleChange}
              placeholder="www.pinterest.com/orgName"
              error={touched.pinterest && Boolean(errors.pinterest)}
              helperText={touched.pinterest && errors.pinterest}
            />
          </div>
        </div>

        <Typography variant="body1">Linkdin URL</Typography>
        <div className={classes.flex}>
          <Avatar src={LinkdinLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="linkdin"
              value={values.linkdin}
              onChange={handleChange}
              placeholder="www.linkdin.com/orgName"
              error={touched.linkdin && Boolean(errors.linkdin)}
              helperText={touched.linkdin && errors.linkdin}
            />
          </div>
        </div>

        <Typography variant="body1">Instagram URL</Typography>
        <div className={classes.flex}>
          <Avatar src={InstagramLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="instagram"
              value={values.instagram}
              onChange={handleChange}
              placeholder="www.instagram.com/orgName"
              error={touched.instagram && Boolean(errors.instagram)}
              helperText={touched.instagram && errors.instagram}
            />
          </div>
        </div>
        <Typography variant="body1">TikTok URL</Typography>
        <div className={classes.flex}>
          <Avatar src={TiktokLogo} />
          &nbsp;&nbsp;
          <div className={classes.fullWidth}>
            <TextInput
              type="text"
              name="tiktok"
              value={values.tiktok}
              onChange={handleChange}
              placeholder="www.tiktok.com/orgName"
              error={touched.tiktok && Boolean(errors.tiktok)}
              helperText={touched.tiktok && errors.tiktok}
            />
          </div>
        </div>
      </div>
      <div className={classes.headingSection}>
        <Typography variant="h6">Organization</Typography>
      </div>
      <Typography variant="body1">Parent Organization</Typography>
      <br />
      <div className={classes.orgDiv}>No Organization Assigned</div>
      <br />
      <Button
        type="secondary"
        onClick={handleModalOpen}
        text="Assign Organization"
        size="small"
      />
    </div>
  );
};

export default AddUserRole;

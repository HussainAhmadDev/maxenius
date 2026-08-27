import * as React from "react";
import { Typography, Avatar } from "@material-ui/core";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import FbLogo from "../../../../../Assets/images/fb.png";
import TwitterLogo from "../../../../../Assets/images/twitter.png";
import PintrestLogo from "../../../../../Assets/images/pintrest.png";
import LinkdinLogo from "../../../../../Assets/images/linkdin.png";
import InstagramLogo from "../../../../../Assets/images/insta.png";
import TiktokLogo from "../../../../../Assets/images/tiktok.png";
import { Organization } from "Interfaces/Org";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "10px"
    },
    infoSection: {
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      padding: "15px",
      marginTop: "10px"
    },
    activeLabel: {
      background: theme.palette.gray[200],
      borderRadius: "6px",
      padding: "5px",
      fontSize: "12px"
    },
    iconSection: {
      display: "flex",
      alignItems: "center",
      float: "right"
    },
    customerDetailSection: {
      marginTop: "20px"
    },
    label: {
      marginBottom: "8px"
    },
    infoItem: {
      marginBottom: theme.spacing(3)
    },
    userImageDiv: {
      padding: theme.spacing(2),
      height: "330px"
    },
    organizationDiv: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: theme.spacing(1),
      background: theme.palette.gray[1000],
      borderRadius: "6px"
    },
    orgName: {
      color: theme.palette.primary.main,
      paddingLeft: theme.spacing(1)
    },
    redText: {
      color: theme.palette.primary.main
    },
    flex: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1),
      width: "100%"
    },

    fullWidth: {
      width: "100%"
    },
    socialDiv: {
      marginBottom: theme.spacing(2)
    }
  })
);

interface Props {
  data: Organization | undefined;
}

const BrandSocial: React.FC<Props> = ({ data }) => {
  const classes = useStyles();
  const Socials = [
    {
      title: "Twitter",
      url: data?.twitter,
      image: TwitterLogo
    },
    {
      title: "Facebook",
      url: data?.facebook,
      image: FbLogo
    },
    {
      title: "Pintrest",
      url: data?.pinterest,
      image: PintrestLogo
    },
    {
      title: "Linkdin",
      url: data?.linkedin,
      image: LinkdinLogo
    },
    {
      title: "Instagram",
      url: data?.instagram,
      image: InstagramLogo
    },
    {
      title: "Tiktok",
      url: data?.tiktok,
      image: TiktokLogo
    }
  ];
  return (
    <div className={classes.root}>
      <Typography variant="h6">Social Media</Typography>
      <div className={classes.infoSection}>
        {Socials?.map(social => (
          <>
            {social && (
              <div key={social.title} className={classes.socialDiv}>
                <Typography variant="body1">{social.title} URL</Typography>
                <div className={classes.flex}>
                  <Avatar src={social.image} />
                  &nbsp;&nbsp;
                  <div className={classes.fullWidth}>
                    <Typography variant="subtitle1">{social.url}</Typography>
                  </div>
                </div>
              </div>
            )}
          </>
        ))}
        {/* Info Section */}
      </div>
    </div>
  );
};

export default BrandSocial;

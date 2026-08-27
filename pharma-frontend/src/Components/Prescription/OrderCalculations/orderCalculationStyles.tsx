import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },
    container: {
      background: theme.palette.gray[100],
      border: `1px solid ${theme.palette.gray[700]}`,
      borderRadius: "6px",
      marginTop: "20px"
    },
    subContainer: {
      padding: "10px",
      paddingRight: "20px",
      paddingLeft: "20px"
      // minHeight: "370px"
    },
    content: {
      textAlign: "center",
      borderBottom: `1px solid ${theme.palette.gray[700]}`,
      paddingBottom: "15px"
    },
    label: {
      color: theme.palette.gray[500],
      width: "50%",
      textAlign: "right",
      marginRight: "8px",
      marginBottom: "5px"
    },
    amount: {
      color: theme.palette.text.primary,
      width: "50%",
      marginBottom: "5px"
    },
    textDiv: {
      display: "flex",
      textAlign: "center",
      margin: "auto",
      lineHeight: "1"
    },
    textDivBlock: {
      lineHeight: "1",
      display: "flex",
      textAlign: "center",
      margin: "auto",
      background: "white",
      border: `0.5px solid ${theme.palette.gray[200]}`,
      borderRadius: "6px"
    },
    markProductDiv: {
      alignItems: "center",
      display: "flex",
      padding: "10px"
    },
    footerSection: {},
    markText: {
      color: theme.palette.gray[1200],
      marginLeft: "10px"
    },
    taxExempted: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      fontWeight: 600
    }
  })
);
export default useStyles;

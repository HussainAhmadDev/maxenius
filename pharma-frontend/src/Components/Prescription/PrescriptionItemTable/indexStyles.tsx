import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tb: {
      border: "1px solid red"
    },

    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    tHead: { borderCollapse: "collapse" },
    tableBody: {
      // overflowX: "auto"
    },
    tableHeader: {
      background: theme.palette.gray[1000],
      borderRadius: "6px 6px 0px 0px",
      height: "52px",
      color: theme.palette.gray[500],
      fontSize: "12px"
    },
    tableCell: {
      padding: "17px",
      width: "150px",
      textAlign: "center"
    },
    tableCellSku: {
      padding: "17px",
      width: "200px",
      textAlign: "left"
    },
    tableTitle: {
      fontSize: "21px",
      marginBottom: "20px",
      marginTop: "50px"
    },
    chip: {
      border: `0.5px solid ${theme.palette.gray[1500]}`,
      background: theme.palette.gray[1400],
      borderRadius: "2px",
      padding: "5px",
      color: theme.palette.gray[1500]
    },
    productNameSku: {
      maxWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },
    productName: {
      minWidth: "200px",
      lineHeight: "18px",
      color: theme.palette.primary.main,
      textAlign: "left"
    },
    tableIcon: {
      cursor: "pointer"
    },
    iconCell: {
      display: "flex"
    },
    addProductDiv: {
      display: "flex"
    },
    childBtn: {
      marginRight: "10px"
    }
  })
);
export default useStyles;

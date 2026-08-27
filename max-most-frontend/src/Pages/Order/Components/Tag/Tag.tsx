import React from "react";
// import { makeStyles } from "@mui/styles";
import { Chip } from "@mui/material";

interface TagProps {
  category: string;
}

// const useStyles = makeStyles({
//   tag: {
//     fontSize: "0.75rem",
//     borderRadius: "999px"
//   }
// });

const Tag: React.FC<TagProps> = ({ category }) => {
  // const classes = useStyles();

  return (
    <Chip
      label={category}
      // className={classes.tag}
      color="primary" // Adjust color as needed
      clickable
    />
  );
};

export default Tag;

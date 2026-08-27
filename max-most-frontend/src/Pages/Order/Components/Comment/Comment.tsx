import React from "react";
import { Typography, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface CommentProps {
  id: string;
  comment: string;
  editComment: (id: string) => void;
  deleteComment: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({ id, comment, editComment, deleteComment }) => {
  const handleClickEdit = () => {
    editComment(id);
  };

  const handleClickDelete = () => {
    deleteComment(id);
  };

  return (
    <>
      <Typography
        variant="body1"
        className="py-3 px-2 bg-white text-[#1d284c] rounded-lg shadow-[0_1px_0px_rgba(9,30,66,0.3)]"
      >
        {comment}
      </Typography>
      <div className="pl-2 mt-1 text-[12px] flex gap-1">
        <Button className="underline" onClick={handleClickEdit} startIcon={<EditIcon />}>
          Edit
        </Button>{" "}
        •
        <IconButton onClick={handleClickDelete} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    </>
  );
};

export default Comment;

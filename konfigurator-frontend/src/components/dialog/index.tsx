import React from 'react';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

const Backdrop = styled('div')({
  backdropFilter: 'blur(8px)',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',

  zIndex: 1000,
});

interface DialogBoxProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DialogBox: React.FC<DialogBoxProps> = ({ open, onClose, children }) => {
  const handleClose = () => onClose();

  return (
    <React.Fragment>
      {open && <Backdrop />}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {children}
      </Dialog>
    </React.Fragment>
  );
};

export default DialogBox;

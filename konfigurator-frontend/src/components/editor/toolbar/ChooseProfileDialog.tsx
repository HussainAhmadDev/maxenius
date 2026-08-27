import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, styled, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTheme } from '@mui/material/styles';

import { languageData } from '@/constants';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  color: theme.palette.common.black,
  width: '100%',
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  profileSelectionHandler: (val: number) => void;
}
const ChooseProfileDialog: React.FC<Props> = ({
  open,
  handleClose,
  profileSelectionHandler,
}: Props) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <StyledDialog
        maxWidth={false}
        open={open}
        PaperProps={{
          sx: {
            maxWidth: 500,
            padding: '2rem',
            backgroundColor: theme.palette.common.white,
          },
        }}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8, width: 50, height: 50 }}
          aria-label="Close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        {/* <DialogTitle id="alert-dialog-title" color={theme.palette.common.black}>
        If you want to edit a previous state. All current changes in this state will be lost. 
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography sx={{ fontWeight: 500, color: 'black' }}>
              {languageData.editor.dailogs.chooseProfile.text}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-evenly' }}>
          {[
            { name: '2m', value: 2 },
            { name: '3m', value: 3 },
            { name: '4m', value: 4 },
            { name: '5m', value: 5 },
            { name: 'auto', value: -1 },
          ].map((profile) => (
            <Button
              key={profile.name}
              onClick={() => profileSelectionHandler(profile.value)}
              variant="contained"
              color="secondary"
              sx={{ textTransform: 'capitalize' }}
            >
              {profile.name}
            </Button>
          ))}
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  );
};

export default ChooseProfileDialog;

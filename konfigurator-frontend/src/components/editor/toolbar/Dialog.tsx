import * as React from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, styled, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useTheme } from '@mui/material/styles';

import { languageData } from '@/constants';
import { rpcs } from '@/services/customFunctions';
import { supabaseClient as supabase } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';
import { useEditorStore } from '@/store/EditorStore';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  color: theme.palette.common.black,
  width: '100%',
}));

interface Props {
  open: boolean;
  tool: number;
  handleClose: () => void;
}
const AlertDialog: React.FC<Props> = ({ open, tool, handleClose }: Props) => {
  const { floorPlan } = useEditorStore();
  const theme = useTheme();
  const { session } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [duplicateLoading, setDuplicateLoading] = React.useState(false);

  const discardProfile = () => {
    if (floorPlan) {
      floorPlan.autoProfiles = [];
      floorPlan.autoProfileGeometry = null;
      floorPlan.autoProfiles = [];
      floorPlan.autoProfilesCompact = [];
      floorPlan.autoProfiles = [];
      floorPlan.autoProfilesCompact = [];
      floorPlan.autoProfileGeometryLineTypes = [];
      useEditorStore.setState({ lockedProfile: false });
      floorPlan.tool = tool === 2 ? 1 : tool;
    }
    return handleClose();
  };
  const handleDuplicateProject = async () => {
    try {
      setDuplicateLoading(true);
      const { error } = await supabase.rpc(rpcs.duplicate_complete_project, {
        p_project_id: Number(id)!,
        p_user_id: session?.user.id,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(languageData.toastMessage.success.duplicated);
      navigate('/dashboard/all-projects');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(languageData.toastMessage.error.common);
      }
    } finally {
      setDuplicateLoading(false);
    }
  };
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
              {languageData.editor.dailogs.discard.text}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-evenly' }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'capitalize' }}
            onClick={handleDuplicateProject}
            disabled={duplicateLoading}
          >
            {languageData.editor.dailogs.discard.buttons.duplicate}
          </Button>
          <Button
            onClick={discardProfile}
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'capitalize' }}
          >
            {languageData.editor.dailogs.discard.buttons.confirm}
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="secondary"
            sx={{ textTransform: 'capitalize' }}
          >
            {languageData.editor.dailogs.discard.buttons.cancel}
          </Button>
        </DialogActions>
      </StyledDialog>
    </React.Fragment>
  );
};

export default AlertDialog;

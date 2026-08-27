import { FC } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, IconButton, styled } from '@mui/material';

import { languageData } from '@/constants';
import { useEditorStore } from '@/store/EditorStore';

const DeleteIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: 'white',
  height: '36.5px',
  borderRadius: '8px',
  mx: '5px',
  textTransform: 'capitalize',
  ':hover': {
    backgroundColor: theme.palette.background.default,
  },
}));

interface StraightLineActionsProps {
  setIsSidebarOpen: (val: boolean) => void;
}
const StraightLineActions: FC<StraightLineActionsProps> = ({ setIsSidebarOpen }) => {
  const { floorPlan } = useEditorStore();
  const handleSplitProfile = async () => {
    if (floorPlan && floorPlan.changingProfile) {
      await floorPlan.splitProfile();
      setIsSidebarOpen(false);
    }
  };
  const {
    editor: {
      pdf: { buttons },
    },
  } = languageData;
  return (
    <>
      <Box sx={{ m: '1rem' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            floorPlan?.setProfileChanges();
            setIsSidebarOpen(false);
          }}
          sx={{ mx: '10px', textTransform: 'capitalize' }}
        >
          {buttons.confirm}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSplitProfile}
          sx={{ mx: '10px', textTransform: 'capitalize' }}
        >
          {buttons.split}
        </Button>

        <DeleteIconButton
          onClick={() => {
            floorPlan?.removeProfile();
            setIsSidebarOpen(false);
          }}
        >
          <DeleteOutlineOutlinedIcon fill="white" />
        </DeleteIconButton>
      </Box>
    </>
  );
};

export default StraightLineActions;

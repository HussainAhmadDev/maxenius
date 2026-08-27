import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useNavigation, useParams } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import _ from 'lodash';

import { lockProject } from '@/services/projects';
import { SupabaseTableNames } from '@/services/queries';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';
import { useEditorStore } from '@/store/EditorStore';

import { zoom } from '../others';

import PointerIcon from './icons/PointerIcon';
import RedoIcon from './icons/RedoIcon';
import UndoIcon from './icons/UndoIcon';
import ChooseProfileDialog from './ChooseProfileDialog';
import AlertDialog from './Dialog';

type LoadingType = 'saving' | 'generatePDF' | 'lock';
const ToolbarActions = () => {
  const {
    floorPlan,
    canvasInstance,
    zoomVal,
    projectFile,
    setProjectData,
    lockedProfile,
    setIsSidebarOpen,
  } = useEditorStore();
  const [loadingType, setLoadingType] = useState<null | LoadingType>(null);
  const { id } = useParams();
  const { userRole } = useAuthStore();
  const { state } = useNavigation();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({
    open: false,
    tool: 1,
    profileSelectionModal: false,
    selectedProfile: 0,
  });

  const [saveCloud, setSaveCloud] = useState<boolean>(false);
  const toggleSaveCloud = () => {
    if (saveCloud) {
      setTimeout(() => {
        setSaveCloud(!saveCloud); // Corrected from !lock to !saveCloud
      }, 1000);
    } else {
      setSaveCloud(!saveCloud);
    }
  };

  const generatePDFHandler = async () => {
    if (!floorPlan) {
      return;
    }

    useEditorStore.setState({ zoomVal: 1, cameraPosition: { x: 0, y: 0 } });
    setLoadingType('saving');
    setIsSidebarOpen(false);

    const newFile = await floorPlan.export();
    const newData = JSON.parse(newFile);

    const isNoChanges = _.isEqual(projectFile, newData);

    if (isNoChanges && newData?.pdf.length > 0) {
      navigate('pdf');
      setLoadingType(null);
      return;
    }

    await floorPlan.addPDF();
    const updatedFile = await floorPlan.export();
    const updatedData = JSON.parse(updatedFile);

    await supabaseClient
      .from(SupabaseTableNames.project)
      .update({ file: updatedData })
      .eq('id', id)
      .single();

    navigate('pdf');
    setLoadingType(null);
  };
  const toolSelectionHandler = (tool: number) => {
    if (floorPlan?.autoProfiles && floorPlan?.autoProfiles.length > 0) {
      setDialog((prev) => ({ ...prev, open: true, tool }));
      return;
    } else {
      return floorPlan?.setTool(tool);
    }
  };
  const saveProjectHandler = async () => {
    if (!floorPlan) {
      toast.error('Floor plan is not available. Cannot save project.');
      return;
    }
    setLoadingType('saving');
    useEditorStore.setState({ zoomVal: 1 });
    try {
      const file = await floorPlan.export();
      const { error, status, data } = await supabaseClient
        .from(SupabaseTableNames.project)
        .update({
          file: JSON.parse(file),
        })
        .eq('id', id)
        .select('*')
        .single();
      if (error) {
        toast.error(error.message);
        setLoadingType(null);
        return;
      }
      if (status === 200) {
        toast.success('Project saved successfully');
        setProjectData(data);
      }
      setLoadingType(null);
    } catch (err) {
      toast.error(
        'An error occurred while saving the project. Please ensure that your generated profiles are correct.',
      );
      setLoadingType(null);
    }
  };

  const profileSelectionHandler = async (profile: number) => {
    await floorPlan?.setTool(2, profile.toString());
    setDialog((prev) => ({ ...prev, profileSelectionModal: false }));
    useEditorStore.setState({ lockedProfile: true });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AppBar
        sx={{
          width: '720px',
          mx: 'auto',
          backgroundColor: 'white',
          left: 0,
          top: 33,
          right: 0,
          zIndex: 1000,
          p: 0,
          borderRadius: '15px',
          '& .MuiToolbar-root': {
            minHeight: 'auto',
          },
        }}
        id="canvas-toolbar"
      >
        <AlertDialog
          open={dialog.open}
          tool={dialog.tool}
          handleClose={() => setDialog((prev) => ({ ...prev, open: !prev }))}
        />
        <ChooseProfileDialog
          open={dialog.profileSelectionModal}
          profileSelectionHandler={profileSelectionHandler}
          handleClose={() =>
            setDialog((prev) => ({
              ...prev,
              profileSelectionModal: !prev.profileSelectionModal,
            }))
          }
        />
        <Toolbar
          sx={{
            gap: '1rem',
            m: 0,
            p: 0,
            minHeight: '45px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '15px',
          }}
        >
          <Box
            sx={{
              borderRight: '1px solid black',
              p: 0,
              pr: 0.5,
            }}
          >
            <Link to="/">
              <IconButton edge="start" sx={{ color: 'black' }} aria-label="menu">
                <HomeRoundedIcon />
              </IconButton>
            </Link>
          </Box>
          <Box
            sx={{
              borderRight: '1px solid black',
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              pr: 1.5,
              ml: -1,
            }}
          >
            <IconButton>
              <PointerIcon />
            </IconButton>
            <IconButton
              onClick={() => toolSelectionHandler(0)}
              edge="start"
              sx={{ color: 'black' }}
              aria-label="menu"
            >
              <img
                src={`/icons/editor/toolbar/${lockedProfile ? 'lockedInnerWall' : 'innerWall'}.svg`}
                alt="innerWall"
              />
            </IconButton>
            <IconButton
              onClick={() => toolSelectionHandler(1)}
              edge="start"
              sx={{ color: 'black' }}
              aria-label="menu"
            >
              <img
                src={`/icons/editor/toolbar/${lockedProfile ? 'lockedOuterWall' : 'outerWall'}.svg`}
                alt="innerWall"
              />
            </IconButton>
            <IconButton
              onClick={() => {
                if (floorPlan?.autoProfiles && floorPlan?.autoProfiles.length > 0) {
                  setDialog((prev) => ({ ...prev, open: true, tool: 2 }));
                } else {
                  setDialog((prev) => ({ ...prev, profileSelectionModal: true }));
                }
              }}
              edge="start"
              sx={{ color: 'black', width: '32px', height: '29px' }}
              aria-label="menu"
            >
              <img
                src={`/icons/editor/toolbar/${lockedProfile ? 'lockedProfile' : 'profile'}.svg`}
                alt="innerWall"
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              ml: -1.3,
              borderRight: '1px solid black',
              pr: 1.1,
            }}
          >
            {loadingType === 'generatePDF' || state === 'loading' ? (
              <IconButton>
                <CircularProgress color="secondary" size={24} />
              </IconButton>
            ) : (
              <IconButton onClick={generatePDFHandler}>
                <img src="/icons/editor/toolbar/pdf.svg" alt="pdf" />
              </IconButton>
            )}
            <IconButton>
              <img src="/icons/editor/toolbar/3d.svg" alt="3d" />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid black',
              ml: -1.8,
              pr: 0.5,
            }}
            className="btn-group mr-2"
            role="group"
          >
            <IconButton
              onClick={() =>
                zoom('out', 0.1, canvasInstance.width / 2, canvasInstance.height / 2)
              }
            >
              <RemoveOutlinedIcon />
            </IconButton>
            <Typography color="black">{(zoomVal * 100).toFixed()}%</Typography>
            <IconButton
              onClick={() =>
                zoom('in', 0.1, canvasInstance.width / 2, canvasInstance.height / 2)
              }
            >
              <AddOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              py: 0.8,
              height: '100%',
              borderRight: '1px solid black',
              pr: 1,
              pl: 0.5,
            }}
          >
            <IconButton
              onClick={() => {
                return floorPlan?.undo();
              }}
              edge="start"
              sx={{ color: 'black' }}
              aria-label="menu"
            >
              <UndoIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                return floorPlan?.redo();
              }}
              edge="start"
              sx={{ color: 'black' }}
              aria-label="menu"
            >
              <RedoIcon />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              onClick={() => {
                return floorPlan?.redo();
              }}
              edge="start"
              sx={{ color: 'black' }}
              aria-label="menu"
            >
              <RestoreIcon />
            </IconButton>
          </Box>
          {userRole === 'outer_sales_agent' && (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                height: '100%',
                borderRight: '1px solid black',
                pr: 0.8,
              }}
            >
              <IconButton
                onClick={async () => {
                  setLoadingType('lock');
                  await lockProject(id!);
                  navigate('/dashboard/all-projects');
                  setLoadingType(null);
                }}
                edge="start"
                sx={{ color: 'black' }}
                aria-label="toggle-lock"
              >
                {loadingType === 'lock' ? (
                  <CircularProgress color="secondary" size={30} />
                ) : (
                  <LockOpenIcon />
                )}
              </IconButton>
            </Box>
          )}

          <Box
            onClick={toggleSaveCloud}
            sx={{
              mr: -1.3,
              ml: -1.4,
            }}
          >
            {loadingType === 'saving' ? (
              <CircularProgress color="secondary" size={30} />
            ) : (
              <IconButton onClick={saveProjectHandler}>
                <img src="/icons/editor/toolbar/save.svg" alt="save" />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default ToolbarActions;

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { languageData } from '@/constants';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';

export default function AccountMenu() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const user = session?.user;
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box sx={{ p: 1 }}>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter} // Added onMouseEnter
        // Added onMouseLeave
        sx={{
          width: '100%',
          justifyContent: 'left',
          borderRadius: '0',
          pt: '20px',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Avatar sx={{ width: 22, height: 22 }}>{'A'}</Avatar>
        <Typography color="white" ml={1} noWrap>
          {user?.email}
        </Typography>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="auto"
        transition
        disablePortal
        sx={{ width: '100%' }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
              borderRadius: '0',
              backgroundColor: theme.palette.secondary.main,
            }}
          >
            <Paper>
              {/* Set your desired width here */}
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  sx={{ py: 0 }}
                >
                  <MenuItem
                    sx={{
                      mb: '1px',
                      py: 1.6,
                      px: 2,
                    }}
                  >
                    {languageData.dashboard.sidebar.resetPassword}
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      supabaseClient.auth.signOut().then(() => {
                        useAuthStore.setState({ session: null, userRole: null });
                        navigate('/auth');
                      })
                    }
                    sx={{
                      py: 1.6,
                      px: 2,
                    }}
                  >
                    {languageData.dashboard.sidebar.logout}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

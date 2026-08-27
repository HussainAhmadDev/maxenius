import { NavLink, useLocation } from 'react-router-dom';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import AccountMenu from '../../../components/user/accountMenu';

import sidebarConfig from './SidebarConfig';
const appBarHeight = '64px';

const Sidebar = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  return (
    <Stack
      sx={{
        height: `calc(100% - ${appBarHeight})`,
        background: theme.palette.secondary.main,
        justifyContent: 'space-between',
      }}
    >
      <Box mt={3}>
        <List>
          {sidebarConfig.map((item) => (
            <ListItem key={item.title} disablePadding>
              <NavLink
                to={item.path}
                style={{ textDecoration: 'none', color: 'white', width: '100%' }}
              >
                <ListItemButton selected={pathname.includes(item.path)}>
                  <ListItemIcon>
                    <StarSharpIcon sx={{ fill: 'white', opacity: 0.56 }} />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <AccountMenu />
      </Box>
    </Stack>
  );
};

export default Sidebar;

import { AppBar, Toolbar, Typography } from '@mui/material';

import { languageData } from '@/constants';

const DashboardHeader = () => {
  const { header } = languageData.dashboard;
  return (
    <AppBar component="nav">
      <Toolbar>
        <Typography
          variant="body1"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          {header.superUserMessage}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;

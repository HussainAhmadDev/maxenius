import { Dispatch, SetStateAction, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, IconButton, TextField, Toolbar } from '@mui/material';

import { languageData } from '@/constants';

import ProjectForm from '../form/projectForm';

function TableHeader({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { table } = languageData.dashboard;
  return (
    <Toolbar
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          id="outlined-required"
          placeholder={table.search.placeholder}
          variant="outlined"
          label={table.search.label}
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          sx={{
            mr: 2,
            width: { md: 300 },
          }}
        />
        <FilterAltIcon />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          // onClick={handleClickOpen}
        >
          {table.action}
        </Button>
        <Button variant="contained" onClick={handleClickOpen}>
          {table.new}
        </Button>

        {/* <NewActionDialogBox open={open} onClose={handleClose} /> */}
        <ProjectForm open={open} onClose={handleClose} />

        <IconButton>
          <SettingsIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
    </Toolbar>
  );
}

export default TableHeader;

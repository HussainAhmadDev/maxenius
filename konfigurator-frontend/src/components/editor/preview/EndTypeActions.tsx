import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

import { useEditorStore } from '@/store/EditorStore';

import { FlexItems, MeasurementField, TypographyText } from './index.style';

const EndTypeActions = () => {
  const { floorPlan, setIsSidebarOpen } = useEditorStore();
  const [up, setUp] = useState<boolean>(floorPlan?.changingProfile.up);
  const [upLength, setUpLength] = useState<number>(floorPlan?.changingProfile.upLength);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setUp(checked);
    // onUpdateChangingProfile({ up: checked, upLength });
  };

  const handleUpLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setUpLength(value);
    // onUpdateChangingProfile({ up, upLength: value });
  };

  return (
    <Box sx={{ m: '1rem' }}>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={up}
              onChange={handleCheckboxChange}
              id="profileCheckbox"
              name="Checkboxes5"
            />
          }
          label={<TypographyText variant="h6">Aufkantung:</TypographyText>}
        />
      </Box>
      <FlexItems mb={2}>
        <div className="input-group-prepend">
          <TypographyText className="input-group-text">Höhe (mm)</TypographyText>
        </div>
        <MeasurementField
          className="form-control profileInputsC"
          type="number"
          inputProps={{
            step: '0.25',
            className: 'profileInputsC',
          }}
          value={upLength}
          onChange={handleUpLengthChange}
          id="profileUpLength"
        />
      </FlexItems>
      <Button
        variant="contained"
        color="secondary"
        onClick={async () => {
          await floorPlan?.setProfileChanges();
          setIsSidebarOpen(false);
        }}
      >
        Einstellen
      </Button>
    </Box>
  );
};

export default EndTypeActions;

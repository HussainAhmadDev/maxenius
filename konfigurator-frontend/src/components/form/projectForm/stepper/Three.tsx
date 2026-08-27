import React, { ChangeEvent } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { languageData } from '@/constants';

import NumberField from '../../NumberField';

import { coatingOptions, profileOptions } from './constants';

interface CustomerDataFormProps {
  formDataThree: {
    profile_type: number;
    def_col: string;
    specialColor: number;
    wallThickness: number;
    outer_W: number;
    inner_W: number;
    aMass: number;
    cMass: number;
    upLength: number;
    slope: number;
    material_thickness: number;
    halter: number;
  };
  handleChangeThree: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitThree: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Three: React.FC<CustomerDataFormProps> = ({ formDataThree, handleChangeThree }) => {
  const theme = useTheme();
  const customTextField = {
    margin: '12px 0px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey['700'],
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey['400'],
    },
    '& .MuiOutlinedInput-input': {
      height: '19px !important',
    },
  };

  const { labels } = languageData.form.profileData;

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: '5%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <FormControl
                sx={{
                  width: '100%',
                  ...customTextField,
                }}
              >
                <InputLabel id="demo-simple-select-label">{labels.profile}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formDataThree.profile_type.toString()}
                  label={labels.profile}
                  name="profile_type"
                  onChange={(e: SelectChangeEvent<string>) => {
                    handleChangeThree({
                      target: { name: e.target.name, value: e.target.value },
                    } as ChangeEvent<HTMLInputElement>);
                  }}
                  sx={{
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  {profileOptions.map((profile) => (
                    <MenuItem key={profile.name} value={profile.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          style={{ width: '30px', height: '30px' }}
                          src={profile.img}
                          alt=""
                        />
                        {profile.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <FormControl
                sx={{
                  width: '100%',
                  ...customTextField,
                }}
              >
                <InputLabel id="demo-simple-select-label">{labels.coating}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formDataThree.def_col}
                  label={labels.coating}
                  name="def_col"
                  defaultValue="default value"
                  onChange={(e: SelectChangeEvent<string>) =>
                    handleChangeThree({
                      target: { name: e.target.name, value: e.target.value },
                    } as ChangeEvent<HTMLInputElement>)
                  }
                  sx={{
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  {coatingOptions?.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                name="specialColor"
                label={labels.specialColor}
                value={formDataThree.specialColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.wallWidth}
                value={formDataThree.wallThickness}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
                name="wallThickness"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.externalOffset}
                value={formDataThree.outer_W}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
                name="outer_W"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.internalOffset}
                value={formDataThree.inner_W}
                name="inner_W"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.aDimension}
                value={formDataThree.aMass}
                name="aMass"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.cDimension}
                value={formDataThree.cMass}
                name="cMass"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.pitch}
                value={formDataThree.slope}
                name="slope"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.materialThickness}
                value={formDataThree.material_thickness}
                name="material_thickness"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.holder}
                value={formDataThree.halter}
                name="halter"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box>
              <NumberField
                label={labels.endCapTailLength}
                value={formDataThree.upLength}
                name="upLength"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeThree(e)}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Three;

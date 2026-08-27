import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  Tab,
  Tabs,
} from '@mui/material';

import { languageData } from '@/constants';
import { useEditorStore } from '@/store/EditorStore';

import { StyledSelect } from '../pdf/style';
import PreviewCanvas from '../preview';
import EndTypeActions from '../preview/EndTypeActions';
import ProfileMeasurements from '../preview/ProfileMeasurements';
import StraightLineActions from '../preview/StraightLineActions';

import { profilesData, profilesOptions } from './config';

type Tab = 'x' | 'y' | 'z';

const EditorSidebar = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { floorPlan, isSidebarOpen, setIsSidebarOpen, canvasInstance, profileData } =
    useEditorStore();
  const {
    editor: {
      pdf: {
        form: { sidebar },
        buttons,
      },
    },
  } = languageData;
  const methods = useForm({
    // values:,
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    if (floorPlan?.changingProfile) {
      setSelectedTab(0);
    }

    return () => {
      setSelectedTab(0);
    };
  }, [floorPlan?.changingProfile]);

  const calculateValue = useCallback(
    (value: number | undefined): string => {
      if (value === undefined) return '';
      return (
        1000 *
        canvasInstance.round(
          floorPlan?.autoProfileGeometry?.grid.toUnit(value) as number,
          5,
        )
      ).toString();
    },
    [canvasInstance, floorPlan?.autoProfileGeometry?.grid],
  );

  useEffect(() => {
    if (!floorPlan?.changingProfile || !floorPlan?.changingProfile?.parts) return;

    const parts = floorPlan.changingProfile.parts;
    const values = parts.map(({ length }: { length: number }) => calculateValue(length));
    const aMasses = parts.map(({ aMass }: { aMass: number }) => calculateValue(aMass));
    const wallWidths = parts.map(({ wallW }: { wallW: number }) => calculateValue(wallW));
    const inns = parts.map(({ inn }: { inn: number }) => calculateValue(inn));
    const outs = parts.map(({ out }: { out: number }) => calculateValue(out));
    const cMasses = parts.map(({ cMass }: { cMass: number }) => calculateValue(cMass));

    profilesData[0] = {
      name: parts[selectedTab]?.selectedProfile || 'profile0',
      data: {
        length: values[selectedTab],
        aMass: aMasses[selectedTab],
        wallW: wallWidths[selectedTab],
        out: outs[selectedTab],
        inn: inns[selectedTab],
        cMass: cMasses[selectedTab],
      },
    };
    useEditorStore.setState({
      profileData: { profiles: [], values, aMasses, wallWidths, inns, outs, cMasses },
    });
  }, [calculateValue, floorPlan, floorPlan?.changingProfile, selectedTab]);

  const onSubmit = async (data: any) => {
    // eslint-disable-next-line no-console
    console.log({ data });

    floorPlan?.setProfileChanges();
    setIsSidebarOpen(false);
  };

  const selectProfileHandler = (e: SelectChangeEvent<any>) => {
    const selectedProfile = profilesData.find(
      (profile) => profile.name === e.target.value,
    );
    if (!selectedProfile) {
      return;
    }

    const pt = e.target.value?.toString().split('profile')[1];

    if (!floorPlan) {
      return;
    }
    floorPlan.profile_type = +pt;

    const updatedValues: number[] = profileData.values;
    updatedValues[selectedTab] = +selectedProfile.data.length;

    const updatedAMasses: number[] = profileData.aMasses;
    updatedAMasses[selectedTab] = +selectedProfile.data.aMass;

    const updatedWallWidths: number[] = profileData.wallWidths;
    updatedWallWidths[selectedTab] = +selectedProfile.data.wallW;

    const updatedInns: number[] = profileData.inns;
    updatedInns[selectedTab] = +selectedProfile.data.inn;

    const updatedOuts: number[] = profileData.outs;
    updatedOuts[selectedTab] = +selectedProfile.data.out;

    const updatedCMasses: number[] = profileData.cMasses;
    updatedCMasses[selectedTab] = +selectedProfile.data.cMass;

    const updatedProfiles: string[] = profileData.profiles;
    updatedProfiles[selectedTab] = selectedProfile.name;

    useEditorStore.setState({
      profileData: {
        profiles: updatedProfiles,
        values: updatedValues,
        aMasses: updatedAMasses,
        wallWidths: updatedWallWidths,
        inns: updatedInns,
        outs: updatedOuts,
        cMasses: updatedCMasses,
      },
    });
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  type Directions = {
    0: 'x';
    1: 'y';
    2: 'z';
  };
  const directions: Directions = {
    0: 'x',
    1: 'y',
    2: 'z',
  };

  return (
    <Drawer
      hideBackdrop
      PaperProps={{
        sx: {
          backgroundColor: 'white',
          marginY: 'auto',
          mr: '2rem',
          mt: '2rem',
          height: 'calc(100% - 4rem)',
        },
        classes: { root: 'canvas-sidebar' },
      }}
      sx={{ position: 'inherit' }}
      anchor="right"
      open={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              backgroundColor: 'white !important',
            }}
            width={300}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <IconButton onClick={() => setIsSidebarOpen(false)}>
                <CloseSharpIcon fill="black" />
              </IconButton>
            </Box>
            <PreviewCanvas />

            <Box
              sx={{
                maxWidth: { xs: 320, sm: 480, mt: '1rem' },
                bgcolor: 'white',
              }}
            >
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ m: '1rem' }}
                aria-label="scrollable auto tabs example"
              >
                {floorPlan?.changingProfile?.parts?.map((_part: any, i: number) => {
                  const currentTab = directions[i as keyof Directions];
                  return <Tab key={i} label={currentTab} />;
                })}
              </Tabs>

              {floorPlan?.changingProfile?.parts?.map((_part: any, i: number) => {
                return (
                  <CustomTabPanel key={i} value={selectedTab} index={i}>
                    <StyledSelect
                      onChange={selectProfileHandler}
                      value={profileData.profiles[selectedTab] || 'profile0'}
                    >
                      <MenuItem value="">
                        <em>{sidebar.selectProfile}</em>
                      </MenuItem>
                      {profilesOptions?.map((profile) => (
                        <MenuItem key={profile.value} value={profile.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                              style={{ width: '30px', height: '30px' }}
                              src={profile.img}
                              alt=""
                            />
                            {profile.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </StyledSelect>
                    <ProfileMeasurements selectedTab={selectedTab} />
                  </CustomTabPanel>
                );
              })}
            </Box>

            {floorPlan?.changingProfile ? (
              floorPlan.changingProfile.type === 'Straight' ? (
                <StraightLineActions setIsSidebarOpen={setIsSidebarOpen} />
              ) : floorPlan.changingProfile.type === 'Angled' ? (
                !floorPlan.changingProfile.orientation ? (
                  <Box sx={{ m: '1rem' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      onClick={async () => {
                        await floorPlan?.setProfileChanges();
                        setIsSidebarOpen(false);
                      }}
                      sx={{ mx: '10px', textTransform: 'capitalize' }}
                    >
                      {buttons.confirm}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={async () => {
                        await floorPlan?.changeAngledProfileOrientation();
                        setIsSidebarOpen(false);
                      }}
                      sx={{ mx: '10px', textTransform: 'capitalize' }}
                    >
                      {buttons.sentenceOutside}
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ m: '1rem' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="submit"
                      onClick={() => floorPlan?.setProfileChanges()}
                      sx={{ mx: '10px', textTransform: 'capitalize' }}
                    >
                      {buttons.confirm}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        floorPlan?.changeAngledProfileOrientation();
                        setIsSidebarOpen(false);
                      }}
                      sx={{ mx: '10px', textTransform: 'capitalize' }}
                    >
                      {buttons.sentenceInside}
                    </Button>
                  </Box>
                )
              ) : floorPlan.changingProfile.type === 'End' ? (
                <EndTypeActions />
              ) : floorPlan.changingProfile.type === 'T-shape' ? (
                <Box sx={{ m: '0 1rem 1rem' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={() => floorPlan?.setProfileChanges()}
                    sx={{ mx: '10px', textTransform: 'capitalize' }}
                  >
                    {buttons.confirm}
                  </Button>
                </Box>
              ) : null
            ) : null}
          </Box>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default EditorSidebar;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

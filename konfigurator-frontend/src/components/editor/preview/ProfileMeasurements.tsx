import { ChangeEvent, FC } from 'react';
import { Box } from '@mui/material';

import { languageData } from '@/constants';
import { useEditorStore } from '@/store/EditorStore';

import { FlexItems, MeasurementField, TypographyText } from './index.style';

interface AxisFormProps {
  selectedTab: number;
}

const ProfileMeasurements: FC<AxisFormProps> = ({ selectedTab }: AxisFormProps) => {
  const { profileData, setProfileData } = useEditorStore();
  const {
    editor: {
      pdf: {
        form: { profile },
      },
    },
  } = languageData;
  return (
    <Box sx={{ mb: '2rem' }}>
      <Box sx={{ mt: '1rem' }}>
        <FlexItems>
          <TypographyText>Länge (mm):</TypographyText>
          <MeasurementField
            type="number"
            value={profileData.values[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.values];
              newValues[selectedTab] = +e.target.value;
              setProfileData({
                values: newValues,
              });
            }}
            inputProps={{
              className: 'profileInputs',
              // step: '25',
            }}
          />
        </FlexItems>
        <FlexItems>
          <TypographyText color="black">A-{profile.dimension} (mm):</TypographyText>
          <MeasurementField
            type="number"
            // {...register('aMass', { value: calculateValue(part.aMass) })}
            value={profileData.aMasses[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.aMasses];
              newValues[selectedTab] = +e.target.value;
              setProfileData({ aMasses: newValues });
            }}
            inputProps={{
              className: 'profileInputsA',
              // step: '25',
            }}
          />
        </FlexItems>
        <FlexItems>
          <TypographyText color="black">Mauerbreite (mm):</TypographyText>
          <MeasurementField
            type="number"
            // {...register('wallW', { value: calculateValue(part.wallW) })}
            value={profileData.wallWidths[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.wallWidths];
              newValues[selectedTab] = +e.target.value;
              setProfileData({ wallWidths: newValues });
            }}
            inputProps={{
              className: 'profileInputsB',
              // step: '25',
            }}
          />
        </FlexItems>
        <FlexItems>
          <TypographyText color="black">Überstand außen (mm):</TypographyText>
          <MeasurementField
            type="number"
            // {...register('out', { value: calculateValue(part.out) })}
            value={profileData.outs[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.outs];
              newValues[selectedTab] = +e.target.value;
              setProfileData({ outs: newValues });
            }}
            inputProps={{
              className: 'profileInputsB_Out',
              // step: '25',
            }}
          />
        </FlexItems>
        <FlexItems>
          <TypographyText color="black">Überstand innen (mm, Dachseite):</TypographyText>
          <MeasurementField
            type="number"
            // {...register('inn', { value: calculateValue(part.inn) })}
            value={profileData.inns[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.inns];
              newValues[selectedTab] = +e.target.value;
              setProfileData({ inns: newValues });
            }}
            inputProps={{
              className: 'profileInputsB_Inn',
              // step: '25',
            }}
          />
        </FlexItems>
        <FlexItems>
          <TypographyText color="black">C-{profile.dimension} (mm):</TypographyText>
          <MeasurementField
            type="number"
            // {...register('cMass', { value: calculateValue(part.cMass) })}
            value={profileData.cMasses[selectedTab]}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValues: number[] = [...profileData.cMasses];
              newValues[selectedTab] = +e.target.value;
              setProfileData({ cMasses: newValues });
            }}
            inputProps={{
              className: 'profileInputsC',
              // step: '25',
            }}
          />
        </FlexItems>
      </Box>
    </Box>
  );
};

export default ProfileMeasurements;

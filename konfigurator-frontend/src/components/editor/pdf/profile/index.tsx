import React from 'react';
import { FieldArrayWithId } from 'react-hook-form';
import { Box } from '@mui/material';

import { PDFProfile } from '@/types/PdfProfile';

import LowerProfileSection from './LowerProfileSection';
import UpperProfileSection from './UpperProfileSection';

interface Props {
  index: number;
  field: FieldArrayWithId<{
    id: number | null;
    profiles: PDFProfile[] | null | undefined;
  }>;
}
const Profile: React.FC<Props> = ({ field, index }: Props): JSX.Element => {
  return (
    <Box>
      <UpperProfileSection index={index} field={field} />
      <LowerProfileSection index={index} field={field} />
    </Box>
  );
};

export default Profile;

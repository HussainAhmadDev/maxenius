import { FC } from 'react';
import { FieldArrayWithId } from 'react-hook-form';
import { Box } from '@mui/material';

import { PDFProfile } from '@/types/PdfProfile';

import ProfilePiecesTable from './ProfilePiecesTable';

interface Props {
  field: FieldArrayWithId<{
    id: number | null;
    profiles: PDFProfile[] | null | undefined;
  }>;
  index: number;
}

const LowerProfileSection: FC<Props> = ({ index, field }: Props) => {
  return (
    <Box sx={{ m: '2rem' }}>
      <ProfilePiecesTable index={index} pieces_data={field.pieces_data} />
    </Box>
  );
};

export default LowerProfileSection;

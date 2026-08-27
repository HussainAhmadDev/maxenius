import { FC } from 'react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  styled,
  Typography,
} from '@mui/material';

import {
  assemblerDataLabels,
  customerDataLabels,
  languageData,
  miscDataLabels,
  profileDataLabels,
} from '@/constants';

import DialogBox from '.';

const StyledTypography = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '1rem',
}));

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
}
const ProjectDetailView: FC<Props> = ({ open, onClose, data }: Props) => {
  const colsPerRow = 4;
  return (
    <DialogBox open={open} onClose={onClose}>
      <DialogContent>
        {/* Customer Data  */}
        <Box my={4}>
          <Typography variant="h5">{languageData.form.steps[0]}</Typography>
          <Divider style={{ margin: '1rem 0' }} />
          <Grid container spacing={1}>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.name}:</StyledTypography>
              <Typography variant="subtitle1">{data.name}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.company}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.company}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.firstName}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.firstName}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.lastName}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.lastName}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.address1}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.address1}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.address2}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.address2}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.zipCode}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.zipCode}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.country}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.country}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.phone}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.phone}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{customerDataLabels.email}:</StyledTypography>
              <Typography variant="subtitle1">{data.customer?.email}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Assembler Data  */}
        <Box my={4}>
          <Typography variant="h5">{languageData.form.steps[1]}</Typography>
          <Divider style={{ margin: '1rem 0' }} />
          <Grid container spacing={1}>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.company}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.company}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.firstName}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.firstName}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.lastName}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.lastName}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.address1}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.address1}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.address2}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.address2}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.zipCode}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.zipCode}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.country}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.country}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.phone}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.phone}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{assemblerDataLabels.email}:</StyledTypography>
              <Typography variant="subtitle1">{data.assembler?.email}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Project Data  */}
        <Box my={4}>
          <Typography variant="h5">{languageData.form.steps[2]}</Typography>
          <Divider style={{ margin: '1rem 0' }} />
          <Grid container spacing={1}>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.profile}:</StyledTypography>
              <Typography variant="body1">{data.project_attributes?.profile}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.coating}:</StyledTypography>
              <Typography variant="body1">{data.project_attributes?.coating}</Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.specialColor}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.specialColor}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.wallWidth}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.wallWidth}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.externalOffset}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.externalOffset}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.internalOffset}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.internalOffset}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.aDimension}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.aDimension}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.cDimension}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.cDimension}
              </Typography>
            </Grid>

            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.pitch}:</StyledTypography>
              <Typography variant="body1">{data.project_attributes?.pitch}</Typography>
            </Grid>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.materialThickness}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.materialThickness}
              </Typography>
            </Grid>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.holder}:</StyledTypography>
              <Typography variant="body1">{data.project_attributes?.holder}</Typography>
            </Grid>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{profileDataLabels.endCapTailLength}:</StyledTypography>
              <Typography variant="body1">
                {data.project_attributes?.endCapTailLength}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Misc Data  */}
        <Box my={4}>
          <Typography variant="h5">{languageData.form.steps[3]}</Typography>
          <Divider style={{ margin: '1rem 0' }} />
          <Grid container spacing={1}>
            <Grid item xs={colsPerRow} sx={{ display: 'flex', gap: '1rem' }}>
              <StyledTypography>{miscDataLabels.note}:</StyledTypography>
              <Typography variant="subtitle1">{data.misc?.note}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </DialogBox>
  );
};

export default ProjectDetailView;

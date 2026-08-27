import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Container, Grid, TextareaAutosize } from '@mui/material';

import { languageData } from '@/constants';

import Preview from './preview';
import { StyledInput, StyledTypography } from './style';

const PDFHeader: React.FC = () => {
  const { register } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { header },
      },
    },
  } = languageData;
  return (
    <Container id="initPage" style={{ maxWidth: 'max-content' }}>
      <Grid
        container
        spacing={2}
        justifyContent="flex-end"
        alignItems="flex-start"
        style={{ width: '50%', position: 'relative', marginLeft: '50%' }}
      >
        <Grid item xs={12} sm={6} md={3} sx={{ mb: -5 }}>
          <Box className="form-group">
            <StyledTypography>{header.material}</StyledTypography>
            <StyledInput
              type="text"
              {...register('material')}
              className="form-control h-10"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ mb: -5 }}>
          <Box className="form-group">
            <StyledTypography>{header.strength}</StyledTypography>
            <StyledInput
              type="text"
              {...register('stärke')}
              className="form-control h-10"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ mb: -5 }}>
          <Box className="form-group">
            <StyledTypography>{header.corrosionProtection}</StyledTypography>
            <StyledInput
              type="text"
              {...register('korrosionsschutz')}
              className="form-control h-10"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ mb: -5 }}>
          <Box className="form-group">
            <StyledTypography>{header.buildingHeight}</StyledTypography>
            <StyledInput
              type="text"
              {...register('gebHöhe')}
              className="form-control h-10"
            />
          </Box>
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
      <br />

      <Preview />
      <br />
      <br />
      <br />

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={2}>
          <StyledTypography>{header.clearanceTolerances}</StyledTypography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <StyledTypography>{header.sheetMetalBaseMaterial}</StyledTypography>
          <StyledTypography>{header.baseMaterialHolder}</StyledTypography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <StyledTypography>{header.productText}</StyledTypography>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Box className="form-group">
            <StyledTypography>{header.change}</StyledTypography>
            <StyledInput type="text" {...register('anderung')} className="form-control" />
            <StyledInput type="text" {...register('stärke0')} className="form-control" />
            <StyledInput type="text" {...register('stärke1')} className="form-control" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Box className="form-group">
            <StyledTypography>{header.date}</StyledTypography>
            <StyledInput type="text" {...register('datum0')} className="form-control" />
            <StyledInput type="text" {...register('datum1')} className="form-control" />
            <StyledInput type="text" {...register('datum2')} className="form-control" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={1}>
          <Box className="form-group">
            <StyledTypography>{header.name}</StyledTypography>
            <StyledInput type="text" {...register('name0')} className="form-control" />
            <StyledInput type="text" {...register('name1')} className="form-control" />
            <StyledInput type="text" {...register('name2')} className="form-control" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={2} p={2}>
          <Box className="form-group">
            <StyledTypography>{header.scale}</StyledTypography>
            <TextareaAutosize
              minRows={5}
              {...register('maßstab')}
              className="form-control"
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.name}</StyledTypography>
            <StyledInput
              type="text"
              {...register('name')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.date}</StyledTypography>
            <StyledInput
              type="text"
              {...register('datum')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.articleNo}</StyledTypography>
            <StyledInput
              type="text"
              {...register('artikelnr')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.auNo}</StyledTypography>
            <StyledInput
              type="text"
              {...register('au_nr')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>Kunde</StyledTypography>
            <StyledInput
              type="text"
              {...register('kunde')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.com}</StyledTypography>
            <StyledInput
              type="text"
              {...register('kom')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="form-group">
            <StyledTypography>{header.sheet}</StyledTypography>
            <StyledInput
              type="text"
              {...register('blatt')}
              className="form-control"
              sx={{ width: '100%' }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} mt={2}>
          <img src="/logo.png" alt="logo" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PDFHeader;

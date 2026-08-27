import React from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { Box, Checkbox, FormControl, Grid, MenuItem } from '@mui/material';

import { PDFProfile } from '@/types/PdfProfile';

import Dimensions from './Dimensions';
import ReactHookFormSelect from './ReactHookFormSelect';
import { StyledFormControlLabel, StyledInput, StyledTypography } from './style';

interface Props {
  index: number;
  field: FieldArrayWithId<
    {
      id: number | null;
      profiles: PDFProfile[] | null | undefined;
    },
    'profiles',
    'id'
  >;
}
const PartsMaterial: React.FC<Props> = ({ index, field }: Props) => {
  const { register, control } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { profile, header },
      },
    },
  } = languageData;
  return (
    <Box id="pages" sx={{ mt: '5rem' }}>
      <section className="section-block page">
        <Box>
          <div className="text-center">
            <img src="/logo.png" alt="logo" />
          </div>
          <StyledTypography variant="h5">{profile.partsList}</StyledTypography>
          <StyledTypography>{'Alle Maßangaben in mm außer "Lfm" in m'}</StyledTypography>

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="form-group">
                <StyledTypography>Material/{profile.material}:</StyledTypography>

                <ReactHookFormSelect
                  control={control}
                  {...register(`profiles[${index}].materialwerkstoff`, {
                    value: '',
                  })}
                >
                  <MenuItem value="" selected>
                    --
                  </MenuItem>
                  <MenuItem value="alu">{profile.aluminum}</MenuItem>
                  <MenuItem value="alu_almg">
                    {profile.aluminum}: AlMg1 / EN AW-5005
                  </MenuItem>
                  <MenuItem value="stahl">{profile.steel}</MenuItem>
                  <MenuItem value="va">{profile.va}</MenuItem>
                </ReactHookFormSelect>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="form-group">
                <StyledTypography>{profile.materialThickness} [mm]:</StyledTypography>
                <ReactHookFormSelect
                  {...register(`profiles[${index}].materialstärke`)}
                  control={control}
                >
                  <MenuItem value="">--</MenuItem>
                  <MenuItem value="1,0">1,0</MenuItem>
                  <MenuItem value="1,5">1,5</MenuItem>
                  <MenuItem value="2,0">2,0</MenuItem>
                  <MenuItem value="2,5">2,5</MenuItem>
                  <MenuItem value="3,0">3,0</MenuItem>
                  <MenuItem value="3,5">3,5</MenuItem>
                  <MenuItem value="4,0">4,0</MenuItem>
                  <MenuItem value="4,5">4,5</MenuItem>
                  <MenuItem value="5,0">5,0</MenuItem>
                  <MenuItem value="5,5">5,5</MenuItem>
                  <MenuItem value="6,0">6,0</MenuItem>
                  <MenuItem value="6,5">6,5</MenuItem>
                  <MenuItem value="7,0">7,0</MenuItem>
                </ReactHookFormSelect>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="form-group">
                <StyledTypography>{profile.corrosionProtection}</StyledTypography>
                <StyledInput
                  sx={{ width: '100%' }}
                  type="text"
                  {...register(`profiles[${index}].korrosionsschutz`)}
                  className="form-control"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="form-group">
                <StyledTypography>{profile.buildingHeight}: [m]</StyledTypography>
                <StyledInput
                  type="text"
                  {...register(`profiles[${index}].gebäudehöhe`)}
                  className="form-control"
                  sx={{ width: '100%' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box className="form-group">
                <StyledTypography>{profile.plasterWeldSeams}:</StyledTypography>
                <StyledFormControlLabel
                  control={<Checkbox {...register(`profiles[${index}].nein`)} />}
                  label={profile.no}
                />
                <StyledFormControlLabel
                  control={<Checkbox {...register(`profiles[${index}].ja`)} />}
                  label={profile.yes}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box className="form-group">
                <StyledTypography>{profile.plasterWeldSeams}:</StyledTypography>
                <StyledFormControlLabel
                  control={<Checkbox {...register(`profiles[${index}].a`)} />}
                  label="A"
                />
                <StyledFormControlLabel
                  control={<Checkbox {...register(`profiles[${index}].b`)} />}
                  label="B"
                />
                <StyledFormControlLabel
                  control={<Checkbox {...register(`profiles[${index}].c`)} />}
                  label="C"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <StyledTypography>{profile.dimensions}</StyledTypography>
                <Box className="form-group d-in">
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].a_mass`)}
                    className="form-control"
                    placeholder={`A-${profile.dimension}`}
                    style={{ marginRight: '14px' }}
                  />
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].a_mass_angle`)}
                    className="form-control"
                    placeholder={`A-${profile.dimension} ${profile.angle}`}
                    style={{ marginRight: '14px' }}
                  />
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].a_mass_overhang`)}
                    className="form-control"
                    placeholder={`A-${profile.dimension} ${profile.overhang}`}
                  />
                </Box>
                <Box className="form-group d-in">
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].b_mass`)}
                    className="form-control"
                    placeholder={`B-${profile.dimension}`}
                    style={{ marginRight: '14px' }}
                  />
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].b_mass_angle`)}
                    className="form-control"
                    placeholder={`B-${profile.dimension} ${profile.angle}`}
                    style={{ marginRight: '14px' }}
                  />
                </Box>
                <Box className="form-group d-in">
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].c_mass`)}
                    className="form-control"
                    placeholder={`C-${profile.dimension}`}
                    style={{ marginRight: '14px' }}
                  />
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].c_mass_angle`)}
                    className="form-control"
                    placeholder={`C-${profile.dimension} ${profile.angle}`}
                    style={{ marginRight: '14px' }}
                  />
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].c_mass_overhang`)}
                    className="form-control"
                    placeholder={`C-${profile.dimension} ${profile.overhang}`}
                  />
                </Box>
                <Dimensions index={index} field={field} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography>{profile.holder}</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].haltetyp`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne">{profile.without}</MenuItem>
                    <MenuItem value="w">{profile.w}</MenuItem>
                    <MenuItem value="patent">{profile.patent}</MenuItem>
                    <MenuItem value="stabil">{profile.stable}</MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography>{profile.additionalVerb}</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].zusverb`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled selected>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne">{profile.without}</MenuItem>
                    <MenuItem value="w">{profile.w}</MenuItem>
                    <MenuItem value="w+glattblech">
                      {profile.w}+{profile.smoothSheetMetal}
                    </MenuItem>
                    <MenuItem value="glattblech">{profile.smoothSheetMetal}</MenuItem>
                    <MenuItem value="feinriffel">{profile.fineRidges}</MenuItem>
                    <MenuItem value="ws">{profile.ws}</MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].zus_stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].zus_davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              {/* AE-Ha. */}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography>{profile.ae_ha}.</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].aetyp`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled selected>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne"> {profile.without}</MenuItem>
                    <MenuItem value="w"> {profile.w}</MenuItem>
                    <MenuItem value="patent"> {profile.patent}</MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ae_stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ae_davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              {/* IE-Ha. */}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography> {profile.ie_ha}.</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].ietyp`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled selected>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne"> {profile.without}</MenuItem>
                    <MenuItem value="w"> {profile.w}</MenuItem>
                    <MenuItem value="patent"> {profile.patent}</MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ie_stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ie_davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              {/* Gef.U */}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography> {profile.gef_u}</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].geftyp`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled selected>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne"> {profile.without}</MenuItem>
                    <MenuItem value="kunstst.gelb">
                      {' '}
                      {profile.art}.{profile.yellow}
                    </MenuItem>
                    <MenuItem value="alu">{profile.aluminum} t=8</MenuItem>
                    <MenuItem value="knst">
                      {profile.art}.{profile.yellow} t=4
                    </MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].gef_stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].gef_davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              {/* AK lose */}
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Grid item xs={12} sm={2}>
                  <StyledTypography>{profile.akLoose}</StyledTypography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ReactHookFormSelect
                    control={control}
                    {...register(`profiles[${index}].aktyp`, {
                      value: '',
                    })}
                  >
                    <MenuItem value="" disabled selected>
                      {profile.type}
                    </MenuItem>
                    <MenuItem value="ohne">{profile.without}</MenuItem>
                    <MenuItem value="40/10">40/10</MenuItem>
                    <MenuItem value="typ_e">
                      {profile.type} E ({profile.plaster})
                    </MenuItem>
                    <MenuItem value="typ_f">
                      {profile.type} F ({profile.clinker})
                    </MenuItem>
                  </ReactHookFormSelect>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ak_stuck`)}
                    className="form-control"
                    placeholder={profile.piece}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledInput
                    type="text"
                    {...register(`profiles[${index}].ak_davon`)}
                    className="form-control"
                    placeholder={profile.coatedWithIt}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <div className="form-group">
                  <FormControl component="fieldset">
                    <StyledTypography>{profile.packSeparately}?</StyledTypography>
                    <Box sx={{ display: 'flex' }}>
                      <div className="box">
                        <StyledFormControlLabel
                          control={<Checkbox {...register(`profiles[${index}].ja2`)} />}
                          label={profile.yes}
                        />
                      </div>
                      <div className="box">
                        <StyledFormControlLabel
                          control={<Checkbox {...register(`profiles[${index}].nein2`)} />}
                          label={profile.no}
                        />
                      </div>
                    </Box>
                  </FormControl>
                </div>

                <div className="form-group">
                  <StyledInput
                    multiline
                    rows={5}
                    fullWidth
                    {...register(`profiles[${index}].fur`)}
                    placeholder={profile.forArea}
                    variant="outlined"
                  />
                </div>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <div className="form-group">
                      <StyledInput
                        id="position"
                        {...register(`profiles[${index}].position`)}
                        fullWidth
                        placeholder="Position"
                        variant="outlined"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className="form-group">
                      <StyledInput
                        id="bis"
                        {...register(`profiles[${index}].bis`)}
                        fullWidth
                        placeholder={profile.until}
                        variant="outlined"
                      />
                    </div>
                  </Grid>
                </Grid>

                <div className="form-group">
                  <StyledInput
                    fullWidth
                    {...register(`profiles[${index}].zus`)}
                    placeholder={profile.packTogetherWithAU}
                    variant="outlined"
                  />
                </div>

                <div className="form-group">
                  <StyledInput
                    multiline
                    {...register(`profiles[${index}].fur`)}
                    rows={5}
                    fullWidth
                    placeholder={profile.remarks}
                    variant="outlined"
                  />
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].uberstand`)}
                      className="form-control"
                      placeholder={profile.gotOver}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].gefalle`)}
                      className="form-control"
                      placeholder={profile.gradient}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].abw`)}
                      className="form-control"
                      placeholder={profile.devi}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <StyledTypography mt={2} variant="h6">
                      {profile.antiDrumming}
                    </StyledTypography>
                  </div>
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <StyledInput
                        type="text"
                        {...register(`profiles[${index}].lfdm`)}
                        className="form-control"
                        placeholder={profile.runningMeter}
                        sx={{ marginRight: '14px' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledInput
                        type="text"
                        {...register(`profiles[${index}].m`)}
                        className="form-control"
                        placeholder="m²"
                      />
                    </Grid>
                  </Grid>

                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ai_ie`)}
                      className="form-control"
                      placeholder={`${profile.ae}/${profile.ie} = 90°`}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ge_te`)}
                      className="form-control"
                      placeholder={`${profile.ge}/${profile.te} = 90°`}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ak`)}
                      className="form-control"
                      placeholder={profile.ak}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].formteil`)}
                      className="form-control"
                      placeholder={profile.molding}
                      sx={{ width: '100%' }}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].halterabst`)}
                      className="form-control"
                      placeholder={`${profile.holderDistance} max.1000`}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].gefalle1`)}
                      className="form-control"
                      placeholder={`${profile.gradient} [°]`}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].lfm`)}
                      className="form-control"
                      placeholder={profile.runningMeter}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledTypography variant="h6" mt={2}>
                      {header.sheet}
                    </StyledTypography>
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].m`)}
                      className="form-control"
                      placeholder="m²"
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ai_ie1`)}
                      className="form-control"
                      placeholder={`${profile.ae}/${profile.ie} ≠ 90°`}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ge_te1`)}
                      className="form-control"
                      placeholder={`${profile.gt}/${profile.te} ≠ 90°`}
                      fullWidth
                    />
                  </div>
                  <div className="form-group">
                    <StyledInput
                      type="text"
                      {...register(`profiles[${index}].ek`)}
                      className="form-control"
                      placeholder={profile.ek}
                      fullWidth
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} mt={2}>
                <StyledTypography>{profile.marketing}</StyledTypography>
                <FormControl component="fieldset">
                  <Grid container>
                    <Grid item xs={12} sm={6}>
                      <StyledFormControlLabel
                        control={<Checkbox />}
                        label={profile.marketing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledFormControlLabel
                        control={<Checkbox />}
                        label={profile.permanentMarker}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <HeaderTable />
        </Box>
      </section>
    </Box>
  );
};

export default PartsMaterial;

import { Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { languageData } from '@/constants';

function HeaderTable() {
  return (
    <>
      <TableContainer sx={{ border: '1px solid' }}>
        <Table>
          <TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }} colSpan={2}>
                1
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
                colSpan={2}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
          </TableRow>
          <TableHead>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }} colSpan={4}>
                1
              </TableCell>
              <TableCell
                sx={{ border: '1px solid ', '&:last-of-type': { boxShadow: 'none' } }}
                colSpan={4}
                rowSpan={6}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                4
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                4
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                4
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                4
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                4
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                4
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }}>1</TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                2
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                3
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                4
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{ '&:first-of-type': { boxShadow: 'none' } }}
                colSpan={4}
                rowSpan={4}
              >
                1
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
                colSpan={2}
              >
                8
              </TableCell>{' '}
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell sx={{ '&:first-of-type': { boxShadow: 'none' } }} colSpan={4}>
                1
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{
                  border: '1px solid ',
                }}
              >
                5
              </TableCell>{' '}
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                8
              </TableCell>{' '}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </>
  );
}

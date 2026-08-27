import { FC } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { languageData } from '@/constants';
import { PDFProfile } from '@/types/PdfProfile';

import { MeasurementField } from '../../preview/index.style';
import Dimensions from '../Dimensions';
import ReactHookFormSelect from '../ReactHookFormSelect';
import { StyledTableCell, StyledTableInput } from '../style';

interface Props {
  field: FieldArrayWithId<{
    id: number | null;
    profiles: PDFProfile[] | null | undefined;
  }>;
  index: number;
}

const UpperProfileSection: FC<Props> = ({ field, index }: Props) => {
  const { register, control } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { profile: language },
      },
    },
  } = languageData;
  return (
    <Box sx={{ m: '2rem' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ color: 'black' }}>
              <StyledTableCell
                size="small"
                sx={{
                  '&:first-of-type': { boxShadow: 'none', pl: 2 },
                  border: '1px solid black',
                  py: 0,
                  pt: 1,
                  m: 0,
                }}
                colSpan={2}
              >
                <Typography textAlign="left">{language.material}:</Typography>
                <ReactHookFormSelect
                  isTable
                  control={control}
                  {...register(`profiles[${index}].materialwerkstoff`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." selected>
                    --
                  </MenuItem>
                  <MenuItem value="alu">{language.aluminum}</MenuItem>
                  <MenuItem value="alu_almg">
                    {language.aluminum}: AlMg1 / EN AW-5005
                  </MenuItem>
                  <MenuItem value="stahl">{language.steel}</MenuItem>
                  <MenuItem value="va">{language.va}</MenuItem>
                </ReactHookFormSelect>
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: '1px solid black',
                  py: 0,
                  pt: 1,
                  m: 0,
                }}
                colSpan={2}
              >
                <Typography textAlign="left">
                  {language.materialThickness} [mm]:
                </Typography>
                <ReactHookFormSelect
                  isTable
                  {...register(`profiles[${index}].materialstärke`, {
                    value: '.',
                  })}
                  control={control}
                >
                  <MenuItem value=".">--</MenuItem>
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
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: '1px solid ',
                  m: 0,
                  pt: 1,
                  py: 0,
                }}
                colSpan={2}
              >
                <Typography textAlign="left">{language.corrosionProtection}</Typography>
                <StyledTableInput
                  sx={{ width: '100%' }}
                  type="text"
                  {...register(`profiles[${index}].korrosionsschutz`)}
                  className="form-control"
                />
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  pt: 1,
                  m: 0,
                }}
                colSpan={2}
              >
                <Typography textAlign="left">{language.buildingHeight}: [m]</Typography>
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].gebäudehöhe`)}
                  className="form-control"
                  sx={{ width: '100%' }}
                />
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  textAlign: 'left',
                  gap: '10px',
                  border: '1px solid',
                  '&:first-of-type': { boxShadow: 'none' },
                }}
                colSpan={4}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>{language.plastering}:</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: 'black' }}
                            {...register(`profiles[${index}].nein`)}
                          />
                        }
                        label={language.no}
                      />
                    </FormGroup>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: 'black' }}
                            {...register(`profiles[${index}].a`)}
                          />
                        }
                        label="A"
                      />
                    </FormGroup>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: 'black' }}
                            {...register(`profiles[${index}].b`)}
                          />
                        }
                        label="B"
                      />
                    </FormGroup>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: 'black' }}
                            {...register(`profiles[${index}].c`)}
                          />
                        }
                        label="C"
                      />
                    </FormGroup>
                    {/* c<StyledCheckbox {...register(`profiles[${index}].c`)} /> */}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{ border: '1px solid ', '&:last-of-type': { boxShadow: 'none' } }}
                colSpan={4}
                rowSpan={6}
              >
                <Box>
                  <Dimensions index={index} field={field} />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                \
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                {language.type}:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                }}
              >
                {language.piece}:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                }}
              >
                {language.damagedByIt}:
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.holder}
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <ReactHookFormSelect
                  sx={{ minWidth: '10rem' }}
                  isTable
                  control={control}
                  {...register(`profiles[${index}].haltetyp`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="w">{language.w}</MenuItem>
                  <MenuItem value="patent">{language.patent}</MenuItem>
                  <MenuItem value="stabil">{language.stable}</MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.additionalVerb}:
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <ReactHookFormSelect
                  control={control}
                  isTable
                  {...register(`profiles[${index}].zusverb`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="w">{language.w}</MenuItem>
                  <MenuItem value="w+glattblech">
                    {language.w}+{language.smoothSheetMetal}
                  </MenuItem>
                  <MenuItem value="glattblech">{language.smoothSheetMetal}</MenuItem>
                  <MenuItem value="feinriffel">{language.fineRidges}</MenuItem>
                  <MenuItem value="ws">{language.ws}</MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].zus_stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  m: 0,
                  p: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].zus_davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.ae_ha}
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <ReactHookFormSelect
                  isTable
                  control={control}
                  {...register(`profiles[${index}].aetyp`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="w">{language.w}</MenuItem>
                  <MenuItem value="patent">{language.patent}</MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ae_stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ae_davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.ie_ha}
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <ReactHookFormSelect
                  isTable
                  control={control}
                  {...register(`profiles[${index}].ietyp`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="w">{language.w}</MenuItem>
                  <MenuItem value="patent">{language.patent}</MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ie_stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ie_davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.gef_u}
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  m: 0,
                  p: 0,
                }}
              >
                <ReactHookFormSelect
                  isTable
                  control={control}
                  {...register(`profiles[${index}].geftyp`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="kunstst.gelb">
                    {language.art}
                    {language.yellow}
                  </MenuItem>
                  <MenuItem value="alu">{language.aluminum} t=8</MenuItem>
                  <MenuItem value="knst">
                    {language.art}
                    {language.yellow} t=4
                  </MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].gef_stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].gef_davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
              <TableCell
                sx={{
                  // border: '1px solid ',
                  py: 0,
                  m: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                colSpan={2}
              >
                <Typography>{language.gotOver}:</Typography>

                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].uberstand`)}
                  className="form-control"
                  placeholder={language.gotOver}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.holderDepreciation}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].halterabst`)}
                    className="form-control"
                    placeholder={`${language.holderDistance} max.1000`}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                }}
              >
                {language.akLoose}
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  p: 0,
                  m: 0,
                }}
              >
                <ReactHookFormSelect
                  isTable
                  control={control}
                  {...register(`profiles[${index}].aktyp`, {
                    value: '.',
                  })}
                >
                  <MenuItem value="." disabled>
                    {language.type}
                  </MenuItem>
                  <MenuItem value="ohne">{language.without}</MenuItem>
                  <MenuItem value="40/10">40/10</MenuItem>
                  <MenuItem value="typ_e">
                    {language.without} E ({language.plaster})
                  </MenuItem>
                  <MenuItem value="typ_f">
                    {language.without} F ({language.clinker})
                  </MenuItem>
                </ReactHookFormSelect>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  m: 0,
                  p: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ak_stuck`)}
                  className="form-control"
                  placeholder={language.piece}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  m: 0,
                  p: 0,
                }}
              >
                <StyledTableInput
                  type="text"
                  {...register(`profiles[${index}].ak_davon`)}
                  className="form-control"
                  placeholder={language.coatedWithIt}
                />
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.gradient} (mm)</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].gefalle`)}
                    className="form-control"
                    placeholder={language.gradient}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.gradient} (°)</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].gefalle1`)}
                    className="form-control"
                    placeholder={`${language.gradient} [°]`}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  textAlign: 'left',
                  border: '1px solid',
                  '&:first-of-type': { boxShadow: 'none', pl: 0 },
                  m: 0,
                  p: 0,
                }}
                colSpan={4}
                rowSpan={4}
              >
                <Table sx={{ m: 0, p: 0 }}>
                  <TableHead>
                    <TableRow sx={{ m: 0, p: 0 }}>
                      <TableCell
                        sx={{
                          textAlign: 'left',
                          '&:first-of-type': { boxShadow: 'none', pl: 2 },
                          borderBottom: 0,
                        }}
                      >
                        <Typography>{language.packSeparately}:</Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          '&:last-of-type': { boxShadow: 'none' },
                        }}
                        colSpan={2}
                      >
                        <FormGroup
                          sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: '80%',
                            px: 1,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{ color: 'black' }}
                                {...register(`profiles[${index}].ja`)}
                              />
                            }
                            label={language.yes}
                            labelPlacement="start"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                sx={{ color: 'black' }}
                                {...register(`profiles[${index}].nein2`)}
                              />
                            }
                            labelPlacement="start"
                            label={language.no}
                          />
                        </FormGroup>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ m: 0, p: 0 }}>
                      <TableCell
                        sx={{
                          textAlign: 'left',
                          '&:first-of-type': { boxShadow: 'none', pl: 2 },
                          borderBottom: 0,
                        }}
                      >
                        <Typography>{language.area}</Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          '&:last-of-type': { boxShadow: 'none' },
                          py: 0,
                          m: 0,
                        }}
                        colSpan={2}
                      >
                        <StyledTableInput
                          type="text"
                          {...register(`profiles[${index}].bereich`)}
                          className="form-control"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          textAlign: 'left',
                          '&:first-of-type': { boxShadow: 'none', pl: 2 },
                          borderBottom: 0,
                          height: 56,
                        }}
                      ></TableCell>
                      <TableCell
                        sx={{
                          '&:last-of-type': { boxShadow: 'none' },
                        }}
                        colSpan={2}
                      ></TableCell>
                    </TableRow>
                    <TableRow sx={{ m: 0, p: 0 }}>
                      <TableCell
                        sx={{
                          textAlign: 'left',
                          '&:first-of-type': { boxShadow: 'none', pl: 2 },
                          borderBottom: 0,
                          py: 0,
                          m: 0,
                        }}
                      >
                        <Typography>{language.pos}:</Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          '&:last-of-type': { boxShadow: 'none' },
                          borderBottom: 0,
                          py: 0,
                          m: 0,
                          pt: 0.5,
                        }}
                        colSpan={2}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: '80%',
                            px: 1,
                          }}
                        >
                          <MeasurementField
                            {...register(`profiles[${index}].getrennt`)}
                          />
                          <Typography>{language.until}:</Typography>
                          <MeasurementField {...register(`profiles[${index}].bis`)} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.devi}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].abw`)}
                    className="form-control"
                    placeholder={language.devi}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.runningMeter}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].lfm`)}
                    className="form-control"
                    placeholder={language.runningMeter}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>
                    {language.aluminum}/{language.ie} =90°:
                  </Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ai_ie`)}
                    className="form-control"
                    placeholder={`${language.aluminum}/${language.ie} =90°`}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>
                    {language.aluminum}/{language.ie} ≠ 90°:
                  </Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ai_ie1`)}
                    className="form-control"
                    placeholder={`${language.aluminum}/${language.ie} ≠ 90°`}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>
                    {language.ge}/{language.te} = 90°:
                  </Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ge_te`)}
                    className="form-control"
                    placeholder={`${language.ge}/${language.te} = 90°`}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>
                    {language.ge}/{language.te} ≠ 90°:
                  </Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ge_te1`)}
                    className="form-control"
                    placeholder={`${language.ge}/${language.te} ≠ 90°`}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:first-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.ak}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ak`)}
                    className="form-control"
                    placeholder={language.ak}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
                colSpan={2}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.ek}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].ek`)}
                    className="form-control"
                    placeholder={language.ek}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow sx={{ color: 'black' }}>
              <TableCell
                sx={{
                  '&:first-of-type': { boxShadow: 'none' },
                  border: '1px solid black',
                  py: 0,
                  m: 0,
                }}
                colSpan={4}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{language.packTogetherWithAU}:</Typography>
                  <StyledTableInput {...register(`profiles[${index}].zus`)} />
                </Box>
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{
                  border: '1px solid ',
                  py: 0,
                  m: 0,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.offsetSt}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].versatz`)}
                    className="form-control"
                    placeholder={language.offsetSt}
                  />
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  border: '1px solid ',
                  '&:last-of-type': { boxShadow: 'none' },
                  py: 0,
                  m: 0,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Typography>{language.specialMoldedParts}:</Typography>
                  <StyledTableInput
                    type="text"
                    {...register(`profiles[${index}].sonder`)}
                    className="form-control"
                    placeholder={language.specialMoldedParts}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UpperProfileSection;

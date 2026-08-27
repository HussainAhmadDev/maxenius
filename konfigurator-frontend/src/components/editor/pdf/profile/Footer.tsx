import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { languageData } from '@/constants';

import { StyledTableCell, StyledTableInput } from '../style';

interface Props {
  index: number;
}
const Footer: FC<Props> = ({ index }: Props) => {
  const { register } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { header, footer: language },
      },
    },
  } = languageData;
  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell sx={{ border: '1px solid black', color: 'black' }} colSpan={3}>
              <Typography noWrap>{language.FreimaBtoleranaenAccordingTo} </Typography>
              <Typography>DIN EN ISO 2768</Typography>
            </TableCell>
            <TableCell sx={{ border: '1px solid black', color: 'black' }} colSpan={3}>
              <Typography noWrap>{header.sheetMetalBaseMaterial}</Typography>
              <Typography> {language.baseMaterialHolder}</Typography>
            </TableCell>
            <TableCell sx={{ border: '1px solid black', color: 'black' }} colSpan={2}>
              <Typography>{header.productText}</Typography>
            </TableCell>
            <TableCell colSpan={4} sx={{ p: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{
                        ':first-of-type': {
                          boxShadow: 'none',
                          borderTop: 0,
                        },
                      }}
                    >
                      {header.change}:
                    </StyledTableCell>
                    <StyledTableCell sx={{ borderTop: 0 }}>
                      {' '}
                      {header.date}:
                    </StyledTableCell>
                    <StyledTableCell sx={{ borderTop: 0 }}>
                      {header.name}:
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        ':last-of-type': {
                          boxShadow: 'none',
                          border: '1px solid black',
                          borderTop: 0,
                          color: 'black',
                        },
                      }}
                    >
                      {header.scale}:
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell rowSpan={3}>
                      <Typography textAlign="center">---</Typography>
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={3} sx={{ paddingY: 0 }}>
              <Typography>{header.name}:</Typography>
              <StyledTableInput
                type="text"
                {...register(`profiles[${index}].name`)}
                className="form-control"
              />
              <Typography textAlign="center"></Typography>
            </StyledTableCell>
            <StyledTableCell colSpan={3} sx={{ paddingY: 0 }}>
              <Typography>{header.date}:</Typography>
              <StyledTableInput
                id="date"
                placeholder="Date"
                {...register(`profiles[${index}].date`)}
                type="date"
                variant="outlined"
                fullWidth
              />
            </StyledTableCell>
            <StyledTableCell sx={{ paddingY: 0 }}>
              <Typography>{language.addendumToAU}:</Typography>
              <StyledTableInput
                id="au_nr"
                {...register(`profiles[${index}].nachtrag`)}
                variant="outlined"
                placeholder={language.addendum}
                fullWidth
              />
            </StyledTableCell>
            <StyledTableCell sx={{ borderRight: 0, paddingY: 0 }}>
              <Typography>{header.auNo}.:</Typography>
              <StyledTableInput
                id="au_nr"
                {...register(`profiles[${index}].au_nr`)}
                variant="outlined"
                placeholder={`${header.auNo}.`}
                fullWidth
              />
            </StyledTableCell>
            <StyledTableCell sx={{ borderLeft: 0, paddingY: 0 }} rowSpan={3}>
              <img src="/logo.png" alt="s" />
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={6} sx={{ py: 0 }}>
              <Typography>{header.customer}:</Typography>
              <StyledTableInput
                id="kunde"
                {...register(`profiles[${index}].kunde`)}
                variant="outlined"
                placeholder={header.customer}
                fullWidth
              />
            </StyledTableCell>
            <StyledTableCell sx={{ py: 0 }}>
              <Typography>{header.com}:</Typography>
              <StyledTableInput
                id="kom"
                {...register(`profiles[${index}].kom`)}
                variant="outlined"
                placeholder={header.com}
                fullWidth
              />
            </StyledTableCell>
            <StyledTableCell sx={{ borderRight: 0, py: 0 }}>
              <Typography>{header.sheet}.:</Typography>
              <StyledTableInput
                id="blatt"
                {...register(`profiles[${index}].blatt`)}
                variant="outlined"
                placeholder={`${header.sheet}-Nr`}
                fullWidth
              />
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell colSpan={3} sx={{ py: 0, borderRight: 0 }}>
              <Typography>{language.contact.pohlDWSGmbH}:</Typography>
              <Typography>{language.contact.werkDuren}</Typography>
            </StyledTableCell>
            <StyledTableCell colSpan={3} sx={{ py: 0, borderRight: 0, borderLeft: 0 }}>
              <Typography>{language.contact.nickePutz}</Typography>
              <Typography>Tel: {language.contact.tel}</Typography>
            </StyledTableCell>
            <StyledTableCell sx={{ borderRight: 0, borderLeft: 0, py: 0 }}>
              <Typography>
                {language.contact.code} {language.contact.duren}
              </Typography>
              <Typography>Fax: {language.contact.fax}</Typography>
            </StyledTableCell>
            <StyledTableCell colSpan={5} sx={{ borderLeft: 0 }}></StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Footer;

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

import { StyledInput, StyledTypography } from './style';

interface Props {
  index: number;
}
const FormTwo: React.FC<Props> = ({ index }: Props) => {
  const { register } = useFormContext();
  return (
    <Box p="4rem">
      <TableContainer>
        <Table className="table tbl-1 hidden-xs">
          <TableBody>
            <TableRow>
              <TableCell>
                <StyledTypography>
                  Freimaßtoleranzen gemäß DIN EN ISO 2768
                </StyledTypography>
              </TableCell>
              <TableCell style={{ minWidth: 300 }}>
                <StyledTypography>
                  Grundwerkstoff Blech: EN AW-5005 <br /> Grundwerkstoff Holter: EN
                  AW-6060
                </StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>
                  Unsere metallischen Produkte zu Bauzwecken werden in der EXC 2 gemäß der
                  DIN EN 1090-2 bzw. DIN EN 1090-3 hergestellt
                </StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>Änderung</StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>Datum:</StyledTypography>
              </TableCell>
              <TableCell>
                <StyledTypography>Name:</StyledTypography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile */}
      <div className="visible-xs">
        <StyledTypography>Freimaßtoleranzen gemäß DIN EN ISO 2768</StyledTypography>
        <StyledTypography style={{ minWidth: 300 }}>
          Grundwerkstoff Blech: EN AW-5005 <br /> Grundwerkstoff Holter: EN AW-6060
        </StyledTypography>
        <StyledTypography>
          Unsere metallischen Produkte zu Bauzwecken werden in der EXC 2 gemäß der DIN EN
          1090-2 bzw. DIN EN 1090-3 hergestellt
        </StyledTypography>
        <StyledTypography>Änderung</StyledTypography>
        <StyledTypography>Datum:</StyledTypography>
        <StyledTypography>Name:</StyledTypography>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2}>
          <StyledInput
            {...register(`profiles[${index}].name`)}
            id="name"
            placeholder="Name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StyledInput
            id="date"
            placeholder="Date"
            {...register(`profiles[${index}].date`)}
            type="date"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <StyledInput
            id="kom"
            {...register(`profiles[${index}].kom`)}
            variant="outlined"
            placeholder="Kom"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledInput
            id="au_nr"
            {...register(`profiles[${index}].au_nr`)}
            variant="outlined"
            placeholder="AU-Nr."
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5}>
          <StyledInput
            id="kunde"
            label="Kunde"
            {...register(`profiles[${index}].kunde`)}
            variant="outlined"
            placeholder="Kunde"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <StyledInput
            id="bv"
            label="BV"
            variant="outlined"
            placeholder="BV"
            fullWidth
            {...register(`profiles[${index}].bv`)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <StyledInput
            id="blatt"
            {...register(`profiles[${index}].blatt`)}
            label="Blatt-Nr"
            variant="outlined"
            placeholder="Blatt-Nr"
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormTwo;

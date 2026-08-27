import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import ReactHookFormSelect from './ReactHookFormSelect';
import { StyledTableCell, StyledTableInput } from './style';

interface Props {
  pieces_data: any[];
  index: number;
}
const PDFTable: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  ({ pieces_data, index }: Props, ref) => {
    const { register, control } = useFormContext();

    const registerField = (idx: number, name: string) =>
      register(`profiles[${index}].pieces_data[${idx}].${name}`, {
        value: '',
      });

    return (
      <>
        <Box ref={ref}>
          <TableContainer>
            <Table>
              <TableheadRowOne />
              <TableheadRowTwo />

              <TableBody>
                {pieces_data?.map((piece: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                      }}
                    ></TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <StyledTableInput
                        key={piece.id}
                        sx={{ border: 'none' }}
                        type="text"
                        {...registerField(idx, 'pos')}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <StyledTableInput
                        type="text"
                        key={piece.id}
                        {...registerField(idx, 'amount')}
                        className="form-control"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        minWidth: '10rem',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <ReactHookFormSelect
                        key={piece.id}
                        control={control}
                        isTable
                        {...registerField(idx, 'bezeichung')}
                      >
                        <MenuItem value="" selected>
                          --
                        </MenuItem>
                        <MenuItem value="l">L</MenuItem>
                        <MenuItem value="ae">AE</MenuItem>
                        <MenuItem value="ie">IE</MenuItem>
                        <MenuItem value="ge">GE</MenuItem>
                        <MenuItem value="te">TE</MenuItem>
                        <MenuItem value="gete">GE/TE</MenuItem>
                        <MenuItem value="tege">TE/GE</MenuItem>
                        <MenuItem value="sb">SB</MenuItem>
                      </ReactHookFormSelect>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <StyledTableInput
                        type="text"
                        key={piece.id}
                        {...registerField(idx, 'angle')}
                        className="form-control"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <StyledTableInput
                        type="text"
                        key={piece.id}
                        {...registerField(idx, 'length')}
                        className="form-control"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        minWidth: '10rem',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <ReactHookFormSelect
                        key={piece.id}
                        control={control}
                        isTable
                        {...registerField(idx, 'beze')}
                      >
                        <MenuItem value="" disabled selected>
                          --
                        </MenuItem>
                        <MenuItem value="ohne">OHNE</MenuItem>
                        <MenuItem value="ak">AK</MenuItem>
                        <MenuItem value="ek">EK</MenuItem>
                        <MenuItem value="EKÜ">EKÜ</MenuItem>
                        <MenuItem value="AK/EKÜ">AK/EKÜ</MenuItem>
                      </ReactHookFormSelect>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        minWidth: '10rem',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <ReactHookFormSelect
                        key={piece.id}
                        isTable
                        control={control}
                        {...registerField(idx, 'chung')}
                      >
                        <MenuItem value="" disabled selected>
                          --
                        </MenuItem>
                        <MenuItem value="ohne">OHNE</MenuItem>
                        <MenuItem value="ak">AK</MenuItem>
                        <MenuItem value="ek">EK</MenuItem>
                        <MenuItem value="EKÜ">EKÜ</MenuItem>
                        <MenuItem value="AK/EKÜ">AK/EKÜ</MenuItem>
                      </ReactHookFormSelect>
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        color: 'black',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <StyledTableInput
                        type="text"
                        key={piece.id}
                        {...registerField(idx, 'zuschnitt')}
                        className="form-control"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ border: '1px solid black', color: 'black' }}
                    colSpan={3}
                  >
                    <Typography noWrap>FreimaBtoleranaen gemaB </Typography>
                    <Typography>DIN EN ISO 2768</Typography>
                  </TableCell>
                  <TableCell
                    sx={{ border: '1px solid black', color: 'black' }}
                    colSpan={3}
                  >
                    <Typography noWrap>Grundwerkstoff Blech: EN AW-5005</Typography>
                    <Typography> Grundwerkstoff Halter:EN AW-6060</Typography>
                  </TableCell>
                  <TableCell
                    sx={{ border: '1px solid black', color: 'black' }}
                    colSpan={2}
                  >
                    <Typography>
                      Unsere metallischen Product zu Bauzwecken werden in der EXC2 gemab
                      der DIN EN 1090-2 bzw. DIN EN 1090-3 hergestelt
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={4} sx={{ p: 0 }}>
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
                          Anderung:
                        </StyledTableCell>
                        <StyledTableCell sx={{ borderTop: 0 }}> Datum:</StyledTableCell>
                        <StyledTableCell sx={{ borderTop: 0 }}>Name:</StyledTableCell>
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
                          MaBstab:
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
                  </TableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell colSpan={3} sx={{ paddingY: 0 }}>
                    <Typography>Name:</Typography>
                    <StyledTableInput
                      type="text"
                      {...register(`profiles[${index}].name`)}
                      className="form-control"
                    />
                    <Typography textAlign="center"></Typography>
                  </StyledTableCell>
                  <StyledTableCell colSpan={3} sx={{ paddingY: 0 }}>
                    <Typography>Datum:</Typography>
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
                    <Typography>Nachtrag zu AU.:</Typography>
                    <Typography textAlign="center"></Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ borderRight: 0, paddingY: 0 }}>
                    <Typography>AU-Nr.:</Typography>
                    <StyledTableInput
                      id="au_nr"
                      {...register(`profiles[${index}].au_nr`)}
                      variant="outlined"
                      placeholder="AU-Nr."
                      fullWidth
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ borderLeft: 0, paddingY: 0 }} rowSpan={3}>
                    <img src="/logo.png" alt="s" />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell colSpan={6} sx={{ py: 0 }}>
                    <Typography>Kunde:</Typography>
                    <StyledTableInput
                      id="kunde"
                      {...register(`profiles[${index}].kunde`)}
                      variant="outlined"
                      placeholder="Kunde"
                      fullWidth
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ py: 0 }}>
                    <Typography>Kom.:</Typography>
                    <StyledTableInput
                      id="kom"
                      {...register(`profiles[${index}].kom`)}
                      variant="outlined"
                      placeholder="Kom"
                      fullWidth
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ borderRight: 0, py: 0 }}>
                    <Typography>Blatt.:</Typography>
                    <StyledTableInput
                      id="blatt"
                      {...register(`profiles[${index}].blatt`)}
                      variant="outlined"
                      placeholder="Blatt-Nr"
                      fullWidth
                    />
                  </StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell colSpan={3} sx={{ py: 0, borderRight: 0 }}>
                    <Typography>Pohl DWS GmbH:</Typography>
                    <Typography>Werk Duren</Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    colSpan={3}
                    sx={{ py: 0, borderRight: 0, borderLeft: 0 }}
                  >
                    <Typography>Nickeputz 33</Typography>
                    <Typography>Tel: 0 24 21 / 96 58-0</Typography>
                  </StyledTableCell>
                  <StyledTableCell sx={{ borderRight: 0, borderLeft: 0, py: 0 }}>
                    <Typography>D-52349 Duren</Typography>
                    <Typography>Fax: 0 24 21 / 96 58 90</Typography>
                  </StyledTableCell>
                  <StyledTableCell colSpan={5} sx={{ borderLeft: 0 }}></StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  },
);
PDFTable.displayName = 'PDFTable';
export default PDFTable;

const TableheadRowOne = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            p: 0,
            m: 0,
            border: '1px solid black',
            ':first-of-type': {
              boxShadow: 'none',
              p: 0,
            },
          }}
        >
          verp
        </TableCell>
        <TableCell
          sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}
          colSpan={3}
        >
          Pos.Nr.grave <CustomCheckbox />
        </TableCell>
        <TableCell
          sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}
          colSpan={2}
        >
          ...mit Filzst
        </TableCell>
        <TableCell
          sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}
          colSpan={2}
        ></TableCell>

        <TableCell
          sx={{
            p: 0,
            m: 0,
            '&.MuiTableCell-root:last-of-type': {
              boxShadow: 'none',
              border: '1px solid black',
              color: 'black',
            },
          }}
        >
          S=Schere T = Trumpf
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const TableheadRowTwo = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            p: 0,
            m: 0,
            border: '1px solid black',
            ':first-of-type': {
              boxShadow: 'none',
              p: 0,
            },
          }}
        >
          <img src="/icons/pdf/image2.png" alt="" />
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          Pos.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          Stck.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          Bez.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          <img src="/icons/pdf/image1.png" alt="" width={30} height={30} />
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          L-Mabe
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          Abschl-li
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          Abschl-re
        </TableCell>
        <TableCell
          sx={{
            p: 0,
            m: 0,
            '&.MuiTableCell-root:last-of-type': {
              boxShadow: 'none',
              border: '1px solid black',
              color: 'black',
            },
          }}
        >
          Zuschnitt S.: <CustomCheckbox /> T.: <CustomCheckbox />
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

import { Checkbox } from '@mui/material';
function CustomCheckbox() {
  return (
    <>
      <Checkbox
        sx={{
          '& .MuiSvgIcon-root': {
            width: '20px',
            height: '20px',
            color: 'black',
          },
          '& .Mui-checked': {
            color: 'blue',
          },
          '& .MuiCheckbox-indeterminate': {
            color: 'green',
          },
          marginBottom: '0px',
        }}
      />
    </>
  );
}

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { languageData } from '@/constants';
import { useEditorStore } from '@/store/EditorStore';

import ReactHookFormSelect from '../ReactHookFormSelect';
import { StyledTableInput } from '../style';

import Footer from './Footer';

interface Props {
  pieces_data: any[];
  index: number;
}
const ProfilePiecesTable: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  ({ pieces_data, index }: Props, ref) => {
    const { register, control } = useFormContext();
    const { updatedProfiles, floorPlan } = useEditorStore();

    const registerField = (idx: number, name: string) =>
      register(`profiles[${index}].pieces_data[${idx}].${name}`, {
        value: '',
      });
    const {
      editor: {
        pdf: {
          form: { profile: language },
        },
      },
    } = languageData;
    return (
      <>
        <Box ref={ref}>
          <TableContainer>
            <Table>
              <TableheadRowOne index={index} />
              <TableheadRowTwo index={index} />

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
                        {...register(
                          `profiles[${index}].pieces_data[${idx}].bezeichung`,
                          {
                            value: '.',
                          },
                        )}
                      >
                        <MenuItem value="." disabled>
                          --
                        </MenuItem>
                        <MenuItem value="l">{language.l}</MenuItem>
                        <MenuItem value="ae">{language.ae}</MenuItem>
                        <MenuItem value="ie">{language.ie}</MenuItem>
                        <MenuItem value="ge">{language.ge}</MenuItem>
                        <MenuItem value="te">{language.te}</MenuItem>
                        <MenuItem value="gete">
                          {language.ge}/{language.te}
                        </MenuItem>
                        <MenuItem value="tege">
                          {language.te}/{language.ge}
                        </MenuItem>
                        <MenuItem value="sb">{language.sb}</MenuItem>
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
                        onChange={async (e) => {
                          const { value } = e.target;

                          const matchedProfile = floorPlan?.autoProfiles?.find(
                            (profile) => profile.id === piece.profile.id,
                          );

                          if (matchedProfile) {
                            // Find if a profile with matching criteria exists
                            const existingIndex = updatedProfiles.findIndex(
                              (profile) => (profile as any).id === matchedProfile.id,
                            );

                            if (existingIndex !== -1) {
                              // If exists, update the existing profile
                              const updatedProfilesCopy = [...updatedProfiles];
                              updatedProfilesCopy[existingIndex] = {
                                ...updatedProfiles[existingIndex],
                                length: +value,
                              };
                              useEditorStore.setState({
                                updatedProfiles: updatedProfilesCopy,
                              });
                            } else {
                              // If doesn't exist, push a new profile
                              useEditorStore.setState({
                                updatedProfiles: [
                                  ...updatedProfiles,
                                  {
                                    ...matchedProfile,
                                    length: +value,
                                  },
                                ] as any,
                              });
                            }
                          }
                        }}
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
                        {...register(`profiles[${index}].pieces_data[${idx}].beze`, {
                          value: '.',
                        })}
                      >
                        <MenuItem value="." disabled>
                          --
                        </MenuItem>
                        <MenuItem value="ohne">{language.without}</MenuItem>
                        <MenuItem value="ak">{language.ak}</MenuItem>
                        <MenuItem value="ek">{language.ek}</MenuItem>
                        <MenuItem value="EKÜ">{language.eku}</MenuItem>
                        <MenuItem value="AK/EKÜ">
                          {language.ak}/{language.eku}
                        </MenuItem>
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
                        {...register(`profiles[${index}].pieces_data[${idx}].chung`, {
                          value: '.',
                        })}
                      >
                        <MenuItem value="." disabled>
                          --
                        </MenuItem>
                        <MenuItem value="ohne">{language.without}</MenuItem>
                        <MenuItem value="ak">{language.ak}</MenuItem>
                        <MenuItem value="ek">{language.ek}</MenuItem>
                        <MenuItem value="EKÜ">{language.eku}</MenuItem>
                        <MenuItem value="AK/EKÜ">
                          {language.ak}/{language.eku}
                        </MenuItem>
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
          <Footer index={index} />
        </Box>
      </>
    );
  },
);
ProfilePiecesTable.displayName = 'ProfilePiecesTable';
export default ProfilePiecesTable;

const TableheadRowOne = ({ index }: { index: number }) => {
  const { register } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { profile: language },
      },
    },
  } = languageData;
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
          {language.verp}
        </TableCell>
        <TableCell
          sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}
          colSpan={3}
        >
          <FormGroup sx={{ px: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: 'black' }}
                  {...register(`profiles[${index}].pos_nr_grave`)}
                />
              }
              label={language.posNoGrave}
            />
          </FormGroup>
        </TableCell>
        <TableCell
          sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}
          colSpan={2}
        >
          {language.whatFilzst}
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
          {language.s}={language.schere} {language.t} = {language.trumpF}
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const TableheadRowTwo = ({ index }: { index: number }) => {
  const { register } = useFormContext();
  const {
    editor: {
      pdf: {
        form: { profile: language },
      },
    },
  } = languageData;
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
          {language.pos}.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          {language.piece}.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          {language.ref}.
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          <img src="/icons/pdf/image1.png" alt="" width={30} height={30} />
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          {language.lMabe}
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          {language.finalLeft}
        </TableCell>
        <TableCell sx={{ border: '1px solid black', color: 'black', p: 0, m: 0 }}>
          {language.finalRight}
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
          <FormGroup
            sx={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', px: 1 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: 'black' }}
                  {...register(`profiles[${index}].zuschnitt`)}
                />
              }
              label={`${language.cutS}:`}
              labelPlacement="start"
            />
            <FormControlLabel
              control={
                <Checkbox sx={{ color: 'black' }} {...register(`profiles[${index}].t`)} />
              }
              labelPlacement="start"
              label={`${language.t}.:`}
            />
          </FormGroup>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

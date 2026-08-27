import * as React from 'react';
import {
  useNavigate,
  useNavigation,
  useRevalidator,
  useSearchParams,
} from 'react-router-dom';
import { Lock, LockOpen } from '@mui/icons-material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Chip,
  CircularProgress,
  circularProgressClasses,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { deleteProject, lockProject } from '@/services/projects';
import { PROJECT_DETAILS_QUERY, SupabaseTableNames } from '@/services/queries';
import { supabaseClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/AuthStore';

import ProjectDetailView from '../dialog/ProjectDetailView';

import { headCells } from './config';
import TableHeader from './tableHeader';

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: () => void;
  rowCount: number;
  progress: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount, progress } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="info"
            indeterminate={
              rowCount !== 0 && numSelected !== 0 && numSelected !== rowCount
            }
            checked={rowCount !== 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            disabled={progress}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{
              textAlign: headCell.id === 'action' ? 'center' : 'start',
              color: 'white',
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const ActionIconButton = ({
  icon: Icon,
  onClick,
  disabled,
}: {
  icon: React.ComponentType<any>;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <IconButton
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    disabled={disabled}
    sx={{
      ':disabled': {
        svg: {
          opacity: '.4 !important',
        },
      },
    }}
  >
    <Icon sx={{ color: 'primary.main' }} />
  </IconButton>
);

const CustomCircularProgress = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={50}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={50}
        thickness={4}
      />
    </Box>
  );
};
interface SelectedState {
  action: 'edit' | 'delete' | 'pdf' | 'lock' | null | 'pagination';
  id: number | null;
}
interface ModalState {
  open: boolean;
  data: any | null;
}

type LoadingType = 'detailModal';

interface Props {
  data: any[];
  totalRows: number;
}
export default function EnhancedTable({ data, totalRows }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const { state } = useNavigation();
  const userRole = useAuthStore((state) => state.userRole);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = React.useState('');
  const [tableData, setTableData] = React.useState(data);
  // eslint-disable-next-line no-console
  console.log('🚀 ~ EnhancedTable ~ userRole:', userRole);
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [loading, setLoading] = React.useState<{
    type: LoadingType | null;
    id: null | number;
  }>({
    type: null,
    id: null,
  });
  const isSelected = (id: number) => selected.includes(id);
  const [selectedState, setSelectedState] = React.useState<SelectedState>({
    action: null,
    id: null,
  });
  const [detailsView, setDetailsView] = React.useState<ModalState>({
    open: false,
    data: null,
  });
  const handleSelectAllClick = () => {
    if (data.length !== selected.length) {
      const newSelected: number[] = data.map((n) => Number(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (
    _event: React.MouseEvent<unknown> | React.ChangeEvent<unknown>,
    id: number,
  ) => {
    setSelected(isSelected(id) ? selected.filter((el) => el !== id) : [...selected, id]);
  };
  const handleChangePage = (_event: unknown, newPage: number) => {
    setSelectedState({ action: 'pagination', id: null });
    searchParams.set('page', (newPage + 1)?.toString());
    setSearchParams(searchParams);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedState({ action: 'pagination', id: null });
    searchParams.set('per_page', parseInt(event.target.value, 10)?.toString());
    setSearchParams(searchParams);
  };
  const getProjectDetails = async (id: number) => {
    setLoading({ type: 'detailModal', id });
    try {
      const { data } = await supabaseClient
        .from(SupabaseTableNames.project)
        .select(PROJECT_DETAILS_QUERY)
        .eq('id', id)
        .limit(1);
      if (data) setDetailsView({ open: true, data: data.length > 0 ? data[0] : null });

      setLoading({ type: null, id: null });
    } catch (error) {
      setLoading({ type: null, id: null });
    }
  };
  React.useLayoutEffect(() => {
    if (!['10', '20', '50'].includes(searchParams.get('per_page')!)) {
      searchParams.set('per_page', '10');
      setSearchParams(searchParams);
    }
    if (!searchParams.get('page')) {
      searchParams.set('page', '1');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);
  React.useMemo(() => {
    const ids = data.map((n) => n?.id);
    if (selected.some((id) => !ids.includes(id))) {
      const updatedSelected = selected.filter((id) => ids.includes(id));
      setSelected(updatedSelected);
    }
  }, [data, selected]);
  React.useEffect(() => {
    if (data?.length) {
      if (search) {
        setTableData(
          data?.filter((el) =>
            [
              String(el?.id),
              el?.assembler?.firstName,
              el?.assembler?.lastName,
              el?.customer?.address1,
              el?.customer?.name,
              el?.status,
            ]?.some((e) => e?.toLowerCase()?.includes(search?.toLowerCase())),
          ),
        );
      } else {
        setTableData(data);
      }
    }
  }, [search, data]);
  return (
    <Box sx={{ width: '100%' }}>
      {detailsView.open && (
        <ProjectDetailView
          open={detailsView.open}
          onClose={() => setDetailsView({ open: false, data: null })}
          data={detailsView.data}
        />
      )}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableHeader search={search} setSearch={setSearch} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data.length}
              progress={state === 'loading' && selectedState.action === 'pagination'}
            />
            {state === 'loading' && selectedState.action === 'pagination' ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Stack
                      direction={'row'}
                      minHeight={100}
                      width={'100%'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <CustomCircularProgress />
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : !tableData?.length ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center" padding="normal">
                    Keine Daten gefunden
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {tableData?.map((row, index) => {
                  const isItemSelected = isSelected(Number(row?.id));
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, Number(row?.id))}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row?.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" align="right">
                        <Checkbox
                          color="info"
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, Number(row?.id))}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <Typography textAlign="start">{row?.id}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography textAlign="start">{row?.customer?.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            align: 'center',
                            justifyContent: 'start',
                            gap: 1,
                          }}
                        >
                          <PlaceIcon sx={{ width: '20px' }} />
                          <Typography textAlign="start">
                            {row?.customer?.address1}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        {row?.status === 'finished' ? (
                          <Chip
                            label={row?.status}
                            size="medium"
                            sx={{
                              color: 'white',
                              py: 1,
                              backgroundColor: theme.palette.grey[500],
                            }}
                          />
                        ) : (
                          <Chip
                            label={row?.status}
                            size="medium"
                            sx={{
                              color: 'white',
                              py: 1,
                              backgroundColor: theme.palette.primary.main,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <Typography>
                          {row?.assembler?.firstName + ' ' + row?.assembler?.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          m="auto"
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {loading.type === 'detailModal' && loading.id === row?.id ? (
                            <CircularProgress
                              size={25}
                              sx={{ height: '100%', my: 'auto' }}
                            />
                          ) : (
                            <ActionIconButton
                              icon={VisibilityIcon}
                              onClick={() => getProjectDetails(row?.id)}
                            />
                          )}
                          {userRole === 'outer_sales_agent' &&
                            (selectedState.action === 'lock' &&
                            selectedState.id === row?.id ? (
                              <CircularProgress
                                size={25}
                                sx={{ height: '100%', my: 'auto' }}
                              />
                            ) : (
                              <ActionIconButton
                                icon={row?.locked ? Lock : LockOpen}
                                disabled={!!row?.locked}
                                onClick={async () => {
                                  setSelectedState({ action: 'lock', id: row?.id });
                                  await lockProject(row?.id);
                                  revalidator.revalidate();
                                  setSelectedState({ action: null, id: null });
                                }}
                              />
                            ))}
                          {(
                            userRole === 'outer_sales_agent' ? !!row?.locked : false
                          ) ? null : state === 'loading' &&
                            selectedState.action === 'edit' &&
                            selectedState.id === row?.id ? (
                            <CircularProgress
                              size={25}
                              sx={{ height: '100%', my: 'auto' }}
                            />
                          ) : (
                            <ActionIconButton
                              icon={BorderColorIcon}
                              onClick={() => {
                                setSelectedState({ action: 'edit', id: row?.id });
                                return navigate(`/editor/${row?.id}`);
                              }}
                            />
                          )}
                          <ActionIconButton icon={PersonIcon} onClick={() => {}} />
                          {selectedState.action === 'pdf' &&
                          selectedState.id === row?.id ? (
                            <CircularProgress
                              size={25}
                              sx={{ height: '100%', my: 'auto' }}
                            />
                          ) : (
                            <ActionIconButton
                              icon={InsertLinkIcon}
                              disabled={row?.have_pdf === null}
                              onClick={() => {
                                setSelectedState({ action: 'pdf', id: row?.id });
                                return navigate(
                                  `/editor/${row?.id}/pdf?generate_pdf=true`,
                                );
                              }}
                            />
                          )}

                          {userRole === 'super_admin' &&
                            (selectedState.action === 'delete' &&
                            selectedState.id === row?.id ? (
                              <CircularProgress
                                size={25}
                                sx={{ height: '100%', my: 'auto' }}
                              />
                            ) : (
                              <ActionIconButton
                                icon={DeleteIcon}
                                onClick={async () => {
                                  setSelectedState({ action: 'delete', id: row?.id });
                                  await deleteProject(row?.id);
                                  revalidator.revalidate();
                                }}
                              />
                            ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalRows}
          rowsPerPage={Number(searchParams.get('per_page')!) ?? 1}
          page={Number(searchParams.get('page')!) - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={<>Zeilen pro Seite</>}
        />
      </Paper>
    </Box>
  );
}

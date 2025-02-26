import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { ITeacher, ITeachersTableHead } from '../../types';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { truncate } from '../../utils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface IOrderTableHead {
  headCells: ITeachersTableHead[];
  order: string;
  orderBy: string;
}

function OrderTableHead({ headCells, order, orderBy }: IOrderTableHead) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? (order as SortDirection) : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface IOrderTableProps {
  headCells: ITeachersTableHead[];
  data: ITeacher[];
  handleDelete: (id: number) => void;
  isLoadingDelete: boolean;
  openEditModal: (e: React.MouseEvent<HTMLButtonElement>, teacher: ITeacher) => void;
  checkTeacher: (id: number) => void;
  openTeacherImageRegisterModal: (teacher: ITeacher) => void;
}

export default function OrderTable({
  headCells,
  data,
  handleDelete,
  isLoadingDelete,
  openEditModal,
  checkTeacher,
  openTeacherImageRegisterModal
}: IOrderTableProps) {
  const order = 'asc';
  const orderBy = 'tracking_no';

  const [copiedId, setCopied] = useState(-1);

  const handleCopy = (row: ITeacher) => {
    navigator.clipboard.writeText(JSON.stringify(row));
    setCopied(row.id);
    setTimeout(() => setCopied(-1), 2000);
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} headCells={headCells} />
          <TableBody>
            {data.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  onClick={() => checkTeacher(row.id)}
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell component="th" id={labelId} scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {truncate(row.firstName, 10)}
                  </TableCell>
                  <TableCell>{truncate(row.lastName, 10)}</TableCell>
                  <TableCell>{truncate(row.degree, 10)}</TableCell>
                  <TableCell>{truncate(row.phone, 10)}</TableCell>
                  <TableCell>{truncate(row.pinfl === null ? '-' : row.pinfl, 10)}</TableCell>
                  <TableCell>{truncate(row.position === null ? '-' : row.position, 10)}</TableCell>
                  <TableCell sx={{ display: 'flex' }}>
                    <IconButton color="primary" onClick={(e: React.MouseEvent<HTMLButtonElement>) => openEditModal(e, row)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDelete(row.id);
                      }}
                      disabled={isLoadingDelete}
                    >
                      {isLoadingDelete ? <CircularProgress size={20} /> : <DeleteIcon />}
                    </IconButton>

                    <IconButton
                      color="secondary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        openTeacherImageRegisterModal(row);
                      }}
                    >
                      <CameraAltIcon />
                    </IconButton>

                    <Tooltip title={copiedId === row.id ? 'Copied!' : 'Copy'}>
                      <motion.div animate={{ scale: copiedId === row.id ? 1.2 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <IconButton
                          color={copiedId === row.id ? 'success' : 'default'}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleCopy(row);
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </motion.div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

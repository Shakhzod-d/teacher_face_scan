import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import MainCard from '../../components/MainCard';
import OrdersTable from './OrdersTable';

import { deleteItemServ, postItemsServ, postRegisterTeacherImage, putItemServ } from '../../services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ITeacher, ITeachersResponse, ITeachersTableHead } from '../../types';
import Loader from '../../components/Loader';
import { teachersHeadCells } from '../../consts';
import { Alert, Box, Button, CircularProgress, Modal, Snackbar, TablePagination, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Webcam from 'react-webcam';

export default function DashboardDefault() {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [page, setPage] = useState(0);
  const [editingTeacher, setEditingTeacher] = useState<ITeacher | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlBack, setImageUrlBack] = useState<File | null>(null);
  const [teacherId, setTeacherId] = useState('');

  const navigate = useNavigate();

  const {
    data: teachersData,
    isLoading,
    refetch
  } = useQuery<ITeachersResponse>({
    queryFn: () =>
      postItemsServ(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/teachers/filter`, {
        filter: {},
        paging: {
          page: page
        }
      }),
    queryKey: ['postItemsServ', page],
    initialData: { content: [], paging: {} }
  });

  const { mutate: createTeacherFn, isPending: isLoadingCreateTeacher } = useMutation({
    mutationFn: (newTeacher: ITeacher) => postItemsServ(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/teachers/create`, newTeacher),
    onSuccess: (data) => {
      if (data) {
        setSnackbarMessage('Teacher created successfully!');
        refetch();
        setOpen(false);
        formik.resetForm();
        setSnackbarOpen(true);
      }
    }
  });

  const { mutate: updateTeacherFn, isPending: isLoadingUpdateTeacher } = useMutation({
    mutationFn: (updatedTeacher: ITeacher) => putItemServ(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/teachers/update`, updatedTeacher),
    onSuccess: () => {
      setSnackbarMessage('Teacher updated successfully!');
      handleClose();
      refetch();
    }
  });

  const { mutate: deleteTeacherFn, isPending: isLoadingDeleteItem } = useMutation({
    mutationFn: (id: number) => deleteItemServ(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/teachers/delete/${id}`),
    onSuccess: (data) => {
      if (data) {
        setSnackbarMessage('Teacher deleted successfully!');
        refetch();
        setSnackbarOpen(true);
      }
    }
  });

  const { mutate: checkTeacherFn, isPending: isLoadingCheckTeacher } = useMutation({
    mutationFn: (formData: FormData) => postRegisterTeacherImage(formData, teacherId),
    onSuccess: (data) => {
      if (data.success) {
        setSnackbarMessage(data.data.message || 'Image is Successfully registered');
        setSnackbarOpen(true);
        setIsCameraOpen(false);
        setImageUrlBack(null);
        setImageUrl('');
      }
      if (!data.success) {
        setSnackbarMessage(data.errorMessage || 'Something went wrong');
        setSnackbarOpen(true);
      }
    },
    onError: (error) => {
      setSnackbarMessage(error.message || 'Failed to recognize teacher.');
      setSnackbarOpen(true);
    }
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      pinfl: '',
      degree: '',
      position: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      phone: Yup.string().required('Required'),
      pinfl: Yup.string().required('Required'),
      degree: Yup.string().required('Required'),
      position: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      if (editingTeacher) {
        updateTeacherFn(values);
      } else {
        createTeacherFn(values);
      }
    }
  });

  const handleDelete = (id: number) => window.confirm('Are you sure you want to delete this teacher?') && deleteTeacherFn(id);

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, teacher: ITeacher) => {
    e.stopPropagation();
    setEditingTeacher(teacher);
    formik.setValues(teacher);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingTeacher(null);
    formik.resetForm();
    setOpen(false);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageUrl(imageSrc);
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
          setImageUrlBack(file);
        });
    }
  }, []);

  const checkTeacherDetails = () => {
    const formData = new FormData();
    if (teacherId && imageUrlBack) {
      formData.append('teacherId', teacherId);
      formData.append('file', imageUrlBack);
    }
    checkTeacherFn(formData);
  };

  const openTeacherImageRegisterModal = (teacher: ITeacher) => {
    setTeacherId(String(teacher.id));
    setIsCameraOpen(true);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Box sx={{ width: '100%', padding: '2rem 0.1rem', display: 'flex', justifyContent: 'end' }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Teacher
        </Button>
      </Box>

      {isLoading ? (
        <Loader />
      ) : (
        <Grid item xs={12} md={7} lg={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5">Teachers list</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <OrdersTable
              headCells={teachersHeadCells as ITeachersTableHead[]}
              data={teachersData.content}
              handleDelete={handleDelete}
              isLoadingDelete={isLoadingDeleteItem}
              openEditModal={handleEdit}
              checkTeacher={(id: number) => navigate(`check-teacher/${id}`)}
              openTeacherImageRegisterModal={openTeacherImageRegisterModal}
            />
            <TablePagination
              component="div"
              count={teachersData.paging.totalItems || 0}
              rowsPerPage={10}
              page={page}
              onPageChange={(_, newPage: number) => setPage(newPage)}
              rowsPerPageOptions={[]}
            />
          </MainCard>
        </Grid>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" mb={2}>
            {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            {Object.keys(formik.initialValues).map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="dense"
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                error={formik.touched[field] && Boolean(formik.errors[field])}
                helperText={formik.touched[field] && formik.errors[field]}
              />
            ))}
            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={isLoadingCreateTeacher || isLoadingUpdateTeacher}>
              {isLoadingCreateTeacher || isLoadingUpdateTeacher ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : editingTeacher ? (
                'Update'
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={isCameraOpen} onClose={() => setIsCameraOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2
          }}
        >
          <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, textAlign: 'center' }}>
            <Typography variant="h5" mb={2}>
              Enter Teacher ID
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="Teacher ID"
              variant="outlined"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              sx={{ mb: 2 }}
            />

            {isCameraOpen && (
              <Box sx={{ mb: 2 }}>
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height={200} />
                <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={capturePhoto}>
                  Capture Photo
                </Button>
              </Box>
            )}
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="Teacher Preview"
                sx={{ width: '100%', height: 200, objectFit: 'cover', mb: 2, borderRadius: 2 }}
              />
            )}
            <Button fullWidth variant="contained" disabled={!teacherId || isLoadingCheckTeacher} onClick={checkTeacherDetails}>
              {isLoadingCheckTeacher ? <CircularProgress size={20} /> : 'Submit ID'}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

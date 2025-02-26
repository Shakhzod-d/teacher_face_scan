import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Snackbar, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import Webcam from 'react-webcam';

import { fetchImagesServ, fetchItemsServ, postTeacherImage } from '../../services';
import { ITeacherImageResponse } from '../../types';
import Loader from '../../components/Loader';

export default function TeacherDetails() {
  const { id } = useParams();
  const [teacherId, setTeacherId] = useState(String(id));
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlBack, setImageUrlBack] = useState<File | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const [isRecognized, setIsRecognized] = useState(false);

  const { data: imageIdsResponse, isLoading: isImageIdsLoading } = useQuery<ITeacherImageResponse>({
    queryFn: () => fetchItemsServ(`${import.meta.env.VITE_PUBLIC_BASE_URL}api/v1/teacher/face/list/${teacherId}`),
    queryKey: ['fetchItemsServ', isRecognized],
    enabled: Boolean(teacherId),
    staleTime: 0
  });

  const {
    data: imagesData,
    isLoading: isImgLoading,
    refetch
  } = useQuery({
    queryFn: () =>
      fetchImagesServ(
        `${import.meta.env.VITE_PUBLIC_BASE_URL}api/v1/file/view/${imageIdsResponse?.data?.[imageIdsResponse?.data?.length - 1]?.imgId}`
      ),
    queryKey: ['fetchItemsServ', imageIdsResponse?.data?.length, teacherId],
    enabled: !!imageIdsResponse?.data?.length && !!teacherId,
    select: (blob) => URL.createObjectURL(blob),
    staleTime: 0
  });

  const { mutate: checkTeacherFn, isPending: isLoadingCheckTeacher } = useMutation({
    mutationFn: (formData: FormData) => postTeacherImage(formData, teacherId),
    onSuccess: (data) => {
      if (data.success) {
        setSnackbarMessage(
          `Name: ${data.data.fullName} ID: ${data.data.id} IMG_ID: ${data.data.imgId} RECOGNIZED: ${data.data.recognized}` || ''
        );
        setSnackbarOpen(true);
        setIsRecognized(true);
      }
      if (!data.success) {
        setSnackbarMessage(data.errorMessage || 'Something went wrong');
        setSnackbarOpen(true);
      }

      setImageUrl('');
      setImageUrlBack(null);
      setIsCameraOpen(false);
    },
    onError: (error) => {
      setSnackbarMessage(error.message || 'Failed to recognize teacher.');
      setSnackbarOpen(true);
    }
  });

  const checkTeacherDetails = () => {
    const formData = new FormData();
    if (teacherId && imageUrlBack) {
      formData.append('teacherId', teacherId);
      formData.append('file', imageUrlBack);
    }
    checkTeacherFn(formData);
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
      setIsCameraOpen(false);
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      setIsRecognized(false);
      refetch();
    }
  }, [teacherId, refetch]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', px: 4 }}>
      <Box sx={{ flex: 1, maxWidth: 400, textAlign: 'center', pr: 4 }}>
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

        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={() => setIsCameraOpen(true)}>
          Open Camera
        </Button>
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

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: '2px solid #ddd', height: '50vh' }}>
        {isImgLoading || isImageIdsLoading ? (
          <Loader />
        ) : (
          imagesData && (
            <Box
              component="img"
              src={imagesData}
              alt="Teacher Image"
              sx={{ width: '80%', maxHeight: '80%', objectFit: 'cover', mb: 2, borderRadius: 2 }}
            />
          )
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

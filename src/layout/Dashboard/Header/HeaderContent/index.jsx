import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import Profile from './Profile';
import MobileSection from './MobileSection';

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' }}>
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </Box>
  );
}

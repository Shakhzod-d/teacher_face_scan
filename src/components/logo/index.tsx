import { Link } from 'react-router-dom';

import { ButtonBase, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import config from '../../config';

const LogoSection = ({ sx, to }) => {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? config : to} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>ADMIN DASHBOARD</Typography>
      </Stack>
    </ButtonBase>
  );
};

export default LogoSection;

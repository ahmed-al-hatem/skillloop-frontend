import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Button from '@mui/material/Button';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { adminStrings } from '../strings';
import { flipInRtl } from '../theme/flipInRtl';

/** Link from the admin area back to the member site. */
export function BackToSiteLink() {
  return (
    <Button
      component={Link}
      to={ROUTES.home}
      fullWidth
      color="inherit"
      startIcon={<ArrowBackRoundedIcon sx={flipInRtl} />}
      sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}
    >
      {adminStrings.backToSite}
    </Button>
  );
}

import { Typography } from '@mui/material';
import ServiceData from '../ServiceData/ServiceData.tsx';

const CustomerHeader = () => {
  return (
    <>
      <Typography component="h2" variant="h5">
        Живая очередь
      </Typography>
      <ServiceData />
    </>
  );
};

export default CustomerHeader;

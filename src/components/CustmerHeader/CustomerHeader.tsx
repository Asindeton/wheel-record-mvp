import { Typography } from '@mui/material';
import ServiceData from '../ServiceData/ServiceData.tsx';

const CustomerHeader = ({ serviceName }: { serviceName?: string }) => {
  if (serviceName === undefined) return null;
  return (
    <>
      <Typography component="h2" variant="h5">
        Живая очередь
      </Typography>
      <ServiceData name={serviceName} />
    </>
  );
};

export default CustomerHeader;

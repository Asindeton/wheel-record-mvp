import { Typography } from '@mui/material';
import ServiceData from '../ServiceData/ServiceData.tsx';

const CustomerHeader = ({ serviceName, isEmployee }: { serviceName?: string; isEmployee?: boolean }) => {
  if (serviceName === undefined) return null;
  return (
    <>
      {!isEmployee && (
        <Typography component="h2" variant="h5">
          Живая очередь
        </Typography>
      )}
      <ServiceData name={serviceName} />
    </>
  );
};

export default CustomerHeader;

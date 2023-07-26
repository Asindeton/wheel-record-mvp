import { Typography } from '@mui/material';

const ServiceData = ({ name }: { name?: string }) => {
  return (
    <>
      <Typography component="p" variant={'body2'} mt={2} color={'#777'}>
        Шинный центр
      </Typography>
      {name && (
        <Typography component="p" mt={1}>
          {name}
        </Typography>
      )}
    </>
  );
};

export default ServiceData;

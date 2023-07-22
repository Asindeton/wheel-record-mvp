import { Typography } from '@mui/material';

const CustomerHeader = () => {
  return (
    <>
      <Typography component="h2" variant="h5">
        Живая очередь
      </Typography>
      <Typography component="p" mt={2}>
        Шинный центр
      </Typography>
      <Typography component="p" mt={1}>
        Москва, Загородное шоссе, д. 7, корп.1 (метро Тульская, Шаболовская)
      </Typography>
    </>
  );
};

export default CustomerHeader;

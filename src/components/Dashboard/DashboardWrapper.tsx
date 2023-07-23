import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { CustomerStatus, StatusToColor } from '../../constants/StatusData.ts';

interface IDashboardWrapper {
  status: CustomerStatus;
  items: ICar[];
}
const DashboardWrapper = (props: IDashboardWrapper) => {
  const { status, items } = props;

  return (
    <Box
      sx={{
        borderWidth: '20px',
        borderColor: StatusToColor[status],
        borderRadius: '29px',
        borderStyle: 'solid',
        padding: '1rem',
        height: '100%',
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Номер
        </Typography>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Пост
        </Typography>
      </Stack>
      <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={2} mt={1}>
        {items.length > 0 ? (
          items.map((el) => {
            return (
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack alignItems={'start'}>
                  <Box>
                    <Typography variant={'h5'}>Ш{el.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant={'h6'}>{el.car_number}</Typography>
                  </Box>
                </Stack>
                <Box>
                  <Typography variant={'h4'}>{el.post ?? 'Нет'}</Typography>
                </Box>
              </Stack>
            );
          })
        ) : (
          <Typography variant={'h3'}>Нет машин</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardWrapper;

import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Button, Stack, Typography } from '@mui/material';
import { StatusToColor } from '../../constants/StatusData.ts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useIntl } from 'react-intl';

type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

enum TIME_UNITS {
  SECOND = 1000,
  MINUTE = 60 * 1000,
  HOUR = 60 * 60 * 1000,
  DAY = 24 * 60 * 60 * 1000,
}

interface ICarItemProps {
  item: ICar;
  deleteHandler?: (item: ICar) => void;
  notifyHandler?: (id: number) => void;
}
const CarItem = ({ item, deleteHandler, notifyHandler }: ICarItemProps) => {
  const { formatRelativeTime, formatDate, formatTime } = useIntl();
  const timeDiff = new Date(item.created_at).getTime() - new Date().getTime();
  const [time, timeUnit] = getRelativeTimeOptions(timeDiff);
  return (
    <Box sx={{ borderRadius: '7px', padding: '15px', backgroundColor: StatusToColor[item.status] }}>
      <Stack>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
          <Box>
            <Typography>Номер {item.id}</Typography>
            <Typography component={'p'} variant={'caption'}>
              {item.contact_name}
            </Typography>
            <Typography component={'p'} variant={'caption'}>
              {item.contact_phone}
            </Typography>
          </Box>
          {deleteHandler && (
            <Button
              color={'error'}
              variant="outlined"
              onClick={() => {
                deleteHandler(item);
              }}
            >
              Удалить
            </Button>
          )}
        </Stack>
        <Box mt={1}>
          <Typography>{item.car_number}</Typography>
          <Typography component={'p'} variant={'caption'}>
            {item.car_model}
          </Typography>
        </Box>
        <Box mt={1}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <AccessTimeIcon />
            <Typography>
              {timeUnit !== 'day'
                ? formatRelativeTime(time as number, timeUnit as Unit, { numeric: 'auto' })
                : formatDate(item.created_at) + ' ' + formatTime(item.created_at)}
            </Typography>
          </Stack>
        </Box>
        {notifyHandler && (
          <Button color={'error'} variant="outlined">
            МАШИНА ГОТОВА
          </Button>
        )}
      </Stack>
    </Box>
  );
};

const getRelativeTimeOptions = (timeDiff = 0) => {
  const moduleTimeDiff = Math.abs(timeDiff);
  if (moduleTimeDiff < TIME_UNITS.MINUTE) {
    return [Math.floor(timeDiff / TIME_UNITS.SECOND), 'second'];
  } else if (moduleTimeDiff < TIME_UNITS.HOUR) {
    return [Math.floor(timeDiff / TIME_UNITS.MINUTE), 'minute'];
  } else if (moduleTimeDiff < TIME_UNITS.DAY) {
    return [Math.floor(timeDiff / TIME_UNITS.HOUR), 'hour'];
  }
  return [Math.floor(timeDiff / TIME_UNITS.DAY), 'day'];
};

export default CarItem;

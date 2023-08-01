import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CustomerStatus, StatusToColor } from '../../constants/StatusData.ts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useIntl } from 'react-intl';
import DoneIcon from '@mui/icons-material/Done';

type Unit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

enum TIME_UNITS {
  SECOND = 1000,
  MINUTE = 60 * 1000,
  HOUR = 60 * 60 * 1000,
  DAY = 24 * 60 * 60 * 1000,
}

const getTime = ({ d, h, i, s }: { d: number; h: number; i: number; s: number }) => {
  let time = 0;
  if (d) {
    time += d * TIME_UNITS.DAY;
  }
  if (h) {
    time += h * TIME_UNITS.HOUR;
  }
  if (i) {
    time += i * TIME_UNITS.MINUTE;
  }
  if (s) {
    time += s * TIME_UNITS.SECOND;
  }
  return time;
};

interface ICarItemProps {
  item: ICar;
  deleteHandler?: (item: ICar) => void;
  notifyHandler?: (item: ICar) => void;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
}

const CarItem = ({ item, deleteHandler, notifyHandler, provided }: ICarItemProps) => {
  const { formatRelativeTime, formatDate, formatTime } = useIntl();
  const timeDiff = -getTime(item.time_in_status);

  const [time, timeUnit] = getRelativeTimeOptions(timeDiff);

  if (timeUnit === 'hour') {
    console.log('time', time, timeUnit);
  }
  return (
    <Box
      sx={{
        borderRadius: '7px',
        padding: '15px',
        backgroundColor:
          item.status === CustomerStatus.ready ? StatusToColor[CustomerStatus.processed] : StatusToColor[item.status],
      }}
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      style={{
        ...provided?.draggableProps.style,
      }}
    >
      <Stack>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
          <Box>
            <Typography>Номер {item.number}</Typography>
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
              sx={{ backgroundColor: 'white' }}
              variant="outlined"
              onClick={() => {
                deleteHandler(item);
              }}
            >
              Удалить
            </Button>
          )}
        </Stack>
        <Stack mt={1} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Typography>{item.car_number}</Typography>
            <Typography component={'p'} variant={'caption'}>
              {item.car_brand} {item.car_model}
            </Typography>
          </Box>
          {item.make_first === 1 ? <Typography>П</Typography> : null}
        </Stack>
        <Box mt={1}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <AccessTimeIcon />
            <Typography>
              {timeUnit !== 'day'
                ? timeUnit === 'hour'
                  ? `${Math.abs(Math.round((time as number) / 60))}ч ${formatRelativeTime(
                      Math.round((time as number) % 60),
                      'minute',
                    )}`
                  : formatRelativeTime(time as number, timeUnit as Unit, { numeric: 'auto' })
                : formatDate(item.created_at) + ' ' + formatTime(item.created_at)}
            </Typography>
          </Stack>
        </Box>
        {notifyHandler && (
          <Stack mt={2} direction={'row'} alignItems={'center'} justifyContent={'start'}>
            <Button
              color={'error'}
              variant="outlined"
              sx={{ backgroundColor: 'white' }}
              onClick={() => {
                notifyHandler(item);
              }}
            >
              МАШИНА ГОТОВА
            </Button>
            {item.status === CustomerStatus.ready && (
              <Box ml={2}>
                <DoneIcon color={'error'} />
              </Box>
            )}
          </Stack>
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
    return [Math.floor(timeDiff / TIME_UNITS.MINUTE), 'hour'];
  }
  return [Math.floor(timeDiff / TIME_UNITS.DAY), 'day'];
};

export default CarItem;

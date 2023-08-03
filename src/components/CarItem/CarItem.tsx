import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Button, Stack, Typography } from '@mui/material';
import { CustomerStatus, StatusToColor } from '../../constants/StatusData.ts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import { useMemo } from 'react';
import { getTime } from '../../utils/time.ts';

interface ICarItemProps {
  item: ICar;
  deleteHandler?: (item: ICar) => void;
  notifyHandler?: (item: ICar) => void;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
}

const CarItem = ({ item, deleteHandler, notifyHandler, provided }: ICarItemProps) => {
  const calculateTime = useMemo(() => {
    if (!item.time_in_status) return 0;
    return getTime(item.time_in_status);
  }, [item.time_in_status]);

  const subTitleColor =
    item.status === CustomerStatus.processed || item.status === CustomerStatus.ready
      ? '#FFFFFF'
      : item.status === CustomerStatus.finish
      ? '#404040'
      : '#777777';

  return (
    <Box
      sx={{
        borderRadius: '7px',
        padding: '15px',
        border: '1px solid',
        borderColor: item.status === CustomerStatus.finish ? '#C4C4C4' : '#ADADAD',
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
            <Typography>
              {'Номер '}
              <Typography sx={{ fontWeight: 'bold' }} component={'span'}>
                {item.number}
              </Typography>
            </Typography>

            <Typography
              component={'p'}
              variant={'caption'}
              sx={{
                color: subTitleColor,
                fontSize: '14px',
              }}
            >
              {item.contact_name}
            </Typography>
            <Typography component={'p'} variant={'caption'} sx={{ color: subTitleColor, fontSize: '14px' }}>
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
            <Typography sx={{ fontWeight: 'bold' }}>{item.car_number}</Typography>
            <Typography component={'p'} variant={'caption'} sx={{ fontSize: '14px' }}>
              {item.car_brand} {item.car_model}
            </Typography>
          </Box>
          {item.make_first === 1 ? <Typography>П</Typography> : null}
        </Stack>
        <Box mt={1}>
          <Stack direction={'row'} justifyContent={'start'} alignItems={'center'} gap={2}>
            <AccessTimeIcon
              sx={{
                color:
                  item.status === CustomerStatus.processed || item.status === CustomerStatus.ready
                    ? '#FFFFFF'
                    : 'inherit',
              }}
            />
            <Typography
              sx={{
                color: subTitleColor,
              }}
            >
              {calculateTime}
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

export default CarItem;

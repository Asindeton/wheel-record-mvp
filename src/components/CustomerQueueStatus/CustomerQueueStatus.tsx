import { Box, Button, Typography } from '@mui/material';
import CustomerFooter from '../CustomerFooter/CustomerFooter.tsx';
import { CustomerStatus, StatusToColor } from '../../constants/StatusData.ts';
import { ICar } from '../../api/queue/QueueApi.ts';
import { IPost } from '../../api/post/PostApi.ts';

interface CustomerQueueStatusProps {
  data: ICar | undefined;
  status?: CustomerStatus;
  getOutClickHandler: (isFinish: boolean) => void;
  postData?: IPost[];
}

const CustomerStatusList = {
  [CustomerStatus.new]: {
    color: StatusToColor[CustomerStatus.new],
    body: 'Ожидайте приглашения',
    footer: <CustomerFooter />,
    actionText: 'Уйти из очереди',
    isFinish: false,
  },
  [CustomerStatus.processed]: {
    color: StatusToColor[CustomerStatus.processed],
    body: 'Вас пригласили на пост №{postNumber}',
    footer: 'Сейчас Ваша очередь.',
    actionText: 'Уйти из очереди',
    isFinish: false,
  },
  [CustomerStatus.ready]: {
    color: StatusToColor[CustomerStatus.ready],
    body: 'Машина готова',
    footer: 'Можете оплатить обслуживание и забрать машину.',
    actionText: '',
    isFinish: false,
  },
  [CustomerStatus.finish]: {
    color: StatusToColor[CustomerStatus.finish],
    body: 'Запись выполнена',
    footer: 'Спасибо за посещение!',
    actionText: 'Встать в очередь',
    isFinish: true,
  },
};
const CustomerQueueStatus = (props: CustomerQueueStatusProps) => {
  const { data, status, getOutClickHandler, postData } = props;
  const currentStatus = CustomerStatusList[status!];

  if (!currentStatus || !data) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          borderWidth: '20px',
          borderColor: currentStatus.color,
          borderRadius: '29px',
          borderStyle: 'solid',
          padding: '2rem',
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Ваш номер <b>{data.number}</b>
        </Typography>
        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 800 }} mt={2}>
          {currentStatus.body.replace('{postNumber}', String(postData?.find((el) => el.id === data.post_id)?.number))}
        </Typography>
      </Box>
      <Box mt={2}>{currentStatus.footer}</Box>
      {currentStatus?.actionText && (
        <Box mt={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              getOutClickHandler(currentStatus.isFinish);
            }}
            color="error"
          >
            {currentStatus.actionText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomerQueueStatus;

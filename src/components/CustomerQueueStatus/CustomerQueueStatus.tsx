import { Box, Button, Typography } from '@mui/material';
import CustomerFooter from '../CustomerFooter/CustomerFooter.tsx';

interface CustomerQueueStatusProps {
  status: number;
  getOutClickHandler: () => void;
}
const CustomerStatusList = [
  { color: '#DEE222', body: 'Ожидайте приглашения', footer: <CustomerFooter />, actionText: 'Уйти из очереди' },
  {
    color: '#21A038',
    body: 'Вас пригласили на пост №1',
    footer: 'Сейчас Ваша очередь.',
    actionText: 'Уйти из очереди',
  },
  {
    color: '#A274FF',
    body: 'Машина готова',
    footer: 'Можете оплатить обслуживание и забрать машину.',
  },
  { color: '#ADADAD', body: 'Запись выполнена', footer: 'Спасибо за посещение!', actionText: 'Встать в очередь' },
];
const CustomerQueueStatus = (props: CustomerQueueStatusProps) => {
  const currentStatus = CustomerStatusList[Math.abs(props.status) % CustomerStatusList.length];
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
          Ваш номер <b>Номер</b>
        </Typography>
        <Typography variant="h5" sx={{ textAlign: 'center' }} mt={2}>
          {currentStatus.body}
        </Typography>
      </Box>
      <Box mt={2}>{currentStatus.footer}</Box>
      {currentStatus.actionText && (
        <Box mt={3}>
          <Button variant="contained" fullWidth onClick={props.getOutClickHandler} color="error">
            {currentStatus.actionText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomerQueueStatus;

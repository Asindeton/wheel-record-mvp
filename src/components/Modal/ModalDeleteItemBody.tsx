import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Typography } from '@mui/material';

interface IModalDeleteItemBody {
  item: ICar | null;
  subTitle: string;
}
const ModalDeleteItemBody = ({ item, subTitle }: IModalDeleteItemBody) => {
  if (!item) return null;
  return (
    <Box>
      <Typography>{subTitle}</Typography>
      <Box mt={2}>
        <Typography>Номер очереди</Typography>
        <Typography>{item.number}</Typography>
      </Box>
      <Box mt={2}>
        <Typography>Клиент</Typography>
        <Typography>{item.contact_name}</Typography>
        <Typography>{item.contact_phone}</Typography>
      </Box>
      <Box mt={2}>
        <Typography>Автомобиль</Typography>
        <Typography>{item.car_number}</Typography>
        <Typography>{item.car_brand}</Typography>
        <Typography>{item.car_model}</Typography>
      </Box>
    </Box>
  );
};

export default ModalDeleteItemBody;

import { Typography } from '@mui/material';
import { shopId } from '../../constants/ShopData.ts';
import { useGetCountQuery } from '../../api/queue/QueueApi.ts';
import { CustomerStatus } from '../../constants/StatusData.ts';

const CustomerFooter = ({ isEmployee }: { isEmployee?: boolean }) => {
  const { data: countData } = useGetCountQuery({ shop_id: shopId, status: [CustomerStatus.new, CustomerStatus.ready] });
  const text = isEmployee ? 'Перед клиентом' : 'Перед вами';
  return (
    <>
      <Typography>
        {text}: {countData ?? 0}
      </Typography>
      <Typography>Примерное время ожидания: 30 минут</Typography>
    </>
  );
};

export default CustomerFooter;

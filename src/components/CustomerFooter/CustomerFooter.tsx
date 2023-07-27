import { Typography } from '@mui/material';
import { shopId } from '../../constants/ShopData.ts';
import { useGetCountQuery } from '../../api/queue/QueueApi.ts';
import { CustomerStatus } from '../../constants/StatusData.ts';
import { useSearchParams } from 'react-router-dom';

const CustomerFooter = ({ isEmployee }: { isEmployee?: boolean }) => {
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;
  const { data: countData } = useGetCountQuery({
    shop_id: queryShopId,
    status: [CustomerStatus.new, CustomerStatus.processed],
  });
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

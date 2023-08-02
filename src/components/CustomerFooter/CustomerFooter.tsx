import { Typography } from '@mui/material';
import { shopId } from '../../constants/ShopData.ts';
import { useGetCountQuery, useGetTimeQuery } from '../../api/queue/QueueApi.ts';
import { CustomerStatus } from '../../constants/StatusData.ts';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { getTime } from '../../utils/time.ts';

const CustomerFooter = ({ isEmployee }: { isEmployee?: boolean }) => {
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;

  const { data: countData } = useGetCountQuery({
    shop_id: queryShopId,
    status: [CustomerStatus.new],
  });

  const { data: timeData } = useGetTimeQuery({
    shop_id: queryShopId,
    status: [CustomerStatus.new],
  });

  const calculateTime = useMemo(() => {
    if (!timeData) return 0;
    return getTime(timeData);
  }, [timeData]);

  const text = isEmployee ? 'Перед клиентом' : 'Перед вами';
  return (
    <>
      <Typography>
        {text}: {countData ?? 0}
      </Typography>
      <Typography>Примерное время ожидания: {calculateTime}</Typography>
    </>
  );
};

export default CustomerFooter;

import { Typography } from '@mui/material';
import { shopId } from '../../constants/ShopData.ts';
import { useGetCountQuery, useGetTimeQuery } from '../../api/queue/QueueApi.ts';
import { CustomerStatus } from '../../constants/StatusData.ts';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

const CustomerFooter = ({ isEmployee }: { isEmployee?: boolean }) => {
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;

  const { data: countData } = useGetCountQuery({
    shop_id: queryShopId,
    status: [CustomerStatus.new, CustomerStatus.processed],
  });

  const { data: timeData } = useGetTimeQuery({
    shop_id: queryShopId,
    status: [CustomerStatus.new, CustomerStatus.processed],
  });

  const calculateTime = useMemo(() => {
    if (!timeData) return 0;
    const { d, h, i, s } = timeData;
    let result = '';
    if (d) result += `${d} дней `;
    if (h) result += h === 1 ? `${h} час ` : h > 4 ? `${h} часов ` : `${h} часа `;
    if (i) result += `${i} минут `;
    if (s) result += `${s} секунд `;
    return result;
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

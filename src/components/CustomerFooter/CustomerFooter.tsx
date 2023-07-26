import { Typography } from '@mui/material';
import { useGetShopAsCustomerQuery } from '../../api/customer/CustomerApi.ts';
import { shopId } from '../../constants/ShopData.ts';

const CustomerFooter = ({ isEmployee }: { isEmployee?: boolean }) => {
  const { data } = useGetShopAsCustomerQuery({ id: shopId });
  const text = isEmployee ? 'Перед клиентом' : 'Перед вами';
  return (
    <>
      <Typography>
        {text}: {data?.posts_count ?? 0}
      </Typography>
      <Typography>Примерное время ожидания: 30 минут</Typography>
    </>
  );
};

export default CustomerFooter;

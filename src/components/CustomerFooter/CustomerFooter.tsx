import { Typography } from '@mui/material';
import { useGetShopAsCustomerQuery } from '../../api/customer/CustomerApi.ts';
import { shopId } from '../../constants/ShopData.ts';

const CustomerFooter = () => {
  const { data } = useGetShopAsCustomerQuery({ id: shopId });
  return (
    <>
      <Typography>Перед вами: {data?.posts_count ?? 0}</Typography>
      <Typography>Примерное время ожидания: 30 минут</Typography>
    </>
  );
};

export default CustomerFooter;

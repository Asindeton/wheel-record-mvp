import CustomerHeader from '../../../components/CustmerHeader/CustomerHeader.tsx';
import { Box } from '@mui/material';
import CustomerQueueStatus from '../../../components/CustomerQueueStatus/CustomerQueueStatus.tsx';
import { useCookies } from 'react-cookie';
import {
  useDeleteRecordCustomerMutation,
  useGetRecordCustomerQuery,
  useGetShopAsCustomerQuery,
} from '../../../api/customer/CustomerApi.ts';
import { shopId } from '../../../constants/ShopData.ts';
import FullScreenLoading from '../../../components/FullScreenLoading/FullScreenLoading.tsx';
const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';

export const CustomerQueue = () => {
  const [cookie, , removeCookie] = useCookies([cookieName]);
  const { data, isLoading } = useGetRecordCustomerQuery({ id: cookie[cookieName] });
  const { data: shopData, isLoading: isLoadingShopData } = useGetShopAsCustomerQuery({ id: shopId });
  const [deleteRecord, { isLoading: isLoadingDelete }] = useDeleteRecordCustomerMutation();

  const getOutClickHandler = async () => {
    try {
      await deleteRecord({ id: cookie[cookieName] });
      removeCookie(cookieName, { path: '/' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'start',
      }}
    >
      <CustomerHeader serviceName={shopData?.name} />
      <Box mt={2}>
        <CustomerQueueStatus status={data?.status} getOutClickHandler={getOutClickHandler} />
      </Box>
      <FullScreenLoading open={isLoading || isLoadingShopData || isLoadingDelete} />
    </Box>
  );
};

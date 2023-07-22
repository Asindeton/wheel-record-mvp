import CustomerHeader from '../../../components/CustmerHeader/CustomerHeader.tsx';
import { Box, Button } from '@mui/material';
import CustomerQueueStatus from '../../../components/CustomerQueueStatus/CustomerQueueStatus.tsx';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';

export const CustomerQueue = () => {
  const [status, setStatus] = useState<number>(0);
  const [, , removeCookie] = useCookies([cookieName]);
  const getOutClickHandler = () => {
    removeCookie(cookieName, { path: '/' });
  };

  return (
    <Box
      sx={{
        textAlign: 'start',
      }}
    >
      <CustomerHeader />
      {/*// TODO убрать после подключения беке*/}
      <Box mt={2}>
        <Button
          onClick={() => {
            setStatus(status - 1);
          }}
        >
          prev
        </Button>
        <Button
          onClick={() => {
            setStatus(status + 1);
          }}
        >
          next
        </Button>
      </Box>
      <Box mt={2}>
        <CustomerQueueStatus status={status} getOutClickHandler={getOutClickHandler} />
      </Box>
    </Box>
  );
};

import { ICar } from '../../api/queue/QueueApi.ts';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { CustomerStatus, StatusToColor } from '../../constants/StatusData.ts';
import { IPost, useGetPostsQuery } from '../../api/post/PostApi.ts';
import { useSearchParams } from 'react-router-dom';
import { shopId } from '../../constants/ShopData.ts';
import { useMemo } from 'react';

interface IDashboardWrapper {
  status: CustomerStatus;
  items: ICar[];
}
const sortListHelper = (list: ICar[]): ICar[] => {
  return list.sort((a, b) => a.sort - b.sort);
};

const DashboardWrapper = (props: IDashboardWrapper) => {
  const { status, items } = props;

  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;
  const { data: postData } = useGetPostsQuery({ shop_id: queryShopId });

  const postDictionary: { [key: string]: IPost } = useMemo(() => {
    if (!postData) return {};
    return postData?.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: item,
      };
    }, {});
  }, [postData]);

  return (
    <Box
      sx={{
        borderWidth: '20px',
        borderColor: StatusToColor[status],
        borderRadius: '29px',
        borderStyle: 'solid',
        padding: '1rem',
        height: '100%',
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Номер
        </Typography>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Пост
        </Typography>
      </Stack>
      <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={2} mt={1}>
        {sortListHelper(items).map((el) => {
          return (
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} key={el.number}>
              <Stack alignItems={'start'}>
                <Box>
                  <Typography variant={'h5'}>{el.number}</Typography>
                </Box>
                <Box>
                  <Typography variant={'h6'}>{el.car_number}</Typography>
                </Box>
              </Stack>
              <Box>
                <Typography variant={'h4'}>
                  {postDictionary[String(el.post_id!) as keyof typeof postDictionary]?.number ?? 'Нет'}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DashboardWrapper;

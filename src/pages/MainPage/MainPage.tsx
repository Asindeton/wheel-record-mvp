import EmployeeHeader from '../../components/EmployeeHeader/EmployeeHeader.tsx';
import { useGetShopQuery } from '../../api/shop/ShopApi.ts';
import { useEffect, useMemo, useState } from 'react';
import { shopId } from '../../constants/ShopData.ts';
import { Box, Grid, Stack, Typography } from '@mui/material';
import EmployeeControlArea from '../../components/EmployeeControlArea/EmployeeControlArea.tsx';
import { CustomerStatus } from '../../constants/StatusData.ts';
import { ICar, useDeleteRecordMutation, useGetQueueQuery } from '../../api/queue/QueueApi.ts';
import CarItem from '../../components/CarItem/CarItem.tsx';
import Modal from '../../components/Modal/Modal.tsx';
import ModalDeleteItemBody from '../../components/Modal/ModalDeleteItemBody.tsx';
import ModalItemAction from '../../components/Modal/ModalItemAction.tsx';

export interface IQueueItems {
  newCars: ICar[];
  processedCars: ICar[];
  readyCars: ICar[];
}

interface IModalContext {
  data: ICar | null;
  type: 'delete' | 'notify' | null;
  message?: string;
}

export const MainPage = () => {
  const [deleteRecord] = useDeleteRecordMutation();
  const { data: shopData } = useGetShopQuery({ id: shopId });
  const { data } = useGetQueueQuery({ shop_id: shopId });
  const initialState: IQueueItems = { processedCars: [], readyCars: [], newCars: [] };
  const [modalContext, setModalContext] = useState<IModalContext | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { processedCars, readyCars, newCars } = useMemo(() => {
    if (!data) return { ...initialState };
    return data.reduce(
      (acc, item) => {
        if (item.status === CustomerStatus.processed) {
          acc.processedCars.push(item);
        } else if (item.status === CustomerStatus.ready) {
          acc.readyCars.push(item);
        } else if (item.status === CustomerStatus.new) {
          acc.newCars.push(item);
        }
        return acc;
      },
      { ...initialState },
    );
  }, [data]);

  useEffect(() => {
    document.body.classList.add('main-page');
    document.body.querySelector('#root')?.classList.add('main-page');
    return () => {
      document.body.classList.remove('main-page');
      document.body.querySelector('#root')?.classList.remove('main-page');
    };
  }, []);

  const cancelHandler = () => {
    setModalOpen(false);
    setTimeout(() => {
      setModalContext(null);
    }, 300);
  };
  const selectDeleteItemHandler = (item: ICar) => {
    setModalContext({
      type: 'delete',
      data: item,
      message: 'Удалить из очереди?',
    });
    setModalOpen(true);
  };
  const deleteHandler = async (id: number) => {
    try {
      await deleteRecord({ id });
      setModalOpen(false);
      setTimeout(() => {
        setModalContext(null);
      }, 300);
    } catch (e) {
      console.log(e);
    }
  };

  const notifyHandler = async (id: number) => {
    console.log('notifyHandler', id);
  };

  return (
    <>
      <EmployeeHeader />
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Box>
          <EmployeeControlArea shopData={shopData} />
        </Box>
        <Box mt={5}>
          <Grid container columnSpacing={{ xs: 1, sm: 3, md: 12 }}>
            <Grid item xs={4}>
              <Typography variant={'h5'}>Ожидают: {newCars.length}</Typography>
              <Stack direction={'column'} gap={2} mt={4}>
                {newCars.map((item) => {
                  return (
                    <CarItem
                      item={item}
                      key={item.id + '_' + item.contact_name}
                      deleteHandler={selectDeleteItemHandler}
                    />
                  );
                })}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Typography variant={'h5'}>Приглашены: {processedCars.length}</Typography>
              <Stack direction={'column'} gap={2} mt={4}>
                {processedCars.map((item) => {
                  return <CarItem item={item} key={item.id + '_' + item.contact_name} />;
                })}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Typography variant={'h5'}>Завершены: {readyCars.length}</Typography>
              <Stack direction={'column'} gap={2} mt={4}>
                {readyCars.map((item) => {
                  return <CarItem item={item} key={item.id + '_' + item.contact_name} notifyHandler={notifyHandler} />;
                })}
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Modal
          isOpen={isModalOpen}
          setIsOpen={setModalOpen}
          title={modalContext?.message}
          text={<ModalDeleteItemBody item={modalContext?.data ?? null} subTitle={''} />}
          actions={
            <ModalItemAction
              cancelHandler={() => {
                cancelHandler();
              }}
              acceptHandler={() => {
                if (modalContext?.data) {
                  deleteHandler(modalContext?.data?.id);
                }
              }}
            />
          }
        />
      </Box>
    </>
  );
};

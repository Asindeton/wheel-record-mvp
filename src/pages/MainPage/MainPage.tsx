import EmployeeHeader from '../../components/EmployeeHeader/EmployeeHeader.tsx';
import { useGetShopQuery } from '../../api/shop/ShopApi.ts';
import { useEffect, useState } from 'react';
import { shopId } from '../../constants/ShopData.ts';
import { Box, Grid, Stack, Typography } from '@mui/material';
import EmployeeControlArea from '../../components/EmployeeControlArea/EmployeeControlArea.tsx';
import { CustomerStatus } from '../../constants/StatusData.ts';
import { ICar, useDeleteRecordMutation, useGetQueueQuery } from '../../api/queue/QueueApi.ts';
import CarItem from '../../components/CarItem/CarItem.tsx';
import Modal from '../../components/Modal/Modal.tsx';
import ModalDeleteItemBody from '../../components/Modal/ModalDeleteItemBody.tsx';
import ModalItemAction from '../../components/Modal/ModalItemAction.tsx';
import { DragDropContext, Draggable, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../../components/StrictModeDroppable/StrictModeDroppable.tsx';

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

const dropWight = {
  newCars: 1,
  processedCars: 2,
  readyCars: 3,
};

const reorder = (list: Array<object>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: ICar[],
  destination: ICar[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
) => {
  const sourceClone = Array.from(source!);
  const destClone = Array.from(destination!);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  return {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };
};

export const MainPage = () => {
  const [deleteRecord] = useDeleteRecordMutation();
  const { data: shopData } = useGetShopQuery({ id: shopId });
  const { data } = useGetQueueQuery({ shop_id: shopId });
  const initialState: IQueueItems = { processedCars: [], readyCars: [], newCars: [] };
  const [modalContext, setModalContext] = useState<IModalContext | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [list, setList] = useState<IQueueItems>({
    ...initialState,
  });

  useEffect(() => {
    if (data) {
      const { processedCars, readyCars, newCars } = data.reduce(
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
      setList({ processedCars, readyCars, newCars });
    }
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    const sourceWeight = dropWight[source.droppableId as keyof typeof dropWight];
    const destinationWeight = dropWight[destination?.droppableId as keyof typeof dropWight];
    if (!destination) return;
    if (sourceWeight === destinationWeight) {
      setList((prevState) => {
        const newData = reorder(
          prevState[source.droppableId as keyof typeof prevState],
          source.index,
          destination.index,
        );
        return {
          ...prevState,
          [source.droppableId!]: newData,
        };
      });
    }
    if (source.droppableId !== destination.droppableId) {
      if (destinationWeight > sourceWeight) {
        // move up

        setList((prevState) => {
          const newData = move(
            prevState[source.droppableId as keyof typeof prevState],
            prevState[destination.droppableId as keyof typeof prevState],
            source,
            destination,
          );
          console.log({ newData, result });
          return {
            ...prevState,
            [source.droppableId!]: newData[source.droppableId!],
            [destination.droppableId!]: newData[destination.droppableId!],
            // [destination.droppableId!]: newData[destination.droppableId!].map((el, index) => {
            //   if (index === destination.index) {
            //     const newStatus =
            //       destination.droppableId === 'processedCars' ? CustomerStatus.processed : CustomerStatus.ready;
            //     console.log(destination.droppableId);
            //     return {
            //       ...el,
            //       status: newStatus,
            //     };
            //   }
            // }),
          };
        });
      } else {
        // move down
        return;
      }
    }
  };

  useEffect(() => {
    console.log({ list });
  }, [list]);

  return (
    <>
      <EmployeeHeader />
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Box>
          <EmployeeControlArea shopData={shopData} />
        </Box>
        <Box mt={5}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container columnSpacing={{ xs: 1, sm: 3, md: 12 }}>
              <Grid item xs={4}>
                <Typography variant={'h5'}>Ожидают: {list.newCars.length}</Typography>
                <StrictModeDroppable droppableId="newCars">
                  {(providedDroppable) => (
                    <Stack
                      direction={'column'}
                      gap={2}
                      mt={4}
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {list.newCars.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id + '_' + item.contact_name} index={index}>
                            {(providedDraggable, snapshotDraggable) => (
                              <CarItem
                                provided={providedDraggable}
                                snapshot={snapshotDraggable}
                                item={item}
                                deleteHandler={selectDeleteItemHandler}
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {providedDroppable.placeholder}
                    </Stack>
                  )}
                </StrictModeDroppable>
              </Grid>

              <Grid item xs={4}>
                <Typography variant={'h5'}>Приглашены: {list.processedCars.length}</Typography>
                <StrictModeDroppable droppableId="processedCars">
                  {(providedDroppable) => (
                    <Stack
                      direction={'column'}
                      gap={2}
                      mt={4}
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {list.processedCars.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id + '_' + item.contact_name} index={index}>
                            {(providedDraggable, snapshotDraggable) => (
                              <CarItem provided={providedDraggable} snapshot={snapshotDraggable} item={item} />
                            )}
                          </Draggable>
                        );
                      })}
                      {providedDroppable.placeholder}
                    </Stack>
                  )}
                </StrictModeDroppable>
              </Grid>

              <Grid item xs={4}>
                <Typography variant={'h5'}>Завершены: {list.readyCars.length}</Typography>
                <StrictModeDroppable droppableId="readyCars">
                  {(providedDroppable) => (
                    <Stack
                      direction={'column'}
                      gap={2}
                      mt={4}
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {list.readyCars.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id + '_' + item.contact_name} index={index}>
                            {(providedDraggable, snapshotDraggable) => (
                              <CarItem
                                provided={providedDraggable}
                                snapshot={snapshotDraggable}
                                item={item}
                                key={item.id + '_' + item.contact_name}
                                notifyHandler={notifyHandler}
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {providedDroppable.placeholder}
                    </Stack>
                  )}
                </StrictModeDroppable>
              </Grid>
            </Grid>
          </DragDropContext>
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

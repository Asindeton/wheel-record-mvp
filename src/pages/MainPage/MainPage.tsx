import { useGetShopQuery } from '../../api/shop/ShopApi.ts';
import { useEffect, useState } from 'react';
import { shopId } from '../../constants/ShopData.ts';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import EmployeeControlArea from '../../components/EmployeeControlArea/EmployeeControlArea.tsx';
import { CustomerStatus } from '../../constants/StatusData.ts';
import {
  ICar,
  IUpdateCarRequestParams,
  useDeleteRecordMutation,
  useEditQueueMutation,
  useGetQueueQuery,
} from '../../api/queue/QueueApi.ts';
import CarItem from '../../components/CarItem/CarItem.tsx';
import Modal from '../../components/Modal/Modal.tsx';
import ModalDeleteItemBody from '../../components/Modal/ModalDeleteItemBody.tsx';
import ModalItemAction from '../../components/Modal/ModalItemAction.tsx';
import { DragDropContext, Draggable, DraggableLocation, DropResult } from 'react-beautiful-dnd';
import StrictModeDroppable from '../../components/StrictModeDroppable/StrictModeDroppable.tsx';
import { useSearchParams } from 'react-router-dom';
import { useGetPostsQuery } from '../../api/post/PostApi.ts';
import CustomerForm from '../Customer/CustomerForm/CustomerForm.tsx';

export interface IQueueItems {
  newCars: ICar[];
  processedCars: ICar[];
  finishCars: ICar[];
}

interface IModalContext {
  data: ICar | null;
  type: 'delete' | 'notify' | 'create' | 'callNextCar' | null;
  message?: string;
  subTitle?: string;
  postId?: number;
  isHaveProcessedCar?: boolean;
}

const dropWight = {
  newCars: 1,
  processedCars: 2,
  finishCars: 3,
};

const sortListHelper = (list: ICar[]): ICar[] => {
  return list;
  // return list.sort((a, b) => {
  //   // if (a.make_first && b.make_first) return a.sort - b.sort;
  //   // if (a.make_first) return -1;
  //   // if (b.make_first) return 1;
  //   return a.sort - b.sort;
  // });
};
const getDroppableId = (id: string) => {
  return id.includes('_') ? id.split('_')[0] : id;
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
    [getDroppableId(droppableSource.droppableId)]: sourceClone,
    [getDroppableId(droppableDestination.droppableId)]: destClone,
  };
};

export const MainPage = () => {
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;
  const [deleteRecord] = useDeleteRecordMutation();
  const [editRecord] = useEditQueueMutation();
  const { data: shopData } = useGetShopQuery({ id: queryShopId });
  const { data: postData } = useGetPostsQuery({ shop_id: queryShopId });
  const { data } = useGetQueueQuery({ shop_id: queryShopId }, { pollingInterval: 3000 });
  const initialState: IQueueItems = { processedCars: [], finishCars: [], newCars: [] };
  const [modalContext, setModalContext] = useState<IModalContext | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [list, setList] = useState<IQueueItems>({
    ...initialState,
  });
  const [forceRerender, setForceRerender] = useState<number>(0);
  const [firstNewCar, setFirstNewCar] = useState<ICar | null>(null);

  const updateRecord = async (item: ICar, newStatus?: CustomerStatus, top_id?: number, bottom_id?: number) => {
    try {
      const requestData: IUpdateCarRequestParams = {
        ...item,
        status: newStatus ?? item.status,
        top_id,
        bottom_id,
      };

      Object.keys(requestData).forEach((key) =>
        requestData[key as keyof typeof requestData] === undefined
          ? delete requestData[key as keyof typeof requestData]
          : {},
      );

      await editRecord(requestData);
      if (isModalOpen) {
        setModalOpen(false);
        setTimeout(() => {
          setModalContext(null);
        }, 300);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const cancelHandler = () => {
    setForceRerender((prev) => prev + 1);
    setModalOpen(false);
    setTimeout(() => {
      setModalContext(null);
    }, 300);
  };

  const createNewRecord = async () => {
    setModalContext({
      type: 'create',
      data: null,
      message: 'Добавить в очередь',
    });
    setModalOpen(true);
  };
  const selectDeleteItemHandler = (item: ICar) => {
    setModalContext({
      type: 'delete',
      data: item,
      message: 'Удалить из очереди',
      subTitle: 'Удалить из очереди?',
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

  const notifyHandler = async (item: ICar) => {
    setModalContext({
      type: 'notify',
      data: item,
      message: 'Машина готова',
      subTitle: 'Подтвердить готовность машины?',
    });
    setModalOpen(true);
  };

  const callNextCar = (postId: number, isHaveProcessedCar: boolean, newCar: ICar) => {
    setModalContext({
      type: 'callNextCar',
      data: newCar,
      message: 'Позвать следующего',
      subTitle: isHaveProcessedCar
        ? 'Позвать следующую машину? Текущая запись будет завершена. Из ожидающих будет приглашена машина:'
        : 'Позвать следующую машину? Из ожидающих будет приглашена машина:',
      postId,
      isHaveProcessedCar,
    });
    setFirstNewCar(newCar);
    setModalOpen(true);
  };

  const callNextHandler = async () => {
    try {
      if (modalContext?.data && firstNewCar && modalContext?.postId) {
        const filteredCars = list.processedCars.filter((el) => el.post_id === modalContext?.postId);
        if (modalContext.isHaveProcessedCar && filteredCars.length > 0) {
          updateRecord(filteredCars[0], CustomerStatus.finish);
        }
        updateRecord({ ...firstNewCar, post_id: modalContext.postId }, CustomerStatus.processed);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = getDroppableId(source?.droppableId);
    const destinationId = getDroppableId(destination?.droppableId);

    const sourceWeight = dropWight[sourceId as keyof typeof dropWight];
    const destinationWeight = dropWight[destinationId as keyof typeof dropWight];

    if (sourceWeight === destinationWeight) {
      setList((prevState) => {
        const draggableCar = prevState[sourceId as keyof typeof prevState].find(
          (el) => el.id === Number(result.draggableId.split('_')[0]),
        );

        const newData = reorder(prevState[sourceId as keyof typeof prevState], source.index, destination.index);

        let upperId, bottomID;
        (newData as ICar[]).forEach((item, index, array) => {
          if (item.id === draggableCar?.id) {
            upperId = index - 1 >= 0 ? array[index - 1].id : undefined;
            bottomID = index + 1 < array.length ? array[index + 1].id : undefined;
          }
        });

        if (draggableCar) {
          updateRecord(draggableCar, draggableCar.status, upperId, bottomID);
        }

        return {
          ...prevState,
          [sourceId!]: newData.map((item, index) => {
            if ((item as ICar).sort === index + 1) return item;
            return {
              ...item,
              sort: index + 1,
            };
          }),
        };
      });
    }

    if (sourceId !== destinationId) {
      if (destinationWeight > sourceWeight) {
        // move up
        const destination_post_id = Number(destination?.droppableId.split('_')[1]);
        const source_post_id = Number(source?.droppableId.split('_')[1]);

        setList((prevState) => {
          const draggableCar = prevState[sourceId as keyof typeof prevState].find(
            (el) => el.id === Number(result.draggableId.split('_')[0]),
          );

          if (destinationId === 'processedCars' && !isNaN(destination_post_id)) {
            const carListOnPost = prevState[destinationId as keyof typeof prevState].filter(
              (item) => item.post_id === destination_post_id,
            );
            const droppableCar = prevState[sourceId as keyof typeof prevState][source.index];
            callNextCar(destination_post_id, carListOnPost.length > 0, droppableCar);
            if (carListOnPost.length > 0) {
              return prevState;
            }
          }

          const newData = move(
            prevState[sourceId as keyof typeof prevState].filter((item) => {
              if (!isNaN(source_post_id)) {
                return item.post_id === source_post_id;
              }
              return true;
            }),
            prevState[destinationId as keyof typeof prevState],
            source,
            destination,
          );

          let upperId, bottomID;

          (newData[destinationId!] as ICar[]).forEach((item, index, array) => {
            if (item.id === draggableCar?.id) {
              upperId = index - 1 >= 0 ? array[index - 1].id : undefined;
              bottomID = index + 1 < array.length ? array[index + 1].id : undefined;
            }
          });

          const newStatus = destinationId.replace('Cars', '');
          if (newStatus === CustomerStatus.finish && draggableCar) {
            updateRecord(draggableCar, CustomerStatus.finish, upperId, bottomID);
          }
          let transformDestination = newData[destinationId!];

          if (!isNaN(destination_post_id)) {
            transformDestination = newData[destinationId!].map((item, index) => {
              if (index === destination.index) {
                return {
                  ...item,
                  post_id: destination_post_id,
                };
              }
              return item;
            });
          }

          if (!isNaN(source_post_id)) {
            newData[sourceId!] = prevState[sourceId as keyof typeof prevState].filter(
              (item) => item.post_id !== source_post_id,
            );
          }

          return {
            ...prevState,
            [sourceId!]: newData[sourceId!],
            [destinationId!]: transformDestination.map((item) => {
              const newStatus = destinationId.replace('Cars', '');
              const itemDraggableId = item.id + '_' + item.contact_name;

              if (result.draggableId === itemDraggableId) {
                if (item.status !== newStatus) {
                  return {
                    ...item,
                    status: CustomerStatus[newStatus as keyof typeof CustomerStatus],
                  };
                }
              }

              return item;
            }),
          };
        });
      } else {
        // move down
        return;
      }
    }
  };

  useEffect(() => {
    if (data) {
      const { processedCars, finishCars, newCars } = data.reduce(
        (acc, item) => {
          if (item.status === CustomerStatus.processed || item.status === CustomerStatus.ready) {
            acc.processedCars.push(item);
          } else if (item.status === CustomerStatus.finish) {
            acc.finishCars.push(item);
          } else if (item.status === CustomerStatus.new) {
            acc.newCars.push(item);
          }
          return acc;
        },
        { ...initialState },
      );
      setList({
        processedCars: sortListHelper(processedCars),
        finishCars: sortListHelper(finishCars),
        newCars: sortListHelper(newCars),
      });
    }
  }, [data, forceRerender]);

  useEffect(() => {
    document.body.classList.add('main-page');
    document.body.querySelector('#root')?.classList.add('main-page');
    return () => {
      document.body.classList.remove('main-page');
      document.body.querySelector('#root')?.classList.remove('main-page');
    };
  }, []);

  return (
    <>
      <Box sx={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1rem' }}>
        <Box>
          <EmployeeControlArea shopData={shopData} createNewRecordHandler={createNewRecord} />
        </Box>
        <Box mt={5}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container columnSpacing={{ xs: 1, sm: 3, md: 12 }}>
              <Grid item xs={4}>
                <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                  Ожидают: {list.newCars.length}
                </Typography>
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
                <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                  Приглашены: {list.processedCars.length}
                </Typography>
                <Stack direction={'column'} gap={2} mt={4}>
                  {postData?.map((item) => {
                    const filteredCars = list.processedCars.filter((el) => el.post_id === item.id);
                    return (
                      <Stack key={item.id}>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                          <Typography variant={'h6'}>Пост {item.number}</Typography>
                          <Button
                            color={'error'}
                            variant={'contained'}
                            disabled={list.newCars.length === 0}
                            onClick={() => {
                              callNextCar(item.id, filteredCars.length > 0, list.newCars[0]);
                            }}
                          >
                            ПОЗВАТЬ СЛЕДУЮЩЕГО
                          </Button>
                        </Stack>
                        <StrictModeDroppable droppableId={'processedCars_' + item.id}>
                          {(providedDroppable) => (
                            <Stack
                              direction={'column'}
                              gap={2}
                              mt={4}
                              {...providedDroppable.droppableProps}
                              ref={providedDroppable.innerRef}
                            >
                              {filteredCars.map((itemCar, index) => {
                                return (
                                  <Draggable
                                    key={itemCar.id}
                                    draggableId={itemCar.id + '_' + itemCar.contact_name}
                                    index={index}
                                  >
                                    {(providedDraggable, snapshotDraggable) => (
                                      <CarItem
                                        provided={providedDraggable}
                                        snapshot={snapshotDraggable}
                                        item={itemCar}
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
                      </Stack>
                    );
                  })}
                </Stack>
              </Grid>

              <Grid item xs={4}>
                <Typography variant={'h5'} sx={{ fontWeight: 'bold' }}>
                  Завершены: {list.finishCars.length}
                </Typography>
                <StrictModeDroppable droppableId="finishCars">
                  {(providedDroppable) => (
                    <Stack
                      direction={'column'}
                      gap={2}
                      mt={4}
                      {...providedDroppable.droppableProps}
                      ref={providedDroppable.innerRef}
                    >
                      {list.finishCars.map((item, index) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id + '_' + item.contact_name} index={index}>
                            {(providedDraggable, snapshotDraggable) => (
                              <CarItem
                                provided={providedDraggable}
                                snapshot={snapshotDraggable}
                                item={item}
                                key={item.id + '_' + item.contact_name}
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
          text={() => {
            if (
              modalContext?.type === 'delete' ||
              modalContext?.type === 'notify' ||
              modalContext?.type === 'callNextCar'
            ) {
              return <ModalDeleteItemBody item={modalContext?.data ?? null} subTitle={modalContext?.subTitle ?? ''} />;
            }
            if (modalContext?.type === 'create') {
              return (
                <CustomerForm
                  isEmployee={true}
                  cancelHandler={() => {
                    cancelHandler();
                  }}
                />
              );
            }
            return '';
          }}
          actions={() => {
            if (
              modalContext?.type === 'delete' ||
              modalContext?.type === 'notify' ||
              modalContext?.type === 'callNextCar'
            ) {
              return (
                <ModalItemAction
                  cancelHandler={() => {
                    cancelHandler();
                  }}
                  acceptHandler={() => {
                    if (modalContext?.data) {
                      if (modalContext?.type === 'notify') {
                        updateRecord(modalContext.data, CustomerStatus.ready);
                      }
                      if (modalContext?.type === 'delete') {
                        deleteHandler(modalContext.data?.id);
                      }
                      if (modalContext.type === 'callNextCar') {
                        callNextHandler();
                      }
                    }
                  }}
                />
              );
            }
            return null;
          }}
        />
      </Box>
    </>
  );
};

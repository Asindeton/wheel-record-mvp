import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Box, Button, Checkbox, FormControlLabel, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import CustomerHeader from '../../../components/CustmerHeader/CustomerHeader.tsx';
import CustomerFooter from '../../../components/CustomerFooter/CustomerFooter.tsx';
import { ErrorMessage } from '../../../constants/ErrorMessage.ts';
import { VALIDATION_REGEX } from '../../../constants/ValidationRegExp.ts';
import { useAddRecordCustomerMutation, useGetShopAsCustomerQuery } from '../../../api/customer/CustomerApi.ts';
import { INewCar } from '../../../api/queue/QueueApi.ts';
import { shopId } from '../../../constants/ShopData.ts';
import { useState } from 'react';
import { CustomerStatus } from '../../../constants/StatusData.ts';
import { useSearchParams } from 'react-router-dom';
import { red } from '@mui/material/colors';

interface IError {
  data: {
    error: string;
  };
}
interface IFormInput {
  name: string;
  phone: string;
  carNumber: string;
  carBrand: string;
  carModel: string;
  isFirst: boolean;
}

const defaultValues: IFormInput = {
  name: '',
  phone: '+7',
  carNumber: '',
  carBrand: '',
  carModel: '',
  isFirst: false,
};

const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';
const cookieMaxAge = import.meta.env.VITE_COOKIE_AGE ?? '43200';

export const CustomerForm = ({ isEmployee, cancelHandler }: { isEmployee?: boolean; cancelHandler?: () => void }) => {
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;
  const { data: shopData } = useGetShopAsCustomerQuery({ id: queryShopId });
  const [isOpenErrorSnackBar, setIsOpenErrorSnackBar] = useState<boolean>(false);
  const [, setCookie] = useCookies([cookieName]);
  const [addRecord, { error }] = useAddRecordCustomerMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const formData: INewCar = {
        shop_id: queryShopId,
        contact_name: data.name,
        contact_phone: data.phone,
        car_number: data.carNumber,
        car_brand: data.carBrand,
        car_model: data.carModel,
        status: CustomerStatus.new,
        type: isEmployee ? 'manager' : 'client',
        make_first: data.isFirst ? 1 : 0,
      };
      const response = await addRecord(formData).unwrap();
      console.log(response);
      if (isEmployee && cancelHandler) {
        cancelHandler();
      }
      if (!isEmployee) {
        setCookie(cookieName, response.id, { path: '/', maxAge: cookieMaxAge });
      }
    } catch (e) {
      setIsOpenErrorSnackBar(true);
    }
  };

  const closeErrorSnackBar = () => {
    setIsOpenErrorSnackBar(false);
  };

  return (
    <Box
      sx={{
        textAlign: 'start',
      }}
    >
      {!isEmployee && <CustomerHeader serviceName={shopData?.name} />}
      <Box mt={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="body2" color={'#777'}>
            {isEmployee ? 'Клиент' : 'Ваши данные'}
          </Typography>
          <Controller
            name="name"
            control={control}
            rules={{
              required: ErrorMessage.required,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Имя*"
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                sx={{ marginTop: '10px' }}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: ErrorMessage.required,
              pattern: {
                value: VALIDATION_REGEX.phone,
                message: 'Номер телефона должен быть в формате +7XXXXXXXXXX',
              },
            }}
            // Ввод номера телефона.
            // При постановке курсора в поле +7 не убирать, не давать ввести после +7 число 7 и не давать удалять +7.
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                type={'tel'}
                label="+7"
                onChange={(e) => {
                  if (!e.target.value.startsWith('+7')) {
                    return false;
                  }
                  field.onChange(e);
                }}
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
          <Typography variant="body2" mt={3} color={'#777'}>
            Автомобиль
          </Typography>
          <Controller
            name="carNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} variant="outlined" label="Госномер" fullWidth sx={{ marginTop: '10px' }} />
            )}
          />
          <Typography variant="body2" fontStyle={'italic'} color={'#777'}>
            Если нет номера, пропустите поле
          </Typography>
          <Controller
            name="carBrand"
            control={control}
            rules={{
              required: ErrorMessage.required,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Марка*"
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                sx={{ marginTop: '10px' }}
              />
            )}
          />
          <Controller
            name="carModel"
            control={control}
            rules={{
              required: ErrorMessage.required,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Модель*"
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
          {isEmployee && (
            <Box mt={2}>
              <Controller
                name="isFirst"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        sx={{
                          color: red[800],
                          '&.Mui-checked': {
                            color: red[600],
                          },
                        }}
                      />
                    }
                    label="Поставить первым"
                  />
                )}
              />
            </Box>
          )}

          <Box mt={2}>
            <CustomerFooter isEmployee={isEmployee} />
          </Box>
          <Box
            mt={2}
            sx={{
              textAlign: 'center',
            }}
          >
            {!isEmployee ? (
              <Button type={'submit'} variant={'contained'} fullWidth color={'error'}>
                Встать в очередь
              </Button>
            ) : (
              <Grid container columnSpacing={{ xs: 1, sm: 3, md: 4 }} mt={5}>
                <Grid item xs={6}>
                  <Button
                    onClick={cancelHandler}
                    color={'error'}
                    fullWidth
                    variant="outlined"
                    sx={{ backgroundColor: 'white' }}
                  >
                    Нет
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button type={'submit'} color={'error'} variant={'contained'} fullWidth>
                    Да
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </form>
      </Box>
      <Snackbar open={isOpenErrorSnackBar} autoHideDuration={6000} onClose={closeErrorSnackBar}>
        <Alert onClose={closeErrorSnackBar} severity="error" sx={{ width: '100%' }}>
          {(error as IError)?.data?.error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerForm;

import EmployeeHeader from '../../components/EmployeeHeader/EmployeeHeader.tsx';
import { useGetShopQuery } from '../../api/shop/ShopApi.ts';
import { useEffect } from 'react';
import { shopId } from '../../constants/ShopData.ts';

export const MainPage = () => {
  const { data } = useGetShopQuery({ id: shopId });

  useEffect(() => {
    document.body.classList.add('main-page');
    document.body.querySelector('#root')?.classList.add('main-page');
    return () => {
      document.body.classList.remove('main-page');
      document.body.querySelector('#root')?.classList.remove('main-page');
    };
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {});

  return <EmployeeHeader />;
};

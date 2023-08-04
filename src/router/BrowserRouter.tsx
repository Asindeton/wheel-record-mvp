import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from '../pages';
import { CustomerForm, CustomerQueue } from '../pages/Customer';
import { useCookies } from 'react-cookie';
import { redirect } from 'react-router-dom';
import { Dashboard, EmployeeAuth } from '../pages/Employe';
import { useAppSelector } from '../store/hooks.ts';

const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';

export const BrowserRouter = () => {
  const token = useAppSelector((state) => state.auth.access_token);
  const [cookies] = useCookies([cookieName]);

  const router = createBrowserRouter([
    {
      path: '/',
      loader: () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const params = new URL(document.location).searchParams.toString();
        return redirect(['/customers', params].filter((item) => item).join('?'));
      },
    },
    {
      path: '/admin',
      element: <MainPage />,
      loader: () => checkAuth(token),
    },
    {
      path: '/employees/login',
      element: <EmployeeAuth />,
      loader: () => {
        if (token) {
          return redirect(`/`);
        }
        return null;
      },
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
      loader: () => checkAuth(token),
    },
    {
      path: '/customers',
      element: <CustomerForm />,
      loader: () => {
        if (cookies[cookieName]) {
          return redirect(`/customers/${cookies[cookieName]}`);
        }
        return null;
      },
    },
    {
      path: '/customers/:id',
      element: <CustomerQueue />,
      loader: (param) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const params = new URL(document.location).searchParams.toString();
        if (!cookies[cookieName]) {
          return redirect(['/customers', params].filter((item) => item).join('?'));
        }
        if (cookies[cookieName] !== param.params.id) {
          return redirect(`/customers/${cookies[cookieName]}`);
        }
        return null;
      },
    },
    {
      path: '*',
      loader: () => redirect(`/`),
    },
  ]);

  return <RouterProvider router={router} />;
};

const checkAuth = (token: string) => {
  if (!token) {
    return redirect(`/employees/login`);
  }
  return null;
};

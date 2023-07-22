import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from '../pages';
import { CustomerForm, CustomerQueue } from '../pages/Customer';
import { useCookies } from 'react-cookie';
import { redirect } from 'react-router-dom';

const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';

export const BrowserRouter = () => {
  const [cookies] = useCookies([cookieName]);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
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
        if (!cookies[cookieName]) {
          return redirect(`/customers`);
        }
        if (cookies[cookieName] !== param.params.id) {
          return redirect(`/customers/${cookies[cookieName]}`);
        }
        return null;
      },
    },
  ]);

  return <RouterProvider router={router} />;
};

import './App.css';
import { store } from './store';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from './router';
import { CookiesProvider } from 'react-cookie';
import { IntlProvider } from 'react-intl';
function App() {
  return (
    <Provider store={store}>
      <IntlProvider locale="ru" defaultLocale="ru">
        <CookiesProvider>
          <CssBaseline />
          <BrowserRouter />
        </CookiesProvider>
      </IntlProvider>
    </Provider>
  );
}

export default App;

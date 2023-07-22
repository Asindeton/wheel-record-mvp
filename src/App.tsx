import './App.css';
import { store } from './store';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from './router';
import { CookiesProvider } from 'react-cookie';
function App() {
  return (
    <Provider store={store}>
      <CookiesProvider>
        <CssBaseline />
        <BrowserRouter />
      </CookiesProvider>
    </Provider>
  );
}

export default App;

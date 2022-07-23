import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Layout from '../components/Layout/Layout';
import { SnackbarProvider } from 'notistack';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache,}) {
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;

import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Layout from '../components/Layout/Layout';
import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache,}) {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);  

  if (isSSR) return null;
  return (
    <CacheProvider value={emotionCache}>
      <SnackbarProvider anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Provider store={store}>
          <PayPalScriptProvider deferLoading={true}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PayPalScriptProvider>
        </Provider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;



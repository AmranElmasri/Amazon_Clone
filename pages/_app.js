import '../styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Layout from '../components/Layout/Layout';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SnackbarProvider>
    </CacheProvider>
  );
}

export default MyApp;


import '../styles/globals.css'
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { store } from '../store/store';
import { Provider } from 'react-redux';
import Layout from '../components/Layout/Layout';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache, }) {
  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </CacheProvider>
  )
}

export default MyApp

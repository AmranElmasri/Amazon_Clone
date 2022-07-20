import '../styles/globals.css'
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Layout from './components/Layout/Layout';

const clientSideEmotionCache = createCache({ key: 'css' });

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache, }) {
  return (
    <CacheProvider value={emotionCache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CacheProvider>
  )
}

export default MyApp

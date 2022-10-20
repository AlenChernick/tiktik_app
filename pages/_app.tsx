import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <>
      <Head>
        <title>TikTik - Make Your Day</title>
        <meta property='og:title' content='TikTik - Make Your Day' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon.ico' />
      </Head>
      <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
        <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
          <Navbar />
          <div className='flex gap-6 md:gap-20'>
            <div className='h-[92vh] overflow-hidden xl:hover:overflow-auto'>
              <Sidebar />
            </div>
            <div className='mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export default MyApp;

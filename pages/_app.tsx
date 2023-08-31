import '../styles/globals.scss';

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return <Component {...pageProps} />;
}

export default MyApp;

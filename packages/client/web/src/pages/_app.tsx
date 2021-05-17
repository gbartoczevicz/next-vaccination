import React from 'react';
import { AppProps } from 'next/app';

import { ThemeContext } from '@/context/theme';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeContext>
    <Component {...pageProps} />
  </ThemeContext>
);

export default App;

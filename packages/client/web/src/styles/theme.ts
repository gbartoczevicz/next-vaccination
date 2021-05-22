import { extendTheme } from '@chakra-ui/react';

export const Theme = extendTheme({
  styles: {
    global: {
      body: { background: 'gray.50', color: 'black' }
    }
  },
  fonts: {
    body: '"Work Sans", sans-serif',
    heading: '"Work Sans", sans-serif',
    mono: 'Menlo, monospace'
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700
  }
});

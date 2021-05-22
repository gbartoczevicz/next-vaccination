import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { Theme } from '@/styles/theme';

export const ThemeContext: React.FC = ({ children }) => <ChakraProvider theme={Theme}>{children}</ChakraProvider>;

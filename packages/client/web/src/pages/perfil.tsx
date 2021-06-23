import React, { useCallback, useRef } from 'react';
import {
    Flex,
    Box,
    Text,
    SimpleGrid,
    Heading,
    Button,
    HStack,
    Avatar
} from '@chakra-ui/react';

import { CardPatient, Container } from '@/components';

import { MdFavorite as Heart } from 'react-icons/md';

const groupButtonStyle = {
    colorScheme: "#617480",
    variant: "link",
    fontSize: '20px',
    border: 'none',
    fontWeight: 'normal',
    _hover: {
        background: "white",
        color: "#6C63FF",
    },
    marginRight: "10",
    marginLeft: "10",
}

const Perfil: React.FC = () => {
    return (
        <Container title="dashboard">
           <Text>PERFIL</Text>
        </Container>
    )
}

export default Perfil;
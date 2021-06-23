import React from 'react';
import {
    Flex,
    Box,
    useToast,
    Stack,
    HStack,
    Link,
    Button,
    Menu,
    MenuButton,
    Portal,
    MenuList,
    MenuItem,
    BoxProps,
    Divider,
    Avatar,
    Text,
    position,
    background,
    SimpleGrid

} from '@chakra-ui/react';

import { Navigation, CardNotification } from '@/components';

interface iContainer {
    title: string;
}

const arrNotification = [
    {
        description: 'Profissional da saúde 01 acessou pela primeira vez o sistema às 14:34 do dia 13 de março',
        status: 'ProfessionalEnter'
    },
    {
        description: 'O estoque do lote X atingiu menos de 20% da capacidade às 14:34 do dia 11/05',
        status: 'Cancelled'
    },
    {
        description: 'O estoque do lote X atingiu 30% da capacidade às 11:00 de hoje',
        status: 'StockUp'
    },
    {
        description: 'O estoque do lote X atingiu menos de 20% da capacidade às 14:34 do dia 11/05',
        status: 'StockDown'
    },
    {
        description: 'O estoque do lote X atingiu menos de 20% da capacidade às 14:34 do dia 11/05',
        status: 'Cancelled'
    },
]


export const Container: React.FC<iContainer> = ({ children }) => (
    <Flex h="100vh" w="100vw">
        <Box p="0 1.8rem 0 1.8rem" d="flex" flexDirection="column" justifyContent="center" backgroundColor="white">
            <Navigation />
        </Box>

        <Box flex="1" p="4rem 7.3rem 0px 7.3rem" overflowY="scroll" justifyContent="center">
            {children}
        </Box>

        <Box p="0px 1.5rem 0px 1.5rem" flex="0.3" alignItems="center" backgroundColor="white" >
            <Flex marginTop="5rem" direction="column" alignItems="center">
                <Box backgroundColor="white">
                    <Avatar size="2xl" name="Luiz Eduardo"
                        src="https://png.pngtree.com/png-vector/20200329/ourlarge/pngtree-hospital-icon-design-illustration-png-image_2166843.jpg"
                    />{" "}
                </Box>
                <Flex my="5" backgroundColor="white" alignItems="center" flexDirection="column">
                    <Text as="strong">Hospital Dr Anísio Figueiredo</Text>
                    <Text as="h2">Luiz Eduardo</Text>
                </Flex>
                <Divider w="15rem" background="#F5F8FA" />
                <Flex my="5" alignItems="center" w="95%" flexDirection="column">
                    <Text fontSize="md" as="strong">Notificações</Text>
                    <Flex m="2.5rem" w="100%" flexDirection="column" maxHeight="25rem" overflow="hidden">
                        <Flex flexDirection="column" alignItems="center" overflow="auto" marginRight="-50px">
                            {arrNotification.map(data => (
                                <CardNotification status={data.status} description={data.description} />
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    </Flex>
)

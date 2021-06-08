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
    Text
} from '@chakra-ui/react';

import Navigation from '@/components/navigation';

interface iContainer extends BoxProps {
    title: string;
}

const Container: React.FC<iContainer> = ({ children }) => {
    return (
        <Flex h="100vh" w="100vw">
            <Box p="5" backgroundColor="white">
                <Navigation />
            </Box>

            <Box flex="1" p="7.3rem" overflowY="scroll" justifyContent="center">
                {children}
            </Box>

            <Box flex="0.3" justifyContent="center" backgroundColor="white" >
                <Flex marginTop="5rem" direction="column" alignItems="center">
                    <Box backgroundColor="white">
                        <Avatar size="2xl" name="Luiz Eduardo"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGKkltcrQYLKiGR-VL0svDJ5RTFpZ1N4toe8SNARA6Lv7PLcj-mfGnRLRXb3ao-xMPuA&usqp=CAU"
                        />{" "}
                    </Box>
                    <Box my="5" backgroundColor="white" alignItems="center">
                        <Text as="strong">Nome do Hospital</Text>
                        <Text as="h2">Luiz Eduardo</Text>
                    </Box>
                    <Divider w="15rem" background="#F5F8FA" />
                    <Flex my="5">
                        AREA DE NOTIFICAÇÃO
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Container;
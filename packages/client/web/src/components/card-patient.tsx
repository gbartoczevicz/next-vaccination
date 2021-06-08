import React from 'react';
import {
    Flex,
    Box,
    Text,
    SimpleGrid,
    Heading,
    Button,
    HStack,
    Avatar,
    BoxProps

} from '@chakra-ui/react';

import { MdFavorite as Heart, MdDateRange as Calendar, MdEventAvailable as AppointmentConcluded, MdEventBusy as CancelledAppointment } from 'react-icons/md';

interface IMainFormContainerProps extends BoxProps {
    avatar: string;
    status: string;
    name: string;
    phone: string;
    taxNumber: string;
    createdTime: string;
    confirmedTime: string;
}

export const CardPatient: React.FC<IMainFormContainerProps> = ({ avatar, status, name, phone, taxNumber, createdTime, confirmedTime }) => {

    const colorIcon = status === "Concluded" ? "#00BFA6" : "#F50057"

    return (
        <Flex color="#617480" flexDirection="column" maxWidth="17rem" minHeight="18rem" alignItems="center" borderRadius="20px" bg="white" p="5" marginTop="5">
            <Avatar marginBottom="1rem" size="xl" name={name} src={avatar} />
            <Text as="strong">{name}</Text>
            <Text fontSize="sm">{`${phone} | ${taxNumber}`}</Text>

            <Flex alignItems="center" marginTop="10">
                <Flex flexDirection="row" marginRight="10" alignItems="center">
                    <Text fontSize="30px">
                        <Calendar />
                    </Text>
                    <Text fontSize="lg">{createdTime}</Text>
                </Flex>
                <Flex flexDirection="row" color={colorIcon} alignItems="center">
                    <Text fontSize="30px">
                        {status === "Concluded" && (
                            < AppointmentConcluded />
                        )}
                        {status === "Cancelled" && (
                            < CancelledAppointment />
                        )}

                    </Text>
                    <Text fontSize="lg">{confirmedTime}</Text>
                </Flex>
            </Flex>
        </Flex >
    )
};
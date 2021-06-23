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

interface CardPatientContainerProps {
    avatar: string;
    status: string;
    name: string;
    phone: string;
    taxNumber: string;
    createdTime: string;
    confirmedTime: string;
}

export const CardPatient: React.FC<CardPatientContainerProps> = ({ avatar, status, name, phone, taxNumber, createdTime, confirmedTime }) => (
    <Flex color="#617480" flexDirection="column" maxWidth="17rem" minHeight="15rem" alignItems="center" borderRadius="8px" bg="white" p="5" marginTop="5">
        <Avatar marginBottom="1rem" size="xl" name={name} src={avatar} />
        <Text as="strong">{name}</Text>
        <Text marginTop="2" fontSize="13px">{`${phone} | ${taxNumber}`}</Text>

        <Flex alignItems="center" marginTop="10" p="1rem">
            <Flex marginRight="10" alignItems="center">
                <Text fontSize="30px">
                    <Calendar />
                </Text>
                <Text fontSize="lg">{createdTime}</Text>
            </Flex>
            {status !== "PENDING" && (
                <Flex color={status === "CONCLUDED" ? "#00BFA6" : "#F50057"} alignItems="center">
                    <Text fontSize="30px">
                        {status === "CONCLUDED" && (
                            <AppointmentConcluded />
                        )}
                        {status === "CANCELED" && (
                            <CancelledAppointment />
                        )}
                    </Text>
                    <Text fontSize="lg">{confirmedTime}</Text>
                </Flex>
            )}
        </Flex>
    </Flex>
);
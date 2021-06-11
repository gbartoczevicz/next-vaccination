import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react'
import { MdEventBusy as CancelledAppointment, MdAddBox as Vector, MdPersonAdd as ProfessionalEnter } from 'react-icons/md';

interface ICardNotification {
    description: string;
    status: string;
}

function selectIcon(status: string) {
    let icon;
    switch (status) {
        case "Cancelled":
            icon = (<CancelledAppointment color="red" />);
            break;
        case "StockUp":
            icon = (< Vector color ="#F9A826"/>)
            break;
        case "StockDown":
            icon = (< Vector color ="red"/>)
            break;
        case "ProfessionalEnter":
            icon = (<ProfessionalEnter color="#00BFA6" />)
            break;
    }

    return icon;
}

export const CardNotification: React.FC<ICardNotification> = ({ status, description }) => {

    const [iconNotification, setIconNotification] = useState(null);

    useEffect(() => {
        const icon = selectIcon(status);
        setIconNotification(icon);
    });

    return (
        <Flex borderRadius="8px" marginBottom="3" bg="#F5F8FA" w="80%" p="3" color="white">
            <Text h="100%" fontSize="2xl" marginRight="5">
                {iconNotification}
            </Text>
            <Text color="black" lineHeight="1" fontSize="md">{description}</Text>
        </Flex>
    )
}
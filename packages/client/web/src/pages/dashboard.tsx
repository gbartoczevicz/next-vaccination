import React, { useEffect, useState } from 'react';
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
import { getResource } from '../../services/dashboard'

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


const listCases = [
    {
        name: 'Mateus',
        phone: '(043) 40028922',
        taxNumber: '999.999.999-99',
        status: 'PENDING',
        timeVaccinated: '8:00',
        appointment: '14:00',
    },
    {
        name: 'Gabriel',
        phone: '(043) 40028922',
        taxNumber: '999.999.999-99',
        status: 'CONCLUDED',
        timeVaccinated: '8:00',
        appointment: '19:00',
    },
    {
        name: 'Guilherme',
        phone: '(043) 40028922',
        taxNumber: '999.999.999-99',
        status: 'CANCELED',
        timeVaccinated: '8:00',
        appointment: '8:00',
    },
    {
        name: 'Pedro',
        phone: '(043) 40028922',
        taxNumber: '999.999.999-99',
        status: 'PENDING',
        timeVaccinated: '8:00',
        appointment: '9:00',
    },
]

const DashBoard: React.FC = () => {
    const [data, setData] = useState({});
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [columnMorning, setColumnMorning] = useState([]);
    const [columnEvening, setColumnEvening] = useState([]);
    const [columnNight, setColumnNight] = useState([]);

    async function loadData() {
        const data = await getResource();
        console.log(data)
        await setData(data);
        await filterData();
    }

    function filterData() {
        const Morning: object[] = [];
        const Evening: object[] = [];
        const Night: object[] = [];

        // const { patients } = data;


        // patients.map(function (item) {

        //     if (statusFilter === "ALL" || statusFilter === item.status) {
        //         const [hors, minutes] = item.appointment.split(":");

        //         if (parseInt(hors) >= 13 && parseInt(hors) < 18) {
        //             Evening.push(item)
        //         } else if (parseInt(hors) >= 18) {
        //             Night.push(item);
        //         } else {
        //             Morning.push(item);
        //         }
        //     }
        // })

        setColumnMorning(Morning);
        setColumnNight(Night);
        setColumnEvening(Evening);
    }

    useEffect(() => {
        filterData();
    }, [statusFilter])

    useEffect(() => {
        loadData();
    }, [])

    return (
        <Container title="dashboard">
            <Box width="100%">
                <Flex justifyContent="space-between">
                    <Box>
                        <Heading as="h3">Progresso de vacinação </Heading>
                    </Box>
                    <Flex p="1" bg="white" width="45rem" borderRadius="8px" justifyContent="space-between">
                        <Button {...groupButtonStyle}>Hoje</Button>
                        <Button {...groupButtonStyle}> Ultimos 7 dias</Button>
                        <Button {...groupButtonStyle}>Ultimos 30 dias</Button>
                        <Button {...groupButtonStyle}> Todo tempo</Button>
                    </Flex>
                </Flex>


                <Flex w="100%" justifyContent="space-around" marginTop="3rem">

                    <Box color="#617480" borderRadius="20px" bg="white" height="8rem" width="20rem" p="5">
                        <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
                            <Text fontSize="23">
                                <Heart />
                            </Text>
                            <Text marginLeft="5" fontSize="xl">Total</Text>
                        </Box>
                        <Box alignItems="center" paddingLeft="5" paddingRight="5" bg="white" d="flex" justifyContent="space-between">
                            <Heading fontSize="40">
                                80%
                            </Heading>
                            <Text fontSize="25">80 / 100</Text>
                        </Box>
                    </Box >

                    <Box color="#617480" justifyContent="space-between" borderRadius="20px" bg="white" height="8rem" width="20rem" p="5">
                        <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
                            <Text fontSize="23">
                                <Heart />
                            </Text>
                            <Text marginLeft="5" fontSize="xl">Prioritário</Text>
                        </Box>
                        <Box alignItems="center" paddingLeft="5" paddingRight="5" bg="white" d="flex" justifyContent="space-between">
                            <Heading fontSize="40">
                                80%
                            </Heading>
                            <Text fontSize="25">80 / 100</Text>
                        </Box>
                    </Box >

                    <Box color="#617480" justifyContent="space-between" borderRadius="20px" bg="white" height="8rem" width="20rem" p="5">
                        <Box paddingLeft="5" bg="white" d="flex" alignItems="center">
                            <Text fontSize="23">
                                <Heart />
                            </Text>
                            <Text marginLeft="5" fontSize="xl">Baixa Prioridade</Text>
                        </Box>
                        <Box alignItems="center" paddingLeft="5" paddingRight="5" bg="white" d="flex" justifyContent="space-between">
                            <Heading fontSize="40">
                                80%
                            </Heading>
                            <Text fontSize="25">80 / 100</Text>
                        </Box>
                    </Box >
                </Flex>

                <Flex marginTop="20" marginBottom="10" flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Heading as="h3">Agendamentos</Heading>
                    </Box>
                    <Flex p="1" bg="white" width="45rem" borderRadius="8px">
                        <Button {...groupButtonStyle} onClick={() => setStatusFilter("PENDING")}>Pendentes</Button>
                        <Button {...groupButtonStyle} onClick={() => setStatusFilter("VACCINETED")}>Vacinados</Button>
                        <Button {...groupButtonStyle} onClick={() => setStatusFilter("CANCELED")}>Cancelados</Button>
                        <Button {...groupButtonStyle} onClick={() => setStatusFilter("ALL")}>Todos</Button>
                    </Flex>
                </Flex>

                <Flex justifyContent="space-around">
                    <Box alignItems="center" w="20rem">
                        <Text fontSize="23">Manhã</Text>
                        {columnMorning.map(item => (
                            <CardPatient status={item.status} avatar=""
                                name={item.name} phone={item.phone} taxNumber={item.taxNumber} createdTime={item.appointment} confirmedTime={item.timeVaccinated} />
                        ))}
                    </Box>


                    <Box alignItems="center" w="20rem">
                        <Text fontSize="23">Tarde</Text>
                        {columnEvening.map(item => (
                            <CardPatient status={item.status} avatar=""
                                name={item.name} phone={item.phone} taxNumber={item.taxNumber} createdTime={item.appointment} confirmedTime={item.timeVaccinated} />
                        ))}
                    </Box>

                    <Box alignItems="center" w="20rem">
                        <Text fontSize="23">Noite</Text>
                        {columnNight.map(item => (
                            <CardPatient status={item.status} avatar=""
                                name={item.name} phone={item.phone} taxNumber={item.taxNumber} createdTime={item.appointment} confirmedTime={item.timeVaccinated} />
                        ))}
                    </Box>
                </Flex>
            </Box>
        </Container>
    )
}

export default DashBoard;
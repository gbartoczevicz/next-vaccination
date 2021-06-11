import React from 'react';
import {
  Stack,
  Box,
  Text,
  Flex,
  Icon,
  Button,
  Tooltip,
  Link as ChakraLink
} from '@chakra-ui/react';
import { MdHome as Inicio, MdPeople as Contato, MdPerson as Perfil, MdAddBox as Hospital, MdPowerSettingsNew as Sair } from 'react-icons/md';
import Link from 'next/link'

const styleLink = {
  color: "#617480",
  variant: "link",
  size: "lg",
  fontSize: "24px",
  _hover: {
    background: "white",
    color: "#6C63FF",
  }
}

export const Navigation: React.FC = () => (
  <Stack spacing="35px">
    <Box>
      <Tooltip label="Inicio" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/dashboard">
            <Inicio />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip label="Pacientes" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/pacient">
            <Contato />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip label="Perfil" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/perfil">
            <Perfil />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip label="Hospital" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/hospital">
            <Hospital />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip label="Sair" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/">
            <Sair color="red" />
          </Link>
        </Button>
      </Tooltip>
    </Box>
  </Stack>
);


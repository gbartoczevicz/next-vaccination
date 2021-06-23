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
import { MdHome as Home, MdPeople as Pacient, MdPerson as Perfil, MdAddBox as Hospital, MdPowerSettingsNew as Logout } from 'react-icons/md';
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
      <Tooltip placement="right" label="Inicio" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/dashboard">
            <Home />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip placement="right" label="Pacientes" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/pacient">
            <Pacient />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip placement="right" label="Perfil" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/perfil">
            <Perfil />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip placement="right" label="Hospital" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/hospital">
            <Hospital />
          </Link>
        </Button>
      </Tooltip>
    </Box>
    <Box>
      <Tooltip placement="right" label="Sair" aria-label="A tooltip">
        <Button {...styleLink}>
          <Link href="/">
            <Logout color="red" />
          </Link>
        </Button>
      </Tooltip>
    </Box>
  </Stack>
);


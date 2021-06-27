import React from 'react';
import { Stack, Tooltip, IconButton, Box } from '@chakra-ui/react';
import {
  MdHome as Home,
  MdPeople as Pacient,
  MdPerson as Perfil,
  MdAddBox as Hospital,
  MdPowerSettingsNew as Logout
} from 'react-icons/md';
import Link from 'next/link';

const styleLink = {
  color: '#617480',
  variant: 'link',
  size: 'lg',
  fontSize: '24px',
  _hover: {
    background: 'white',
    color: '#6C63FF'
  }
};

export const Navigation: React.FC = () => (
  <Stack spacing="35px">
    <Link href="/dashboard">
      <Box>
        <Tooltip placement="right" label="Inicio">
          <IconButton aria-label="Início" icon={<Home />} {...styleLink} />
        </Tooltip>
      </Box>
    </Link>

    <Link href="/temp">
      <Box>
        <Tooltip placement="right" label="Pacientes">
          <IconButton aria-label="Pacientes" icon={<Pacient />} {...styleLink} />
        </Tooltip>
      </Box>
    </Link>

    <Link href="/profile">
      <Box>
        <Tooltip placement="right" label="Perfil">
          <IconButton aria-label="Perfil" icon={<Perfil />} {...styleLink} />
        </Tooltip>
      </Box>
    </Link>

    <Link href="/temp">
      <Box>
        <Tooltip placement="right" label="Ponto de Vacinação">
          <IconButton aria-label="Ponto de Vacinação" icon={<Hospital />} {...styleLink} />
        </Tooltip>
      </Box>
    </Link>

    <Link href="/">
      <Box>
        <Tooltip placement="right" label="Sair">
          <IconButton aria-label="Sair" icon={<Logout color="red" />} {...styleLink} />
        </Tooltip>
      </Box>
    </Link>
  </Stack>
);

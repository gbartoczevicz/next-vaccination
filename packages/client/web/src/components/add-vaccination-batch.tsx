import React from 'react';

import { Box, Link } from '@chakra-ui/react';

import { MdAddBox as AddBatchIcon, MdRemoveCircle as RemoveBatchICon } from 'react-icons/md';

import { Input } from '@/components';

export const AddVaccinationBatch: React.FC = () => {
  return (
    <>
      <Box mb="20px">
        <Input name="vacine" placeholder="Vacina" type="text" backgroundColor="#F5F8FA" w="218px" mr="17px" />
        <Input name="quantity" placeholder="Quantidade" type="number" backgroundColor="#F5F8FA" w="130px" mr="17px" />
        <Input name="expiration" placeholder="Nº" type="date" backgroundColor="#F5F8FA" w="130px" />
        <Link fontSize="33px" display="inline-block" ml="36px">
          <AddBatchIcon />
        </Link>
      </Box>
    </>
  );
};

import { HStack, useRadioGroup } from '@chakra-ui/react';

import { Button } from '@/components/button-group/button';

type Option = {
  label: string;
  value: any;
};

interface IButtonGroupProps {
  name: string;
  options: Array<Option>;
  onChange(val: any): void;
}

export const ButtonGroup: React.FC<IButtonGroupProps> = ({ name, options, onChange }) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue: options[0].value,
    onChange
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map(({ label, value }) => {
        const radio = getRadioProps({ value });
        return (
          <Button key={value} {...radio}>
            {label}
          </Button>
        );
      })}
    </HStack>
  );
};

import { useState } from 'react';
import { CustomInput, InputProps } from './custom-input';

type InputPasswordProps = {
  resetValue: InputProps['resetValue'];
  handleChange: InputProps['handleChange'];
};

export const InputPassword = ({ resetValue, handleChange }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasword = () => setShowPassword(!showPassword);

  const pattern = /^.{6,}$/;

  return (
    <CustomInput
      label="Password"
      handleChange={handleChange}
      type={showPassword ? 'text' : 'password'}
      endAdorment={{
        button: {
          onClick: togglePasword,
          img: showPassword ? 'EYE_OPEN_LOGO' : 'EYE_CLOSE_LOGO',
        },
      }}
      pattern={pattern}
      resetValue={resetValue}
    />
  );
};

import { CustomInput, InputProps } from './custom-input';

type InputUserProps = {
  resetValue: InputProps['resetValue'];
  handleChange: InputProps['handleChange'];
};

export const InputUsername = ({ resetValue, handleChange }: InputUserProps) => {
  return (
    <CustomInput
      id="input-user"
      label="Username"
      handleChange={handleChange}
      endAdorment={{ img: 'USER_LOGO' }}
      resetValue={resetValue}
    />
  );
};

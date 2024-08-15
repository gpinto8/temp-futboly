import { CustomInput, InputProps } from '../custom/custom-input';

type InputUserProps = {
  resetValue: InputProps['resetValue'];
  handleChange: InputProps['handleChange'];
};

export const InputUsername = ({ resetValue, handleChange }: InputUserProps) => {
  return (
    <CustomInput
      label="Username"
      handleChange={handleChange}
      endAdorment={{ img: 'USER_ICON' }}
      resetValue={resetValue}
    />
  );
};

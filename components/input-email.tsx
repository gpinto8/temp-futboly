import { CustomInput, InputProps } from './custom-input';

type InputEmailProps = {
  resetValue: InputProps['resetValue'];
  handleChange: InputProps['handleChange'];
};

export const InputEmail = ({ resetValue, handleChange }: InputEmailProps) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

  return (
    <CustomInput
      label="Email"
      handleChange={handleChange}
      endAdorment={{ img: 'AT_LOGO' }}
      pattern={pattern}
      resetValue={resetValue}
    />
  );
};

import { Button } from '@mui/material';
import { Loader } from '../loader';

export type CustomButtonProps = {
  label: string;
  style?: 'main' | 'error' | 'black' | 'outlineMain';
  handleClick?: (event?: any) => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  isLoading?: boolean;
  disableElevation?: boolean;
  ref?: any;
};

export const CustomButton = ({
  label,
  handleClick,
  className = '',
  disabled,
  type = 'button',
  isLoading,
  style = 'main',
  disableElevation,
}: CustomButtonProps) => {
  const buttonStyles = {
    main: 'hover:bg-mainDark bg-main text-white',
    error: 'hover:bg-errorDark bg-error text-white',
    black: 'hover:bg-blackLight bg-black text-white',
    outlineMain:
      'bg-white text-main border border-solid border-main hover:bg-main-100',
  };

  const classes = `${
    disabled ? '!bg-gray !text-gray-100' : buttonStyles[style]
  } ${className}`;
  return (
    <Button
      type={type as any}
      variant="contained"
      // TODO: remove the !important from tailwind and find another way to prioritize the styles since here the h-[50px] has the important so its not being overriden by the "classes" one
      className={`rounded-2xl w-full h-[50px] normal-case ${classes}`}
      disabled={disabled}
      onClick={handleClick}
      disableElevation={disableElevation}
    >
      {isLoading ? <Loader /> : label}
    </Button>
  );
};

import { Button } from '@mui/material';
import { Loader } from '../loader';

export type CustomButtonProps = {
  label: string;
  style?: 'main' | 'error' | 'outlineError' | 'black' | 'outlineMain';
  handleClick?: (event?: any) => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  isLoading?: boolean;
  disableElevation?: boolean;
  avoidDisabledStyles?: boolean;
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
  avoidDisabledStyles,
}: CustomButtonProps) => {
  const buttonStyles = {
    main: 'hover:bg-mainDark bg-main text-white',
    error: 'hover:bg-errorDark bg-error text-white',
    outlineError:
      'hover:bg-error-100 bg-white text-error border border-solid border-error',
    black: 'hover:bg-blackLight bg-black text-white',
    outlineMain:
      'hover:bg-main-100 bg-white text-main border border-solid border-main',
  };

  const classes = `${
    disabled && !avoidDisabledStyles
      ? '!bg-gray !text-gray-100'
      : buttonStyles[style]
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

import { Button } from '@mui/material';
import { Loader } from './loader';

type CustomButtonProps = {
  label: string;
  handleClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  isLoading?: boolean;
};

export const CustomButton = ({
  label,
  handleClick,
  className = '',
  disabled,
  type = 'button',
  isLoading,
}: CustomButtonProps) => {
  const classes = `${disabled ? '!bg-gray' : 'bg-main'} ${className}`;
  return (
    <Button
      type={type as any}
      variant="contained"
      onClick={handleClick}
      className={`hover:bg-mainDark text-white rounded-2xl w-full h-[50px] ${classes}`}
      disabled={disabled}
    >
      {isLoading ? <Loader /> : label}
    </Button>
  );
};

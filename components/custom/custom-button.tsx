import { Button } from '@mui/material';
import { Loader } from '../loader';
import { CustomImage } from './custom-image';
import { ImageUrlsProps } from '@/utils/img-urls';

export type CustomButtonProps = {
  label: string;
  style?:
    | 'main'
    | 'error'
    | 'outlineError'
    | 'black'
    | 'outlineMain'
    | 'outlineBlack';
  handleClick?: (event?: any) => void;
  className?: string;
  disabled?: boolean;
  type?: string;
  isLoading?: boolean;
  disableElevation?: boolean;
  avoidDisabledStyles?: boolean;
  widthFit?: boolean;
  suffixIconKey?: ImageUrlsProps;
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
  widthFit,
  suffixIconKey,
}: CustomButtonProps) => {
  const buttonStyles = {
    main: 'hover:bg-mainDark bg-main text-white',
    error: 'hover:bg-errorDark bg-error text-white',
    outlineError:
      'hover:bg-error-100 bg-white text-error border border-solid border-error',
    black: 'hover:bg-blackLight bg-black text-white',
    outlineBlack: 'bg-white text-black',
    outlineMain:
      'hover:bg-main-100 bg-white text-main border border-solid border-main',
  };

  const classes = `${
    disabled && !avoidDisabledStyles
      ? '!bg-gray !text-gray-100'
      : buttonStyles[style]
  } ${className}`;

  const buttonWidth = widthFit ? 'w-fit' : 'w-full';

  return (
    <Button
      type={type as any}
      variant="contained"
      // TODO: remove the !important from tailwind and find another way to prioritize the styles since here the h-[50px] has the important so its not being overriden by the "classes" one
      className={`rounded-2xl h-[50px] normal-case ${buttonWidth} ${classes}`}
      disabled={disabled}
      onClick={handleClick}
      disableElevation={disableElevation}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex justify-between gap-4 items-center">
          {label}
          {suffixIconKey && (
            <CustomImage imageKey={suffixIconKey} className="h-4 w-4" />
          )}
        </div>
      )}
    </Button>
  );
};

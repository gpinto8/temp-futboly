import { ImageUrlsProps } from '../../utils/img-urls';
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import './custom-input.scss';
import { CustomImage } from './custom-image';

export type InputProps = {
  label: string;
  handleChange?: (data: { value: string; isValid?: boolean }) => void;
  type?: string;
  pattern?: RegExp;
  endAdorment?: {
    img?: ImageUrlsProps;
    button?: {
      onClick: () => void;
      img: ImageUrlsProps;
    };
  };
  resetValue?: boolean;
  disabled?: boolean;
  initialValue?: any;
};

export const CustomInput = ({
  label,
  type = 'text',
  pattern,
  handleChange,
  endAdorment,
  resetValue,
  disabled,
  initialValue,
}: InputProps) => {
  const [value, setValue] = initialValue
    ? useState(initialValue)
    : useState('');
  const [error, setError] = useState(false);
  const { img, button } = endAdorment || {};

  const id = `${label.toLowerCase()}}`;
  const imageWidth = 25;
  const imageHeight = 25;

  useEffect(() => {
    if (resetValue) {
      setValue('');
      setError(false);
    }
  }, [resetValue]);

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const targetValue = e.target.value;
    setValue(targetValue);

    if (!targetValue) {
      handleChange?.({ value: '', isValid: false });
      setError(false);
      return;
    }

    let isValid = true;
    if (pattern) {
      isValid = pattern.test(targetValue);
      if (isValid) setError(false);
      else setError(true);
    }

    handleChange?.({ value: targetValue, isValid });
  };

  return (
    <FormControl variant="outlined" className="w-full" disabled={disabled}>
      <InputLabel className={error ? '!text-error' : 'text-gray'} htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        value={value}
        onChange={(e) => handleInputChange(e)}
        label={label}
        error={error}
        classes={{ root: 'root', error: 'errorBorder' }}
        endAdornment={
          <InputAdornment position="end">
            {img ? (
              <CustomImage
                imageKey={img}
                width={imageWidth}
                height={imageHeight}
              />
            ) : (
              button && (
                <IconButton onClick={button.onClick} tabIndex={-1}>
                  <CustomImage
                    imageKey={button.img}
                    width={imageWidth}
                    height={imageHeight}
                  />
                </IconButton>
              )
            )}
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

import { IMG_URLS } from '../utils/img-urls';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import './custom-input.scss';

export type InputProps = {
  id: string;
  label: string;
  handleChange: (data: { value: string; isValid?: boolean }) => void;
  type?: string;
  pattern?: RegExp;
  endAdorment?: {
    img?: keyof typeof IMG_URLS;
    button?: {
      onClick: () => void;
      img: keyof typeof IMG_URLS;
    };
  };
  resetValue?: boolean;
};

export const CustomInput = ({
  id,
  label,
  // value,
  type = 'text',
  pattern,
  handleChange,
  endAdorment,
  resetValue,
}: InputProps) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const { img, button } = endAdorment || {};

  const imageWidth = 25;
  const imageHeight = 25;

  useEffect(() => {
    if (resetValue) {
      setValue('');
      setError(false);
    }
  }, [resetValue]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const targetValue = e.target.value;
    setValue(targetValue);

    if (!targetValue) {
      handleChange({ value: '', isValid: false });
      setError(false);
      return;
    }

    let isValid = true;
    if (pattern) {
      isValid = pattern.test(targetValue);
      if (isValid) setError(false);
      else setError(true);
    }

    handleChange({ value: targetValue, isValid });
  };

  return (
    <FormControl variant="outlined" className="w-full">
      <InputLabel className={error ? '!text-error' : 'text-gray'} htmlFor={id}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={id}
        type={type}
        value={value}
        onChange={e => handleInputChange(e)}
        label={label}
        error={error}
        classes={{ root: 'root', error: 'errorBorder' }}
        endAdornment={
          <InputAdornment position="end">
            {img ? (
              <Image
                src={IMG_URLS[img].src}
                width={imageWidth}
                height={imageHeight}
                alt={IMG_URLS[img].alt}
              />
            ) : (
              button && (
                <IconButton onClick={button.onClick} tabIndex={-1}>
                  <Image
                    src={IMG_URLS[button.img].src}
                    width={imageWidth}
                    height={imageHeight}
                    alt={IMG_URLS[button.img].alt}
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

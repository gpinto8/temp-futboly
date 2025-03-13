import { realTeamLogos } from '@/utils/real-team-logos';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import { CustomImage } from './custom/custom-image';

type IconPickerProps = {
  className?: string;
};

export const TeamLogoPicker = ({ className }: IconPickerProps) => {
  const logos = realTeamLogos();
  const title = 'Logo';

  const [selectedLogo, setSelectedLogo] = useState(logos[0].id);

  const handleChange = (event: SelectChangeEvent) =>
    setSelectedLogo(event.target.value as string);

  return (
    <FormControl className={className}>
      <InputLabel>{title}</InputLabel>
      <Select
        value={selectedLogo}
        label={title}
        onChange={handleChange}
        className="h-[58px]"
      >
        {logos.map((logo) => (
          <MenuItem value={logo.id} className="w-full flex justify-center">
            <CustomImage
              className="w-10 h-10"
              forceSrc={logo.src}
              forcedAlt={logo.alt}
              height={30}
              width={30}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

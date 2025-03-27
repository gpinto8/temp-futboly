import { AllPosibleFormationsProps, getFormations } from '@/utils/formations';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';

type FormationDropdownProps = {
  getSelectedFormation: (formation: AllPosibleFormationsProps) => void;
  resetFormation?: number; // Reset it with "Math.random()" to trigger the useEffect hook
};

export const FormationsDropdown = ({
  getSelectedFormation,
  resetFormation,
}: FormationDropdownProps) => {
  const formations = getFormations();
  const allFormations = formations.map((item) => item.formations).flat();

  const title = 'Formation';

  const [formation, setFormation] = useState<AllPosibleFormationsProps | ''>(
    '',
  );

  useEffect(() => {
    if (formation) getSelectedFormation?.(formation);
  }, [formation, getSelectedFormation]);

  useEffect(() => setFormation(''), [resetFormation]);

  const handleChange = (event: SelectChangeEvent) =>
    setFormation(event.target.value as AllPosibleFormationsProps);

  return (
    <FormControl className="w-[120px] h-fit">
      <InputLabel>{title}</InputLabel>
      <Select value={formation} label={title} onChange={handleChange}>
        {allFormations.map((formation, i) => (
          <MenuItem
            className="h-10 w-full flex justify-center hover:bg-lightGray p-2 cursor-pointer"
            key={i}
            value={formation}
          >
            {formation}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

import { useState, useEffect } from 'react';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { dayjsToFirebase } from '@/utils/dates';
import { Timestamp } from 'firebase/firestore';
import { Dayjs } from 'dayjs';

type CustomInputDateTimeProps = {
  label?: string;
  getValue?: (value: Timestamp) => void;
  className?: string;
};

export const CustomInputDateTime = ({
  label,
  getValue,
  className,
}: CustomInputDateTimeProps) => {
  const breakpoint = useBreakpoint();
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value) {
      const firebaseTimestamp = dayjsToFirebase(value);
      getValue?.(firebaseTimestamp);
    }
  }, [value]);

  const props = {
    label,
    value,
    onChange: (newValue: Dayjs) => setValue(newValue),
    className,
  };

  return breakpoint === 'sm' ? (
    <MobileDateTimePicker {...props} />
  ) : (
    <DesktopDateTimePicker {...props} />
  );
};

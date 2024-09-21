import { Dayjs } from 'dayjs';
import { Timestamp } from 'firebase/firestore';

export const dayjsToFirebase = (date: Dayjs): Timestamp => {
  const firebaseDate = Timestamp.fromDate(new Date(date.toString()));
  return firebaseDate;
};

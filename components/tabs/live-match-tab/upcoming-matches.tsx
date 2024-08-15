import { IMG_URLS } from '@/utils/img-urls';
import Image from 'next/image';

export const UpcomingMatches = () => {
  return (
    <>
      <div className="font-bold text-2xl">Upcoming Matches</div>
      <div className="grid grid-cols-6">
        <div className="flex flex-col gap-4 bg-lightGray py-6 px-4 justify-center items-center">
          <Image src={IMG_URLS['LOGIN_ILLUSTRATION'].src} width={60} height={60} alt={'asdf'} />
          <div className="flex flex-col font-bold justify-center items-center">
            <div>Milan</div>
            <div>vs</div>
            <div>Barcelona</div>
          </div>
        </div>
      </div>
    </>
  );
};

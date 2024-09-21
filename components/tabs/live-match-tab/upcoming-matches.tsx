import { CustomImage } from '@/components/custom/custom-image';

export const UpcomingMatches = () => {
  return (
    <>
      <div className="font-bold text-2xl">Upcoming Matches</div>
      <div className="grid grid-cols-6">
        <div className="flex flex-col gap-4 bg-lightGray py-6 px-4 justify-center items-center">
          <CustomImage imageKey="LOGIN_ILLUSTRATION" width={60} height={60} />
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

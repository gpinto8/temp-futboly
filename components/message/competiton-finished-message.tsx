import { EmptyMessage } from '../empty-message';

type CompetitionFinishedMessageProps = {
  description?: string;
  className?: string;
};

export const CompetitionFinishedMessage = ({
  description,
  className,
}: CompetitionFinishedMessageProps) => {
  return (
    <div className="flex justify-center w-full">
      <EmptyMessage
        title="The competition has finished! 🎊"
        description={description}
        className={`bg-main-100 rounded-xl sm:w-[80%] ${className}`}
      />
    </div>
  );
};

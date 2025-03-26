import { CustomImage } from './custom/custom-image';

export type FootballFieldProps = {
  formation?: string;
  handlePlayerSelected?: (position: number) => void;
  emptyFormationMessage: string;
};

export const FootballField = ({
  formation,
  handlePlayerSelected,
  emptyFormationMessage,
}: FootballFieldProps) => {
  return (
    <div className="relative">
      <div className="absolute w-full h-full flex flex-col justify-between gap-4 p-4 py-8">
        {formation ? (
          <>
            {formation
              .toString()
              .split('')
              .reverse()
              .map((row, position) => {
                return (
                  <div className="bg-success-500 h-full flex gap-4 justify-evenly items-center">
                    {new Array(+row).fill(undefined).map((_, i) => {
                      return (
                        <div
                          // onClick={() => handleClick(i)}
                          className={`bg-white hover:bg-lightGray w-14 h-14 cursor-pointer text-center text-black rounded-3xl ${
                            // selectedPosition === i
                            false ? '!bg-errorDark' : '!bg-gray-400'
                          }`}
                        >
                          INDEX {position + 1} {row} {i + 1}
                          {/* POSITION {position} {selectedPosition} */}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            <div className="my-auto">goalkeeper</div>
          </>
        ) : (
          <div className="font-bold m-auto pb-14">{emptyFormationMessage}</div>
        )}
      </div>
      <CustomImage imageKey="FOOTBALL_FIELD" className="w-full h-auto" />
    </div>
  );
};

import Popover from '@mui/material/Popover';
import { CustomCard } from '@/components/custom/custom-card';
import {
  getMatchBonus,
  getFormations,
  getGoalRanges,
} from '@/utils/rules-info';
import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomModal } from '@/components/custom/custom-modal';
import { CustomImage } from '../custom/custom-image';

export const RulesPopover = ({
  id,
  open,
  anchorEl,
  functions,
}: RulesPopoverProps) => {
  const { handleClose } = functions;

  return useBreakpoint() === 'sm' ? (
    <CustomModal
      hasOpenButton={false}
      externalStatus={open}
      title=""
      handleClose={handleClose}
      closeButton={{ label: ' ', hide: true }}
    >
      <RulesSection hideCloseButton />
    </CustomModal>
  ) : (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <RulesSection handleClose={handleClose} />
    </Popover>
  );
};

type RulesSectionProps = {
  hideCloseButton?: boolean;
  handleClose?: () => void;
};

const RulesSection = ({ hideCloseButton, handleClose }: RulesSectionProps) => {
  const matchBonusRules = getMatchBonus();
  const goalRanges = getGoalRanges();
  const formations = getFormations();

  return (
    <div className="md:max-w-[600px] md:w-[70vw] -mt-6 md:mt-2 flex flex-col gap-4">
      {!hideCloseButton && (
        <div className="flex justify-end w-full px-4">
          <CustomImage
            imageKey="CLOSE_ICON"
            className="h-4 w-4"
            width={16}
            height={16}
            onClick={handleClose}
          />
        </div>
      )}
      <div
        id="rulesTitle"
        className="flex flex-row items-center justify-center mb-4"
      >
        <h2 className="text-main text-pretty text-2xl mr-2">Futboly's</h2>
        <h2 className="font-semibold text-pretty text-2xl">League Rules</h2>
      </div>
      <div id="rulesSection" className="px-2 sm:px-4">
        <div id="matchBonus">
          <h4 className="text-pretty font-semibald text-l mb-1">Match Bonus</h4>
          <CustomCard
            style="gray"
            id="matchBonusContent"
            className="text-sm flex gap-4 md:gap-1 flex-wrap justify-start"
          >
            {matchBonusRules.map((div, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-center gap-1 md:w-[-webkit-fill-available]"
              >
                {div.map((rule, index) => (
                  <RulesPair
                    key={index}
                    title={rule?.title}
                    desc={rule?.desc}
                  />
                ))}
              </div>
            ))}
          </CustomCard>
        </div>
        <div className="flex flex-col sm:flex-row justify-around items-stretch my-4 gap-4 w-full">
          <div id="goalRanges">
            <h4 className="text-pretty font-semibald text-l mb-1">
              Goal Ranges
            </h4>
            <CustomCard
              style="gray"
              id="goalRangesContent"
              className="text-sm h-full"
            >
              {goalRanges.map((range, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center gap-2"
                >
                  <RulesPair title={range?.title} desc={range?.desc} />
                </div>
              ))}
            </CustomCard>
          </div>
          <div id="formations">
            <h4 className="text-pretty font-semibald text-l mb-1">
              Formations
            </h4>
            <CustomCard
              style="gray"
              id="formationsContent"
              className="text-sm flex flex-col md:flex-row gap-6 h-full"
            >
              {formations.map((formation, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-center items-center gap-2"
                >
                  <FormationsPair
                    title={formation?.title}
                    desc={formation?.desc}
                  />
                </div>
              ))}
            </CustomCard>
          </div>
        </div>
      </div>
      <div id="rulesBasedOn" className="mt-0 md:mt-6">
        <h3 className="text-main text-pretty pl-4 text-xl">
          Based on these real leagues:
        </h3>
        <div className="flex flex-row md:justify-between items-center p-2 gap-4 flex-wrap md:flex-nowrap">
          {[1, 2, 3, 4, 5].map((i, index) => (
            <CustomCard style="gray" key={index}>
              <CustomImage
                forceSrc="https://cdn.sportmonks.com/images/soccer/leagues/271.png"
                className="mx-2"
                width={32}
                height={32}
              />
            </CustomCard>
          ))}
        </div>
      </div>
    </div>
  );
};

type RulesPopoverProps = {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  functions: {
    handleClose: () => void;
  };
};

type RulesPairProps = {
  title: string | undefined;
  desc: string | undefined;
};

type FormationsPairProps = {
  title: string | undefined;
  desc: string[] | undefined;
};

const RulesPair = ({ title, desc }: RulesPairProps) => {
  return (
    <div className="w-full flex flex-row justify-start items-center gap-2">
      <p className="text-nowrap font-semibold">{title}:</p>
      <p className="text-nowrap font-semibold text-gray">{desc}</p>
    </div>
  );
};

const FormationsPair = ({ title, desc }: FormationsPairProps) => {
  return (
    <div className="text-center h-full md:flex md:flex-col md:gap-2">
      <p className="text-nowrap font-semibold">{title}:</p>
      <div className="flex flex-row flex-wrap justify-center items-center">
        {desc?.map((formation, index) => (
          <div
            key={index}
            className="mx-1 flex flex-row justify-center items-center gap-2"
          >
            <p className="text-nowrap font-semibold text-gray">{formation}</p>
            {index < desc.length - 1 && (
              <p className="text-nowrap font-black text-gray-900"> - </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

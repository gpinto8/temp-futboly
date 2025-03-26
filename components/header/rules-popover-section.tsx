import { CustomCard } from '@/components/custom/custom-card';
import { getMatchBonus, getGoalRanges } from '@/utils/rules-info';
import { CustomImage } from '../custom/custom-image';
import { getFormations } from '@/utils/formations';

type RulesPairProps = {
  title: string | undefined;
  desc: string | undefined;
};

const RulesPair = ({ title, desc }: RulesPairProps) => (
  <div className="w-full flex flex-row justify-start items-center gap-2">
    <p className="text-nowrap font-semibold">{title}:</p>
    <p className="text-nowrap font-semibold text-gray">{desc}</p>
  </div>
);

type FormationsPairProps = {
  title: string | undefined;
  desc: string[] | undefined;
};

const FormationsPair = ({ title, desc }: FormationsPairProps) => (
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

export const RulesPopoverSection = () => {
  const matchBonusRules = getMatchBonus();
  const goalRanges = getGoalRanges();
  const formations = getFormations();

  return (
    <div className="md:max-w-[600px] md:w-[70vw] -mt-6 flex flex-col gap-6">
      <div id="rulesSection">
        {/* MATCH BONUS */}
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

        {/* GOAL RANGES */}
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
                    desc={formation?.formations}
                  />
                </div>
              ))}
            </CustomCard>
          </div>
        </div>
      </div>

      {/* REAL LEAGUES */}
      <div id="rulesBasedOn" className="mt-0 md:mt-6 flex flex-col gap-4">
        <h3 className="text-main text-pretty text-xl">
          Based on these real leagues:
        </h3>
        <div className="flex flex-row md:justify-between items-center gap-4 flex-wrap md:flex-nowrap w-full">
          {[1, 2, 3, 4, 5].map((i, index) => (
            <CustomCard style="gray" key={index}>
              <CustomImage
                forceSrc="https://cdn.sportmonks.com/images/soccer/leagues/271.png"
                width={64}
                height={64}
              />
            </CustomCard>
          ))}
        </div>
      </div>
    </div>
  );
};

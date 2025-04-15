import { CustomSeparator } from '../custom/custom-separator';

type TabSectionData = {
  title: string;
  Component: () => JSX.Element;
};

type TabSectionSpacerProps = {
  firstSection: TabSectionData;
  secondSection: TabSectionData;
};

const TabSectionTitle = ({ title }: { title: string }) => (
  <div className="w-full flex flex-col gap-6 mb-4">
    <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
  </div>
);

export const TabSectionSpacer = ({
  firstSection,
  secondSection,
}: TabSectionSpacerProps) => (
  <div className="w-full h-full flex flex-col">
    {/* FIRST SECTION */}
    <TabSectionTitle title={firstSection.title} />
    {firstSection.Component()}

    {/* SEPARATOR */}
    <CustomSeparator withText={false} className="!my-20" />

    {/* SECOND SECTION */}
    <TabSectionTitle title={secondSection.title} />
    {secondSection.Component()}
  </div>
);

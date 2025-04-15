import { CustomSeparator } from '../custom/custom-separator';

type TabSectionData = {
  title: string;
  TitleEndComponent?: () => JSX.Element;
  Component: () => JSX.Element;
};

type TabSectionSpacerProps = {
  firstSection: TabSectionData;
  secondSection: TabSectionData;
};

const TabSectionTitle = ({
  title,
  TitleEndComponent,
}: Partial<TabSectionData>) => (
  <div className="w-full flex flex-row justify-between gap-6 mb-4">
    <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
    {TitleEndComponent?.()}
  </div>
);

export const TabSectionSpacer = ({
  firstSection,
  secondSection,
}: TabSectionSpacerProps) => (
  <div className="w-full h-full flex flex-col">
    {/* FIRST SECTION */}
    <TabSectionTitle
      title={firstSection.title}
      TitleEndComponent={firstSection.TitleEndComponent}
    />
    {firstSection.Component()}

    {/* SEPARATOR */}
    <CustomSeparator withText={false} className="!py-20 !my-0" />

    {/* SECOND SECTION */}
    <TabSectionTitle
      title={secondSection.title}
      TitleEndComponent={secondSection.TitleEndComponent}
    />
    {secondSection.Component()}
  </div>
);

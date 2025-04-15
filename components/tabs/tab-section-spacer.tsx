import { CustomSeparator } from '../custom/custom-separator';

type TabSectionData = {
  title: string;
  TitleEndComponent?: () => JSX.Element;
  Component: () => JSX.Element;
};

type TabSectionSpacerProps = {
  UniqueSection?: () => JSX.Element;
  firstSection?: TabSectionData;
  secondSection?: TabSectionData;
  emptyMessage: { condition: boolean; Component: () => JSX.Element };
};

const TabSectionTitle = ({
  title,
  TitleEndComponent,
}: Partial<TabSectionData>) => (
  <div className="w-full flex flex-row justify-between gap-6 mb-6">
    <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
    {TitleEndComponent?.()}
  </div>
);

export const TabSectionSpacer = ({
  UniqueSection,
  firstSection,
  secondSection,
  emptyMessage,
}: TabSectionSpacerProps) => {
  return emptyMessage?.condition ? (
    emptyMessage.Component()
  ) : UniqueSection ? (
    UniqueSection()
  ) : (
    <div className="w-full h-full flex flex-col">
      {/* FIRST SECTION */}
      <TabSectionTitle
        title={firstSection?.title}
        TitleEndComponent={firstSection?.TitleEndComponent}
      />
      {firstSection?.Component()}

      {/* SEPARATOR */}
      <CustomSeparator withText={false} className="!py-20 !my-0" />

      {/* SECOND SECTION */}
      <TabSectionTitle
        title={secondSection?.title}
        TitleEndComponent={secondSection?.TitleEndComponent}
      />
      {secondSection?.Component()}
    </div>
  );
};

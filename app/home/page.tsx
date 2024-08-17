import { OverviewBanner } from '@/components/overview-banner';
import HomePageLayout from './layout';
import { AppTabs } from '@/components/app-tabs';
import { Header } from '@/components/header';

export default () => {
  return (
    <div className="px-4 md:px-10 max-w-[1500px] w-full">
      <HomePageLayout>
        <Header />
        ASDFASDF
        <OverviewBanner />
        <AppTabs />
      </HomePageLayout>
    </div>
  );
};

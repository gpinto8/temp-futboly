import { OverviewBanner } from '@/components/overview-banner';
import HomePageLayout from './layout';
import { AppTabs } from '@/components/app-tabs';
import { Header } from '@/components/header';

export default () => {
  return (
    <div className="mx-10">
      <HomePageLayout>
        <Header />
        ASDFASDF
        <OverviewBanner />
        <AppTabs />
      </HomePageLayout>
    </div>
  );
};

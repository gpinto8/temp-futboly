import { FutbolyLogo } from './futboly-logo';
import { Loader } from './loader';

export const PageLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-8 h-dvh w-dvw">
      <FutbolyLogo className="w-fit" hideSlogan />
      <Loader color="main" size={50} />
    </div>
  );
};

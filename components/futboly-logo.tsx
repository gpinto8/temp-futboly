import { CustomImage } from './custom/custom-image';

type FutbolyLogoProps = {
  hideSlogan?: boolean;
  className?: string;
};

export const FutbolyLogo = ({ hideSlogan, className }: FutbolyLogoProps) => {
  const slogan = 'YOUR TEAM. YOUR WAY.';
  const newClassName = `flex flex-col justify-center content-center w-[200px] ${className}`;

  return (
    <div className={newClassName}>
      <CustomImage imageKey="FUTBOLY_LOGO_ICON" height={80} width={160} />
      {!hideSlogan && <span className="text-[18px] text-black">{slogan}</span>}
    </div>
  );
};

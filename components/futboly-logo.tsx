import { CustomImage } from './custom/custom-image';

type FutbolyLogoProps = {
  hideSlogan?: boolean;
  className?: string;
  alignCenter?: boolean;
};

export const FutbolyLogo = ({
  hideSlogan,
  className = '',
  alignCenter,
}: FutbolyLogoProps) => {
  const slogan = 'YOUR TEAM. YOUR WAY.';
  const newClassName = `flex flex-col justify-center ${
    alignCenter ? 'items-center' : ''
  } ${className}`;

  return (
    <div className={newClassName}>
      <CustomImage imageKey="FUTBOLY_LOGO_ICON" height={80} width={160} />
      {!hideSlogan && <span className="text-[18px] text-black">{slogan}</span>}
    </div>
  );
};

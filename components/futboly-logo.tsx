import { IMG_URLS } from '../utils/img-urls';

export const FutbolyLogo = ({ ...otherProps }) => {
  const slogan = 'YOUR TEAM. YOUR WAY.';
  return (
    <div className="flex flex-col justify-center content-center w-[200px]" {...otherProps}>
      <img src={IMG_URLS.FUTBOLY_LOGO.src} alt={IMG_URLS.FUTBOLY_LOGO.alt} />
      <span className="text-[18px] text-black">{slogan}</span>
    </div>
  );
};

import { ImageUrlsProps, IMG_URLS } from '@/utils/img-urls';
import Image from 'next/image';

type CustomImageProps = {
  imageKey?: ImageUrlsProps;
  forceSrc?: string;
  forcedAlt?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (event?: any) => void;
};

export const CustomImage = ({
  imageKey,
  width = 32,
  height = 32,
  className,
  onClick,
  forceSrc,
  forcedAlt,
}: CustomImageProps) => {
  const { src, alt } = IMG_URLS[imageKey || ''] || {};

  return (
    <Image
      src={forceSrc || src}
      alt={forcedAlt || forceSrc || alt}
      unoptimized={!!forceSrc} // This accepts the external url
      width={width}
      height={height}
      className={className}
      onClick={onClick}
    />
  );
};

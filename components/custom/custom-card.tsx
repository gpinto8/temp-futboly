export type BannerCardProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  style?: 'light' | 'gray';
  size?: 'slim' | 'small' | 'medium' | 'large';
  hoverable?: boolean;
};

export const CustomCard = ({
  className,
  children,
  id,
  style,
  size,
  hoverable,
}: BannerCardProps) => {
  const cardStyles = {
    light: 'shadow-xl',
    gray: 'border bg-lightGray',
  };

  className = className || '';
  className = hoverable ? 'hover:scale-105' + ' ' + className : className;
  className = style ? cardStyles[style] + ' ' + className : className;

  const padding = {
    "slim": "py-1 px-2 md:py-2 md:px-4 lg:py-4 lg:px-6",
    "small": "py-2 px-4 md:py-4 md:px-6 lg:py-6 lg:px-8",
    "medium": "p-4 md:p-6 lg:p-8",
    "large": "p-6 md:p-8 lg:p-10",
  }

  return (
    <div
      id={id}
      className={
        'rounded-lg relative block overflow-hidden ' +
        (size ? padding[size] : padding.medium) +
        className
      }
    >
      {children}
    </div>
  );
};

export type BannerCardProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  style?: 'light' | 'gray';
  hoverable?: boolean;
};

export const CustomCard = ({
  className,
  children,
  id,
  style,
  hoverable,
}: BannerCardProps) => {
  const cardStyles = {
    light: 'shadow-xl',
    gray: 'border bg-lightGray',
  };

  className = className || '';
  className = hoverable ? className + ' ' + 'hover:scale-105' : className;
  className = style ? cardStyles[style] + ' ' + className : className;

  return (
    <div
      id={id}
      className={
        'rounded-lg relative block overflow-hidden p-4 md:p-6 lg:p-8 ' +
        className
      }
    >
      {children}
    </div>
  );
};

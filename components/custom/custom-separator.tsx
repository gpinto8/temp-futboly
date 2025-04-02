type CustomSeparatorProps = {
  withText: boolean;
  text?: string;
  className?: string;
};

const Divider = () => <div className="border-t border-gray-400 flex-grow" />;

export const CustomSeparator = ({
  withText,
  text = 'DEFAULT',
  className,
}: CustomSeparatorProps) => {
  return (
    <div
      className={`flex items-center justify-center w-full my-4 ${className}`}
    >
      {withText ? (
        <>
          <Divider />
          <span className="px-4 text-gray-600">{text}</span>
          <Divider />
        </>
      ) : (
        <Divider />
      )}
    </div>
  );
};

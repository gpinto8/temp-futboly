type CustomSeparatorProps = {
  withText: boolean;
  text?: string;
};

const Divider = () => <div className="border-t border-gray-400 flex-grow" />;

export const CustomSeparator = ({
  withText,
  text = 'DEFAULT',
}: CustomSeparatorProps) => {
  return (
    <div className="flex items-center justify-center w-full my-4">
      {withText ? (
        <>
          <Divider />
          <span className="px-4 text-gray-600 dark:font-bold">{text}</span>
          <Divider />
        </>
      ) : (
        <Divider />
      )}
    </div>
  );
};

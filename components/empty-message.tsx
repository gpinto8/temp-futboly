import {
  CustomButton,
  CustomButtonProps,
} from '@/components/custom/custom-button';

type EmptyMessageProps = {
  title?: string | JSX.Element;
  description?: string | JSX.Element;
  ctaButton?: {
    label: CustomButtonProps['label'];
    handleClick: CustomButtonProps['handleClick'];
    disabled?: CustomButtonProps['disabled'];
  };
  noSpaces?: boolean;
  className?: string;
  classNameDescription?: string;
};

export const EmptyMessage = ({
  title,
  description,
  ctaButton,
  noSpaces,
  className = '',
  classNameDescription = '',
}: EmptyMessageProps) => {
  const empty = noSpaces ? 'p-0 m-0' : 'px-4 py-12';

  return (
    <section className={`bg-white w-full ${className}`}>
      <div
        className={`container flex flex-col gap-6 items-center mx-auto text-center md:max-w-[70%] ${empty}`}
      >
        {title && (
          <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl">
            {title}
          </h2>
        )}

        {description && (
          <div
            className={`max-w-4xl text-center text-gray-500 ${classNameDescription}`}
          >
            {description}
          </div>
        )}

        {ctaButton && (
          <div className="inline-flex w-full sm:w-auto">
            <CustomButton
              label={ctaButton.label}
              handleClick={ctaButton.handleClick}
              disabled={ctaButton?.disabled}
            />
          </div>
        )}
      </div>
    </section>
  );
};

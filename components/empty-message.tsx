import {
  CustomButton,
  CustomButtonProps,
} from '@/components/custom/custom-button';

type EmptyMessageProps = {
  title: string | JSX.Element;
  description?: string | JSX.Element;
  ctaButton?: {
    label: CustomButtonProps['label'];
    handleClick: CustomButtonProps['handleClick'];
  };
};

export const EmptyMessage = ({
  title,
  description,
  ctaButton,
}: EmptyMessageProps) => (
  <section className="bg-white w-full">
    <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center md:max-w-[70%]">
      <h2 className="max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="max-w-4xl mt-6 text-center text-gray-500">
          {description}
        </p>
      )}

      {ctaButton && (
        <div className="inline-flex w-full mt-6 sm:w-auto">
          <CustomButton
            label={ctaButton.label}
            handleClick={ctaButton.handleClick}
          />
        </div>
      )}
    </div>
  </section>
);

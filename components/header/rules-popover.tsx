import { useBreakpoint } from '@/utils/use-breakpoint';
import { CustomModal } from '@/components/custom/custom-modal';
import { CustomPopover } from '../custom/custom-popover';
import { RulesPopoverSection } from './rules-popover-section';

type RulesPopoverProps = {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  functions: {
    handleClose: () => void;
  };
};

export const RulesPopover = ({
  id,
  open,
  anchorEl,
  functions,
}: RulesPopoverProps) => {
  const { handleClose } = functions;

  return useBreakpoint() === 'sm' ? (
    <CustomModal
      hasOpenButton={false}
      externalStatus={open}
      title=""
      handleClose={handleClose}
      closeButton={{ label: ' ', hide: true }}
    >
      <RulesPopoverSection />
    </CustomModal>
  ) : (
    <CustomPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      titleComponent={
        <div
          id="rulesTitle"
          className="w-full flex flex-row items-center justify-center mb-10"
        >
          <h2 className="text-main text-pretty text-2xl mr-2">Futboly's</h2>
          <h2 className="font-semibold text-pretty text-2xl">League Rules</h2>
        </div>
      }
    >
      <RulesPopoverSection />
    </CustomPopover>
  );
};

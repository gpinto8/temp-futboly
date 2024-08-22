'use client';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import { CustomButton, CustomButtonProps } from './custom-button';
import Image from 'next/image';
import { IMG_URLS } from '@/utils/img-urls';

const cssStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

type CustomModalProps = {
  title: string;
  children: React.ReactNode;
  unboldedTitle?: string;
  className?: string;
  handleClose?: () => void;
  openButton?: {
    label: string;
    className?: string;
    handleClick?: () => void;
    style?: CustomButtonProps['style'];
  };
  closeButton?: {
    label: string;
    handleClick?: () => void;
  };
};

export const CustomModal = ({
  title,
  children,
  unboldedTitle,
  className = '',
  handleClose,
  openButton,
  closeButton,
}: CustomModalProps) => {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => {
    handleClose?.();
    setOpen(false);
  };

  const handleModalClick = () => {
    openButton?.handleClick?.();
    openModal();
  };

  const handleButtonClose = () => {
    closeButton?.handleClick?.();
    closeModal();
  };

  return (
    <>
      <CustomButton
        label={openButton?.label || ''}
        className={`w-fit h-10 ${openButton?.className || ''}`}
        style={openButton?.style || 'black'}
        handleClick={handleModalClick}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box
            sx={cssStyles}
            className={`p-4 md:p-8 w-screen h-screen md:w-[70dvw] 2xl:w-[60dvw] md:h-[80dvh] ${className}`}
          >
            <div className="flex flex-col gap-4 h-full">
              <div className="flex justify-end">
                <Image
                  src={IMG_URLS.CLOSE_ICON.src}
                  alt={IMG_URLS.CLOSE_ICON.alt}
                  width={20}
                  height={20}
                  onClick={closeModal}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-6 h-[-webkit-fill-available]">
                <div className="flex justify-center text-3xl">
                  <div className="font-bold">{title}</div>
                  {unboldedTitle}
                </div>
                <div className="h-full">{children}</div>
              </div>
              <CustomButton label={closeButton?.label || ''} handleClick={handleButtonClose} />
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

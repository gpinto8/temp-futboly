'use client';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { CustomButton, CustomButtonProps } from './custom-button';
import { CustomInput } from './custom-input';
import { ColumnsProps, CustomTable, RowsProps } from './custom-table';

const cssStyles = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type CustomModalProps = {
  title: string;
  notBoldTitle?: string;
  children: React.ReactNode;
  style?: CustomButtonProps['style'];
  className?: string;
  buttonLabel: string;
  buttonClass?: string;
  handleClick?: () => void;
};

export const CustomModal = ({
  title,
  notBoldTitle,
  style = 'black',
  children,
  buttonClass,
  buttonLabel,
  handleClick,
  className,
}: CustomModalProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // useEffect(() => {
  //   console.log("custommodal")
  //   // (async () => {
  //   //   const data = await fetch('/api/hello', { next: { revalidate: 3600 } }).then(response =>
  //   //     response.json()
  //   //   );
  //   //   console.log({ data: data.id });
  //   // })();
  // }, []);

  const handleModalClick = () => {
    handleClick?.();
    handleOpen();
  };

  return (
    <div>
      <CustomButton
        label={buttonLabel}
        className={`w-fit h-10 ${buttonClass}`}
        style={style}
        handleClick={handleModalClick}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={cssStyles} className={`w-[50vw] h-[60vh] ${className}`}>
            <div className="flex flex-col gap-6">
              <div className="flex justify-center text-3xl">
                <div className="font-bold">{title}</div>
                {notBoldTitle}
              </div>
              {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

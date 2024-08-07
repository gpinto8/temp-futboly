'use client';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
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
  children: React.ReactNode;
  style?: CustomButtonProps['style'];
  buttonLabel: string;
  buttonClass?: string;
};

export const CustomModal = ({
  title,
  style = 'black',
  children,
  buttonClass,
  buttonLabel,
}: CustomModalProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <CustomButton
        label={buttonLabel}
        className={`w-fit h-10 ${buttonClass}`}
        style={style}
        handleClick={handleOpen}
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
        keepMounted
      >
        <Fade in={open}>
          <Box sx={cssStyles} className="w-[50vw] h-[60vh]">
            <div className="flex flex-col gap-6">
              <div className="flex justify-center font-bold text-3xl">{title}</div>
              {children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

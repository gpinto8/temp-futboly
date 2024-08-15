import { useEffect, useState } from 'react';
import { ColumnsProps, CustomTable, RowsProps } from '../../custom/custom-table';
import { IMG_URLS } from '@/utils/img-urls';
import Image from 'next/image';
import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { CustomButton } from '../../custom/custom-button';
import { LiveMatch } from './live-match';
import { UpcomingMatches } from './upcoming-matches';

export const LiveMatchTab = () => {
  useState();
  return (
    <div className="flex flex-col gap-16">
      <LiveMatch />
      <div className="border-b border-b-gray" />
      <UpcomingMatches />
    </div>
  );
};

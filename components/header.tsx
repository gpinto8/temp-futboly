'use client';

import { useState } from 'react';
import { RulesPopover } from './header/rules-popover';
import { UserPopover } from './header/user-popover';
import { FutbolyLogo } from './futboly-logo';
import { useSetUsers } from '@/data/users/use-set-users';
import { CustomImage } from './custom/custom-image';
import { useGetUsers } from '@/data/users/use-get-users';

type HeaderProps = {
  hideUsername?: boolean;
  hideRules?: boolean;
  hideUserPopover?: boolean;
};

export const Header = ({
  hideUsername,
  hideRules,
  hideUserPopover,
}: HeaderProps) => {
  const { logoutUser } = useSetUsers();
  const { getUser } = useGetUsers();
  const { username } = getUser();

  const [anchorElRules, setAnchorElRules] = useState<HTMLButtonElement | null>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = useState<HTMLButtonElement | null>(
    null,
  );
  const handleClickRules = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElRules(event.currentTarget);
  };
  const handleCloseRules = () => {
    setAnchorElRules(null);
  };

  const handleClickUser = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUser = () => {
    setAnchorElUser(null);
  };

  const openRules = Boolean(anchorElRules);
  const openUser = Boolean(anchorElUser);
  const idRules = openRules ? 'rules-popover' : undefined;
  const idUser = openUser ? 'user-popover' : undefined;

  return (
    <div className="flex flex-col pt-6">
      <div className="flex flex-wrap gap-4 w-full justify-between">
        <FutbolyLogo />
        <div className="flex items-center gap-2">
          {/* USERNAME */}
          {username && !hideUsername && (
            <div className="text-lg">
              Hello, <span className="font-bold">{username}</span>
            </div>
          )}
          {!hideRules && (
            <>
              <button
                onClick={handleClickRules}
                type="button"
                className="relative rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-100 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <CustomImage
                  imageKey="RULES_ICON"
                  className="h-9 w-9"
                  width={36}
                  height={36}
                />
              </button>
              <RulesPopover
                id={idRules}
                open={openRules}
                anchorEl={anchorElRules}
                functions={{ handleClose: handleCloseRules }}
              />
            </>
          )}

          {/* Profile dropdown */}
          {!hideUserPopover && (
            <>
              <button
                onClick={handleClickUser}
                type="button"
                className="relative rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-100 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <CustomImage
                  imageKey="USER_ICON"
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              </button>
              <UserPopover
                id={idUser}
                open={openUser}
                anchorEl={anchorElUser}
                functions={{ handleClose: handleCloseUser }}
              />
            </>
          )}
          <button
            onClick={logoutUser}
            type="button"
            className="relative rounded-full p-1 text-gray-400 hover:text-white hover:bg-gray-100 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Logout</span>
            <CustomImage
              imageKey="LOGOUT"
              className="h-8 w-8"
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

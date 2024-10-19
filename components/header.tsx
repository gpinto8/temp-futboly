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
  // const logoWidth = 160;

  return (
    <nav>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 pt-4">
        <div className="relative flex h-16 items-center justify-between">
          <FutbolyLogo />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <a href="/first-time">Prova</a> */}
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
    </nav>
  );
};

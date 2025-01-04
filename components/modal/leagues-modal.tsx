'use client';

import { useEffect, useState } from 'react';
import { CustomModal } from '@/components/custom/custom-modal';
import { CustomInput, InputProps } from '@/components/custom/custom-input';
import { InputPassword } from '@/components/input/input-password';
import { useSetLeague } from '@/data/leagues/use-set-league';
import { useAppSelector } from '@/store/hooks';
import { LeaguesCollectionProps } from '@/firebase/db-types';
import { LeagueList } from '@/components/league-list';

// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];

type CreateLeagueModalProps = { buttonFull?: boolean };

export const CreateLeagueModal = ({ buttonFull }: CreateLeagueModalProps) => {
  const [leagueName, setLeagueName] = useState<HandleChangeParamProps>();
  const [leaguePassword, setLeaguePassword] =
    useState<HandleChangeParamProps>();
  const [repeatPassword, setRepeatPassword] =
    useState<HandleChangeParamProps>();
  const [resetForm, setResetForm] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [disabledForm, setDisabledForm] = useState(true);
  const { addLeague } = useSetLeague();

  const openButtonStyle = `rounded-full ${
    buttonFull ? 'w-full' : 'max-w-20 mb-2 px-20'
  }`;

  useEffect(() => {
    if (isPrivate) {
      setDisabledForm(
        !(
          leagueName?.isValid &&
          leagueName?.value &&
          leaguePassword?.isValid &&
          leaguePassword?.value &&
          repeatPassword?.isValid &&
          repeatPassword?.value &&
          leaguePassword?.value === repeatPassword?.value
        ),
      );
    } else {
      setDisabledForm(!(leagueName?.isValid && leagueName?.value));
    }
  }, [isPrivate, leagueName, leaguePassword, repeatPassword]);

  const resetInputs = () => {
    setLeagueName({ value: '', isValid: false });
    setLeaguePassword({ value: '', isValid: false });
    setRepeatPassword({ value: '', isValid: false });
  };

  const handleSubmit = async () => {
    let response: any;

    const { value, isValid } = leagueName || {};
    if (!value || !isValid) return;

    // PRIVATE LEAGUE
    if (isPrivate && leaguePassword && repeatPassword) {
      if (leaguePassword.value !== repeatPassword.value) return; // If password dont correspond
      if (!(leaguePassword.isValid && repeatPassword.isValid)) return; // If both password are not valid

      response = await addLeague({
        name: value,
        isPrivate,
        leaguePassword: leaguePassword.value,
      });
    }
    // NON-PRIVATE LEAGUE
    else response = await addLeague({ name: value, isPrivate });

    if (response) {
      setResetForm(true);
      setResetForm(false);
    }
  };

  const toggleIsPrivate = (event: any) => setIsPrivate(event.target.checked);

  const handleClose = () => {
    resetInputs();
    setIsPrivate(false);
  };

  return (
    <CustomModal
      title={<p className="text-3xl font-bold">Create Your League</p>}
      closeButton={{
        label: 'Create',
        disabled: disabledForm,
        handleClick: handleSubmit,
      }}
      openButton={{
        label: 'Create',
        style: 'main',
        className: openButtonStyle,
      }}
      handleClose={handleClose}
      isDialog={{ value: true, style: 'large' }}
    >
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <CustomInput
            label="League Name"
            handleChange={setLeagueName}
            endAdorment={{ img: 'LEAGUE_TROPHY' }}
          />
        </div>
        {isPrivate && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 ">
            <InputPassword
              label="League Password"
              handleChange={setLeaguePassword}
              resetValue={resetForm}
            />
            <InputPassword
              label="Repeat Password"
              handleChange={setRepeatPassword}
              resetValue={resetForm}
            />
          </div>
        )}
        <div className="w-fit">
          <label
            htmlFor="isPrivate"
            className="flex gap-2"
            onChange={toggleIsPrivate}
          >
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
            />
            <span className="text-sm text-gray-700 text-nowrap">Private</span>
          </label>
        </div>
      </div>
    </CustomModal>
  );
};

export const JoinPublicLeagueModal = ({
  league,
}: {
  league: LeaguesCollectionProps;
}) => {
  const [leaguePasswordInput, setLeaguePasswordInput] =
    useState<HandleChangeParamProps | null>(null);
  const [resetForm, setResetForm] = useState(false);
  const [disabledForm, setDisabledForm] = useState(league?.isPrivate);
  const { addPlayerToLeague } = useSetLeague();
  const user = useAppSelector((state) => state.user);

  const handleClick = async () => {
    if (league?.isPrivate) {
      //Verificare che la pw sia corretta
      if (leaguePasswordInput?.value === league?.leaguePassword) {
        await addPlayerToLeague(league.id, user.id);
      }
    } else {
      await addPlayerToLeague(league.id, user.id);
    }
    setResetForm(true);
  };

  useEffect(() => {
    if (leaguePasswordInput) setDisabledForm(!leaguePasswordInput?.value);
  }, [leaguePasswordInput]);

  const handleClose = () => {
    setResetForm(true);
    setLeaguePasswordInput(null);
    setResetForm(false);
  };

  return (
    <CustomModal
      title={
        <p className="text-2xl sm:text-3xl font-bold sm:text-nowrap">
          Join League
        </p>
      }
      closeButton={{
        label: 'Join',
        style: 'main',
        className: 'mt-4 rounded-full',
        handleClick: handleClick,
        disabled: disabledForm,
      }}
      openButton={{
        label: 'Join',
        isText: false,
        className: 'rounded-full text-xs py-1 my-1 px-4 h-full',
        style: 'main',
      }}
      handleClose={handleClose}
      isDialog={{ value: true, style: 'slim' }}
    >
      <div className="flex flex-col gap-4 my-2 min-w-[60vw] md:min-w-[30vw] xl:min-w-[25vw]">
        <CustomInput label="League ID" initialValue={league.name} disabled />
      </div>
      {league.isPrivate && (
        <InputPassword
          label="League Password"
          handleChange={setLeaguePasswordInput}
          resetValue={resetForm}
          avoidPattern // Because the password can be whatever (it doesn't respect the password requirements of our password inputs)
        />
      )}
    </CustomModal>
  );
};

export const LeaguesModal = () => {
  return (
    <CustomModal
      title={
        <p className="text-2xl sm:text-3xl font-bold sm:text-nowrap">Leagues</p>
      }
      openButton={{
        label: 'Browse Leagues',
        isText: false,
        className: 'rounded-full text-xs py-1 my-1 px-4',
        style: 'black',
      }}
      closeButton={{ hide: true }}
      isDialog={{ value: true, style: 'large' }}
      className="min-w-[95%]"
    >
      <LeagueList hideShadow />
    </CustomModal>
  );
};

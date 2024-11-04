'use client';

import { useState } from 'react';
import { CustomModal } from "@/components/custom/custom-modal";
import { CustomInput, InputProps } from "@/components/custom/custom-input";
import { InputPassword } from '@/components/input/input-password';
import { useSetLeague } from "@/data/leagues/use-set-league";
import { useAppSelector } from '@/store/hooks';
import { LeaguesCollectionProps } from '@/firebase/db-types';
import { LeagueList } from '@/components/league-list';

// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];

export const CreateLeagueModal = ({ buttonFull }) => {
    const [leagueName, setLeagueName] = useState<HandleChangeParamProps>();
    const [leaguePassword, setLeaguePassword] = useState<HandleChangeParamProps>();
    const [repeatPassword, setRepeatPassword] = useState<HandleChangeParamProps>();
    const [resetForm, setResetForm] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const { addLeague } = useSetLeague();

    const openButtonStyle = (!buttonFull ? "max-w-20"  : "") + " rounded-full mb-2";

    const handleSubmit = async () => {
        if (!leagueName || !leaguePassword || !repeatPassword) return;  //Se uno dei valori è vuoto
        if (!(leagueName.isValid && leaguePassword.isValid && repeatPassword.isValid)) return; //Uno dei valore non è valido
        if (leaguePassword.value !== repeatPassword.value) return; //Le password non corrispondono
        // const isPrivate = (document.getElementById("isPrivate") as HTMLInputElement).checked;
        const response = await addLeague({
            name: leagueName.value,
            leaguePassword: leaguePassword.value,
            isPrivate
        });
        if (response) {
            setResetForm(true);
            setResetForm(false);
        }
    }

    const toggleIsPrivate = (event: any) => {
        setIsPrivate(event.target.checked);
    }

    return (
      <CustomModal
        title={<p className="text-3xl font-bold">Create Your League</p>}
        closeButton={{ label: 'Create' }}
        openButton={{
          label: 'Create',
          style: 'main',
          className: openButtonStyle,
        }}
        handleClose={handleSubmit}
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
          { isPrivate && (
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
          <div className="w-full">
            <label htmlFor="isPrivate" className="flex gap-4" onChange={toggleIsPrivate}>
              <input type="checkbox" id="isPrivate" name="isPrivate" className="size-5 rounded-md border-gray-200 bg-white shadow-sm" />
              <span className="text-sm text-gray-700 text-nowrap">Private</span>
            </label>
          </div>
        </div>
      </CustomModal>
    );
};

export const JoinPublicLeagueModal = ({league}: {league: LeaguesCollectionProps}) => {
    const [leaguePasswordInput, setLeaguePasswordInput] = useState<HandleChangeParamProps | null>(null);
    const [resetForm, setResetForm] = useState(false);
    const { addPlayerToLeague } = useSetLeague();
    const user = useAppSelector((state) => state.user);

    const handleClick = async () => {
        // console.log("join", league)
        if (league?.isPrivate) {
            //Verificare che la pw sia corretta
            if (leaguePasswordInput?.value === league?.leaguePassword) {
                await addPlayerToLeague(league.id, user.id);
            }
        } else {
            await addPlayerToLeague(league.id, user.id);
        }
        setResetForm(true);
    }

    const handleClose = () => {
        setResetForm(true);
        setLeaguePasswordInput(null);
        setResetForm(false);
    }

    return(
        <CustomModal title={<p className="text-2xl sm:text-3xl font-bold sm:text-nowrap">Join League</p>} 
        closeButton={{label: "Join", style: "main", className: "mt-4 rounded-full", handleClick: handleClick}} 
        openButton={{label: "Join", isText: false, className: "rounded-full text-xs py-1 my-1 px-4 h-full", style: "main"}}
        handleClose={handleClose}
        isDialog={{value: true, style: "slim"}}>
            <div className="flex flex-col gap-4 my-2 min-w-[60vw] md:min-w-[30vw] xl:min-w-[25vw]">
                <CustomInput label="League ID" initialValue={league.name} disabled/>
            </div>
            {league.isPrivate && (
                <CustomInput label="League Password" type="password" handleChange={setLeaguePasswordInput} resetValue={resetForm} />
            )}
        </CustomModal>
    );
};

export const LeaguesModal = () => {
    return (
        <CustomModal title={<p className="text-2xl sm:text-3xl font-bold sm:text-nowrap">Leagues</p>} 
        openButton={{label: "Browse Leagues", isText: false, className: "rounded-full text-xs py-1 my-1 px-4", style: "black"}}
        closeButton={{label: "Close", style: "main"}}
        isDialog={{value: true, style: "large"}}
        className='min-w-[95%]'>
            <LeagueList />
        </CustomModal>
    );
};

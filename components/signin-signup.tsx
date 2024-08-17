'use client';

import { FutbolyLogo } from './futboly-logo';
import { InputEmail } from './input/input-email';
import { InputPassword } from './input/input-password';
import { InputUsername } from './input/input-username';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { CustomButton } from './custom/custom-button';
import { IMG_URLS } from '../utils/img-urls';
import { InputProps } from './custom/custom-input';

export type SignInSignUpProps = {
  mapObject: {
    title: string;
    otherwiseDo: {
      text: string;
      linkText: string;
      link: string;
    };
  };
  handleSubmit: (data: {
    email: string;
    password: string;
    username?: string;
  }) => Promise<boolean | undefined>;
  hideUserInput?: boolean;
};

// @ts-ignore
type HandleChangeParamProps = Parameters<InputProps['handleChange']>[0];

export const SignInSignUp = ({ mapObject, hideUserInput, handleSubmit }: SignInSignUpProps) => {
  const { title, otherwiseDo } = mapObject || {};

  const [email, setEmail] = useState<HandleChangeParamProps>();
  const [password, setPassword] = useState<HandleChangeParamProps>();
  const [username, setUsername] = useState<HandleChangeParamProps>();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (email?.isValid && password?.isValid) {
      const success = await handleSubmit({
        email: email?.value!,
        password: password?.value!,
        username: (username?.isValid && username?.value) as string,
      });

      if (!success) {
        setResetForm(true);
        setButtonDisabled(true);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const mandatoryInputsValid = email?.isValid && password?.isValid;

    if (!hideUserInput) {
      const optionalInputsValid = username?.isValid;
      setButtonDisabled(!(mandatoryInputsValid && optionalInputsValid));
    } else {
      setButtonDisabled(!mandatoryInputsValid);
    }
  }, [email, password, username]);

  return (
    <div className="flex px-4 py-12 md:px-12 gap-12 h-screen w-screen">
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
        <div className="flex justify-center mb-16">
          <FutbolyLogo />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <h1 className="font-bold text-[32px]">{title}</h1>
          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3" action="#">
              <InputEmail handleChange={setEmail} resetValue={resetForm} />
              <InputPassword handleChange={setPassword} resetValue={resetForm} />
              {!hideUserInput && (
                <InputUsername handleChange={setUsername} resetValue={resetForm} />
              )}
              <CustomButton
                label={title}
                disabled={buttonDisabled}
                type="submit"
                isLoading={isLoading}
              />
            </form>
            <div className="text-center">
              <span>{otherwiseDo.text} </span>
              <Link href={otherwiseDo.link} className="text-main ">
                {otherwiseDo.linkText}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 h-full text-center rounded-2xl hidden md:flex justify-center items-center">
        <Image
          src={IMG_URLS.LOGIN_ILLUSTRATION.src}
          className="w-full h-full max-w-[800px] max-h-[800px] md:h-[500px] lg:h-full"
          width={500}
          height={500}
          alt={IMG_URLS.LOGIN_ILLUSTRATION.alt}
        />
      </div>
    </div>
  );
};

import type {NextPage} from 'next';
import {useRouter} from "next/router";
import {useState, useMemo, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import {joiResolver} from '@hookform/resolvers/joi';
import {InputFiled, Button, Modal} from '@components/common';
import {rxHasNumber} from 'utils/regex';
import {twMerge} from 'tailwind-merge';

import {EyeIcon, EyeOffIcon, ChevronLeftIcon} from '@heroicons/react/outline';
import {schemaChangePassword} from '../../api/auth/validation';
import { changePassword } from '@api/auth/actions';

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [newPasswordShown, setNewPasswordShown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string>("");

  const {register, handleSubmit, formState, watch, getValues} = useForm({
    resolver: joiResolver(schemaChangePassword),
  });

  const onSubmit = (data: any) => {
    handleChangePasswordRequest();
  };

  const handleToggleModal = useCallback(() => {
    if (errorMessage) {
      setError("");
    } else {
      router.push("/");
    }
    setShowModal(!showModal);
  },[errorMessage, router, showModal]);

  const onTogglePassword = useCallback(() => {
    setPasswordShown((v) => !v);
  }, []);

  const onToggleNewPassword = useCallback(() => {
    setNewPasswordShown((v) => !v);
  }, []);

  const handleChangePasswordRequest = useCallback(async () => {
    const currentPassword = getValues('currentPassword');
    const newPassword = getValues('newPassword');

    try {
      await changePassword(currentPassword, newPassword);
    } catch (error: any) {
      setError(error?.data.error || "Sorry, something went wrong")
    }
    setShowModal(true);
  },[getValues]);

  const newPassword = watch('newPassword');

  const isValidPasswordLength = useMemo<boolean>(
    () => newPassword && newPassword.length >= 7,
    [newPassword],
  );

  const isValidPasswordHasNumber = useMemo<boolean>(
    () => newPassword && rxHasNumber.test(newPassword),
    [newPassword],
  );

  return (
    <div className="w-screen sm:max-w-xl h-screen sm:h-[45rem] flex flex-col items-stretch mx-auto -my-10 sm:my-auto bg-background sm:rounded-3xl py-7 px-6 border border-grayLineBased">
      <div className="flex  justify-center  h-20 relative">
        <span
          className="cursor-pointer absolute left-0 top-3"
          title="Back"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon className="w-5 h-5 cursor-pointer" />
        </span>

        <div className="flex h-20 pt-1">
          <h1 className="font-helmet">Change password</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between px-10 grow sm:grow-0"
      >
        <div className="flex flex-col h-[28rem]">
          <InputFiled
            label="Current password"
            type={passwordShown ? 'text' : 'password'}
            placeholder="Current password"
            register={register('currentPassword')}
            errorMessage={formState?.errors?.['currentPassword']?.message}
            required
            className="pb-6"

            suffixContent={
              passwordShown ? (
                <span onClick={onTogglePassword}>
                  <EyeIcon className="w-5 h-5 cursor-pointer" />
                </span>
              ) : (
                <span onClick={onTogglePassword}>
                  <EyeOffIcon className="w-5 h-5 cursor-pointer" />
                </span>
              )
            }
          />
          <InputFiled
            label="New password"
            type={newPasswordShown ? 'text' : 'password'}
            placeholder="New password"
            register={register('newPassword')}
            errorMessage={formState?.errors?.['newPassword']?.message}
            required
            className="pb-6"

            suffixContent={
              newPasswordShown ? (
                <span onClick={onToggleNewPassword}>
                  <EyeIcon className="w-5 h-5 cursor-pointer" />
                </span>
              ) : (
                <span onClick={onToggleNewPassword}>
                  <EyeOffIcon className="w-5 h-5 cursor-pointer" />
                </span>
              )
            }
          />
          <InputFiled
            label="Confirm new password"
            type="password"
            placeholder="Confirm new password"
            register={register('confirmNewPassword')}
            errorMessage={formState?.errors?.['confirmNewPassword']?.message}
            required
            className="pb-6"
          />
          <div className="grid grid-cols-2 gap-3  py-5 w-full">
            <div
              className={twMerge(
                'flex flex-col  border-t-4 py-3 border-t-success',
                !isValidPasswordLength && 'border-opacity-40',
              )}
            >
              <p className="text-sm">・7 characters </p>
            </div>
            <div
              className={twMerge(
                'flex flex-col border-t-4 py-3 border-t-success',
                !isValidPasswordHasNumber && 'border-opacity-40',
              )}
            >
              <p className="text-sm">・1 number </p>
            </div>
          </div>
        </div>

        <div className="sm:h-48  border-t-2 border-b-grayLineBased  -mx-16 ">
          <Button
            className="max-w-xs w-full  m-auto flex items-center justify-center align-middle mt-4 "
            type="submit"
            size="lg"
            variant="fill"
            value="Submit"
            // disabled={!!formState?.errors}
          >
            Change your password
          </Button>
        </div>
      </form>

      <Modal isOpen={showModal} onClose={handleToggleModal}>
        {
          errorMessage &&
          <Modal.Title>
          <h2 className="text-error text-center">
            { errorMessage }
          </h2>
        </Modal.Title>
        }
        <Modal.Description>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit de.
            </p>
          </div>
        </Modal.Description>
        <div className="mt-4">
          <Button
            className="max-w-xs w-full  m-auto flex items-center justify-center align-middle mt-4 "
            type="submit"
            size="lg"
            variant="fill"
            value="Submit"
            onClick={handleToggleModal}
            //disabled={!!formState?.errors}
          >
            {
              errorMessage ? "Close" : "Ok"
            }
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePassword;

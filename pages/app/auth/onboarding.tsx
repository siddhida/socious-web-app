import type {NextPage} from 'next';
import {GetStaticProps} from 'next';
import {useCallback, useMemo, useState} from 'react';
import {Button, Modal} from '@components/common';
import {twMerge} from 'tailwind-merge';
import OnboardingStep1 from '@components/common/Auth/Onboarding/Step1/OnboardingStep1';
import OnboardingStep2 from '@components/common/Auth/Onboarding/Step2/OnboardingStep2';
import OnboardingStep3 from '@components/common/Auth/Onboarding/Step3/OnboardingStep3';
import OnboardingStep4 from '@components/common/Auth/Onboarding/Step4/OnboardingStep4';
import OnboardingStep5 from '@components/common/Auth/Onboarding/Step5/OnboardingStep5';
import OnboardingStep6 from '@components/common/Auth/Onboarding/Step6/OnboardingStep6';
import OnboardingStep7 from '@components/common/Auth/Onboarding/Step7/OnboardingStep7';
import OnboardingStep8 from '@components/common/Auth/Onboarding/Step8/OnboardingStep8';
import OnboardingStep9 from '@components/common/Auth/Onboarding/Step9/OnboardingStep9';
import {PreAuthLayout} from 'layout';

import {useForm, FormProvider} from 'react-hook-form';

import {joiResolver} from '@hookform/resolvers/joi';

import {Libraries, useGoogleMapsScript} from 'use-google-maps-script';

import {
  schemaOnboardingStep2,
  schemaOnboardingStep3,
  schemaOnboardingStep4,
  schemaOnboardingStep5,
  schemaOnboardingStep6,
  schemaOnboardingStep7,
} from '@api/auth/validation';
import {updateProfile} from '@api/auth/actions';
import useUser from 'hooks/useUser/useUser';
import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import getGlobalData from 'services/cacheSkills';
import {uploadMedia} from '@api/media/actions';
import {AxiosError} from 'axios';
import {DefaultErrorMessage, ErrorMessage} from 'utils/request';

const schemaStep = {
  2: schemaOnboardingStep2,
  3: schemaOnboardingStep3,
  4: schemaOnboardingStep4,
  5: schemaOnboardingStep5,
  6: schemaOnboardingStep6,
  7: schemaOnboardingStep7,
};

type OnBoardingProps = {
  skills: any[];
};

// IMP: This needs to be constant.
const libraries: Libraries = ['places'];

const Onboarding: NextPage<OnBoardingProps> = ({skills}) => {
  //Loading Map
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env['NEXT_PUBLIC_GOOGLE_API_KEY'] ?? '',
    libraries,
  });

  const {user} = useUser();
  const [errorMessage, setError] = useState<ErrorMessage>();

  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [placeId, setPlaceId] = useState<string>('');

  const handleBack = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const handleToggleModal = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const formMethodsStep2 = useForm({
    mode: 'all',
    resolver: joiResolver(schemaStep[2]),
    defaultValues: {
      passions: [],
    },
  });
  const formMethodsStep3 = useForm({
    mode: 'all',
    resolver: joiResolver(schemaStep[3]),
    defaultValues: {
      skills: [],
    },
  });

  const formMethodsStep4 = useForm({resolver: joiResolver(schemaStep[4])});
  const formMethodsStep5 = useForm({
    defaultValues: {
      availableProject: 'true',
    },
    resolver: joiResolver(schemaStep[5]),
  });
  const formMethodsStep6 = useForm({
    defaultValues: {
      countryNumber: '+81',
    },
    resolver: joiResolver(schemaStep[6]),
  });
  const formMethodsStep7 = useForm({
    resolver: joiResolver(schemaStep[7]),
  });

  const handleSubmit = (data: any) => {
    if (step === 4) {
      setPlaceId(data);
      setStep(step + 1);
    } else if (step === 7) {
      console.log('Step 7');
      handleUpdateProfileRequest();
    } else if (step === 8) {
      console.log('STEP 8');
      handleImageUpload(data);
    } else if (step === 9) {
      handleToggleModal();
    } else {
      setStep(step + 1);
    }
  };

  const handleImageUpload = useCallback(
    async (file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      let media_id: string;
      console.log('FORMDATA :---: ', ...formData);
      try {
        const response: any = await uploadMedia(formData);
        media_id = response.id;
      } catch (e) {
        const error = e as AxiosError<any>;
        let msg = DefaultErrorMessage;
        console.log('ERROR Media Upload :---:', e);
        if (error.isAxiosError) {
          if (error?.code === 'ERR_NETWORK')
            msg = {
              title: 'Image size is too large.',
              message: 'Please, try again with smaller sized image.',
            };
        }
        setError(msg);
        handleToggleModal();
        return;
      }

      try {
        const profileBody: any = {
          first_name: user?.first_name,
          last_name: user?.last_name,
          username: user?.username,
        };
        console.log('PROFILE BODY :2 ', profileBody);
        profileBody.avatar = media_id;
        updateProfile(profileBody).then((response) => {
          setStep(step + 1);
        });
      } catch (error) {
        setError(DefaultErrorMessage);
        handleToggleModal();
      }
    },
    [handleToggleModal, step, user],
  );

  const handleUpdateProfileRequest = useCallback(() => {
    const bio = formMethodsStep7.getValues('bio');
    const passions = formMethodsStep2.getValues('passions');
    const city = formMethodsStep4.getValues('city');
    const country = formMethodsStep4.getValues('country');
    const skills = formMethodsStep3.getValues('skills');

    if (user === undefined) return;

    const profileBody: any = {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      social_causes: passions,
      skills: skills,
    };

    if (bio) profileBody.bio = bio;
    if (city) profileBody.city = city;
    if (country) profileBody.country = country;

    console.log('USER PROFILE 1: ', profileBody);
    updateProfile(profileBody)
      .then(() => {
        setStep(step + 1);
      })
      .catch((e) => {
        // TODO: REMOVE THIS AFTER CHECK COMPLETE
        console.log('error: 1st update', e);
        setError(DefaultErrorMessage);
        handleToggleModal();
      });
  }, [
    formMethodsStep7,
    formMethodsStep4,
    formMethodsStep3,
    formMethodsStep2,
    user,
    step,
    handleToggleModal,
  ]);

  const handleNext = useCallback(() => {
    if (step === 7) {
      console.log('I came here throught skip');
      handleUpdateProfileRequest();
    } else {
      setStep(step + 1);
    }
  }, [handleUpdateProfileRequest, step]);

  return (
    <PreAuthLayout>
      <div
        className={twMerge(
          'mx-auto flex min-h-screen w-screen flex-col items-stretch justify-between border border-grayLineBased px-6 pt-12 sm:my-auto sm:h-[45rem] sm:min-h-0 sm:max-w-xl sm:rounded-3xl sm:py-7',
          step === 9 ? ' bg-primary' : 'bg-background',
        )}
      >
        <div className="relative flex h-20 justify-center">
          <Modal isOpen={showModal} onClose={handleToggleModal}>
            <Modal.Title>
              <h2 className="text-center text-error">{errorMessage?.title}</h2>
            </Modal.Title>
            <Modal.Description>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{errorMessage?.message}</p>
              </div>
            </Modal.Description>
            <div className="mt-4">
              <Button
                className="m-auto mt-4 flex w-full max-w-xs items-center justify-center align-middle "
                type="submit"
                size="lg"
                variant="fill"
                value="Submit"
                onClick={handleToggleModal}
              >
                Close
              </Button>
            </div>
          </Modal>

          {![1, 10].includes(step) && (
            <span
              className="absolute left-0 cursor-pointer"
              title="Back"
              onClick={handleBack}
            >
              <ChevronLeftIcon className="h-5 w-5 cursor-pointer" />
            </span>
          )}
          <div className="flex h-20 pt-1">
            {[2, 3, 4, 5, 6, 7, 8].includes(step) &&
              [2, 3, 4, 5, 6, 7, 8].map((stepNumber) => (
                <div key={`stepper-${stepNumber}`} className="flex">
                  <span
                    className={twMerge(
                      'mx-1 h-3 w-3 cursor-pointer rounded-3xl  border border-grayLineBased ',
                      stepNumber === step && 'bg-primary',
                    )}
                  />
                </div>
              ))}
          </div>
          {[5, 6, 7].includes(step) && (
            <span
              className="absolute right-0 cursor-pointer text-base text-primary"
              title="Next"
              onClick={handleNext}
            >
              Skip
            </span>
          )}
        </div>

        {step === 1 && <OnboardingStep1 onSubmit={handleSubmit} />}
        <FormProvider {...formMethodsStep2}>
          {step === 2 && <OnboardingStep2 onSubmit={handleSubmit} />}
        </FormProvider>
        <FormProvider {...formMethodsStep3}>
          {step === 3 && (
            <OnboardingStep3 onSubmit={handleSubmit} rawSkills={skills} />
          )}
        </FormProvider>
        <FormProvider {...formMethodsStep4}>
          {step === 4 && <OnboardingStep4 onSubmit={handleSubmit} />}
        </FormProvider>

        <FormProvider {...formMethodsStep5}>
          {step === 5 && <OnboardingStep5 onSubmit={handleSubmit} />}
        </FormProvider>
        <FormProvider {...formMethodsStep6}>
          {step === 6 && (
            <OnboardingStep6 onSubmit={handleSubmit} defaultCountry={placeId} />
          )}
        </FormProvider>
        <FormProvider {...formMethodsStep7}>
          {step === 7 && <OnboardingStep7 onSubmit={handleSubmit} />}
        </FormProvider>
        {step === 8 && <OnboardingStep8 onSubmit={handleSubmit} />}
        {step === 9 && <OnboardingStep9 onSubmit={handleSubmit} />}
      </div>
    </PreAuthLayout>
  );
};

export default Onboarding;

export const getStaticProps: GetStaticProps = async () => {
  const skills = await getGlobalData();
  return {props: {skills}, revalidate: 60 * 60 * 24};
};

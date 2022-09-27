import React from 'react';

//components
import Title from '../components/Title';
import InputFiled from '@components/common/InputFiled/InputFiled';
import Button from '@components/common/Button/Button';
import FormTitle from '../components/FormTitle';
import TextArea from '@components/common/TextArea/TextArea';

//libraries
import {useFormContext} from 'react-hook-form';

//interfaces
import {StepProps} from '@models/stepProps';

const BasicInfo = ({onSubmit}: StepProps) => {
  const formMethods = useFormContext();
  const {register, handleSubmit, formState} = formMethods;

  return (
    <>
      <Title>Organization profile</Title>
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        <div className="h-14 w-full grow overflow-y-scroll px-4 py-2">
          <FormTitle>Basic info</FormTitle>
          <InputFiled
            label="Organization name"
            type="text"
            placeholder="Organization name"
            register={register('name')}
            errorMessage={formState.errors?.['name']?.message}
            className="my-3"
            required
          />
          <TextArea
            label="Bio"
            placeholder="Your organization’s bio"
            register={register('bio')}
            errorMessage={formState.errors?.['bio']?.message}
            className="my-3"
            required
            rows={4}
          />
          <FormTitle>Contact</FormTitle>
          <InputFiled
            label="Organization email"
            type="text"
            placeholder="Organization email"
            register={register('email')}
            errorMessage={formState.errors?.['email']?.message}
            className="my-3"
            required
          />
          <InputFiled
            label="Country"
            type="text"
            placeholder="Country"
            register={register('country')}
            errorMessage={formState.errors?.['country']?.message}
            className="my-3"
            required
          />
          <InputFiled
            label="City"
            type="text"
            placeholder="City"
            register={register('city')}
            errorMessage={formState.errors?.['city']?.message}
            className="my-3"
            required
          />
          <InputFiled
            label="Address"
            type="text"
            placeholder="Address"
            register={register('address')}
            errorMessage={formState.errors?.['address']?.message}
            className="my-3"
          />
          <div className="flex items-end gap-x-4">
            <InputFiled
              label="Phone number"
              type="text"
              placeholder="+000"
              register={register('mobile_country_code')}
              className="my-3"
            />
            <InputFiled
              type="text"
              placeholder="Phone number"
              register={register('phone')}
              className="my-3 w-full"
            />
          </div>
          <InputFiled
            label="Website"
            type="text"
            placeholder="Website"
            register={register('website')}
            errorMessage={formState.errors?.['website']?.message}
            className="my-3"
          />
        </div>
        <footer className="w-full flex-none border-t border-grayLineBased pt-6 pb-28 sm:pb-10 sm:pt-4">
          <Button
            type="submit"
            className="mx-auto flex w-8/12 justify-center py-1.5 font-medium"
          >
            continue
          </Button>
        </footer>
      </form>
    </>
  );
};

export default BasicInfo;
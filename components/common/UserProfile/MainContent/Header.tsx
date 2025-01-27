/*
 * header of user profile component
 */

import React, {useState} from 'react';
import Image from 'next/image';

// components
import Button from '@components/common/Button/Button';
import Avatar from '@components/common/Avatar/Avatar';
import {Modal} from '@components/common';

// actions
import {followUser, unfollowUser} from '@api/network/action';

// interfaces
import {KeyedMutator} from 'swr';
interface Props {
  cover_image: null | {
    created_at: string;
    filename: string;
    id: string;
    identity_id: string;
    url: string;
  };
  avatar: null | {
    created_at: string;
    filename: string;
    id: string;
    identity_id: string;
    url: string;
  };
  status: 'user' | 'organization';
  own_user?: boolean;
  following: boolean;
  id: string;
  identities_mutate: KeyedMutator<any>;
  profile_mutate: KeyedMutator<any>;
  loggedIn: boolean;
}

const Header: React.FC<Props> = ({
  cover_image,
  avatar,
  status,
  own_user = false,
  following,
  id,
  identities_mutate,
  profile_mutate,
  loggedIn,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // backgground image not exist svg
  const bg_icon = require('../../../../asset/icons/bg-image.svg');

  //follow user function
  const followHandler = async () => {
    setDisabled(true);
    try {
      const res = await followUser(id);
      identities_mutate(); //refresh identities api
      profile_mutate(); //refresh profile(user or organization) api
    } catch (e) {}
    setDisabled(false);
  };

  //unfollow user function
  const unfollowHandler = async () => {
    setDisabled(true);
    try {
      const res = await unfollowUser(id);
      identities_mutate(); //refresh identities api
      profile_mutate(); //refresh profile(user or organization) api
      handleToggleModal();
    } catch (e) {}
    setDisabled(false);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="mb-4 text-right ">
      <div className="item-center relative flex h-32 justify-center bg-primaryDark md:rounded-t-xl">
        {cover_image ? (
          <Image
            src={cover_image?.url}
            alt="socious logo"
            layout="fill"
            className="md:rounded-t-xl"
          />
        ) : (
          <Image src={bg_icon} alt="socious logo" width={24} height={24} />
        )}
        <Avatar
          src={avatar?.url}
          size="xxl"
          className="absolute top-24 left-4"
          type={status === 'organization' ? 1 : 0}
        />
      </div>
      <div className="mt-6 flex h-12 flex-row justify-end gap-4 pr-4">
        {/* show connect or following button */}
        {loggedIn && !own_user && following ? (
          <Button
            onClick={handleToggleModal}
            disabled={disabled}
            variant={'outline'}
          >
            Following
          </Button>
        ) : loggedIn && !own_user && !following ? (
          <Button onClick={followHandler} disabled={disabled}>
            {status === 'user' ? 'Connect' : 'Follow'}
          </Button>
        ) : null}

        {/* show edit profile button just for own user */}
        {loggedIn && own_user && <Button>Edit profile</Button>}
      </div>

      {/* show modal before unfollow */}
      <Modal isOpen={showModal} onClose={handleToggleModal}>
        <Modal.Title>
          <div className="flex flex-col py-6">
            <Avatar
              src={avatar?.url}
              size="xl"
              rounded={false}
              className=" mx-auto "
              type={status === 'organization' ? 1 : 0}
            />
            <div className="pb-4 pt-8">
              <p className="font-worksans text-center text-lg font-semibold text-black">
                Do you want to unfollow this account?
              </p>
            </div>
          </div>
        </Modal.Title>
        <div className="flex gap-x-12 px-4">
          <Button
            className="m-auto mt-4  flex w-full max-w-xs items-center justify-center align-middle "
            type="submit"
            size="lg"
            variant="fill"
            value="Submit"
            onClick={unfollowHandler}
          >
            Yes
          </Button>
          <Button
            className="m-auto mt-4  flex w-full max-w-xs items-center justify-center align-middle "
            type="submit"
            size="lg"
            variant="outline"
            value="Submit"
            onClick={handleToggleModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Header;

/*
 * Name ,bio , mutaul connectins , the member of connections, and followers of
 * user profile component
 */

import React from 'react';

interface Props {
  first_name: string;
  last_name: string;
  bio: string;
  followings: number;
  followers: number;
}
const ProfileInfo: React.FC<Props> = ({
  first_name,
  last_name,
  bio,
  followings,
  followers,
}) => {
  return (
    <div className="px-4">
      <h1 className=" font-worksans text-2xl font-semibold text-text ">
        {first_name} {last_name}
      </h1>
      <div className="font-base mt-1 mb-4 flex gap-x-4">
        <p className="text-grayInputField">{followings} Conections</p>
        <p className="text-grayInputField">{followers} Followers</p>
      </div>
      <p className="whitespace-pre-line break-all text-left text-sm text-black">
        {bio}
      </p>
    </div>
  );
};

export default ProfileInfo;

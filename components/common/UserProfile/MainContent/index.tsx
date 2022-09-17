/*
 * mainContent (left contetnt) of user/organization profile page
 * The type of profile is determined by status
 */

import React from 'react';

// components
import Header from './Header';
import ProfileInfo from './ProfileInfo';
import Skills from './Skills';
import SocialCauses from './SocialCauses';
import Description from './Description';
import Contact from './Contact';

// hooks
import {useUser} from '@hooks';

// interfaces
interface Props {
  data: any;
  status: 'user' | 'organization';
}

const MainContent: React.FC<Props> = ({data, status}) => {
  const {user} = useUser();
  console.log(data);
  return (
    <div className="md:w-4/6 border-grayLineBased  border border-1 rounded-xl mb-8  ">
      <Header
        avatar={status === 'user' ? data?.avatar : data?.image}
        cover_image={data?.cover_image}
        status={status}
      />
      <ProfileInfo
        first_name={data?.first_name}
        last_name={data?.last_name}
        bio={data?.bio}
        followings={data?.followings}
        followers={data?.followers}
      />

      {/* if user is current user show 'You' */}
      {user?.username === data?.username && (
        <p className="text-secondary text-sm mt-3 px-4">You </p>
      )}

      <SocialCauses social_causes={data?.social_causes} />
      {status === 'user' ? (
        <Contact
          address={data?.address}
          country={data?.country}
          city={data?.city}
          status={status}
        />
      ) : (
        <Contact
          address={data?.address}
          country={data?.country}
          city={data?.city}
          mobile_country_code={data?.mobile_country_code}
          email={data?.email}
          phone={data?.phone}
          website={data?.website}
          status={status}
        />
      )}
      <Description
        paragraph={data?.mission}
        title={status === 'user' ? 'About' : 'Mission'}
      />
      {status === 'user' && <Skills skills={data?.skills} />}
      <hr className="border-grayLineBased mb-20" />
    </div>
  );
};

export default MainContent;
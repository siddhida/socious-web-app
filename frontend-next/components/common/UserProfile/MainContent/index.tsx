/*
 * mainContent (left contetnt) of user profile page
 */

import React from 'react';

// components
import Header from './Header';
import ProfileInfo from './ProfileInfo';
import Skills from './Skills';
import SocialCauses from './SocialCauses';
import About from './About';
import Contact from './Contact';

//hooks
import {useUser} from '@hooks';

const MainContent: React.FC<any> = ({data}) => {
  const {user} = useUser();

  return (
    <div className="md:w-4/6 border-grayLineBased  border border-1 rounded-xl mb-8  ">
      <Header avatar={data?.avatar} cover_image={data?.cover_image} />
      <ProfileInfo
        first_name={data?.first_name}
        last_name={data?.last_name}
        bio={data?.bio}
        followings={data?.followings}
        followers={data?.followers}
      />
      {/* if user is current user show 'You' */}
      {user.username === data.username && (
        <p className="text-secondary text-sm mt-3 px-4">You </p>
      )}
      <SocialCauses social_causes={data?.social_causes} />
      <Contact
        address={data?.address}
        country={data?.country}
        city={data?.city}
      />
      <About mission={data?.mission} />
      <Skills skills={data?.skills} />
    </div>
  );
};

export default MainContent;
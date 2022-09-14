import useSWR from 'swr';
import { useEffect, useReducer } from 'react';

import StatusCard from './StatusCard';
import NetworkCard from './NetworkCard';
import ProjectsCard from './ProjectsCard';
import ProfileCard from 'layout/screen/ProfileCard/ProfileCard';
import OrganizationCard from './OrganizationCard';
import { get } from 'utils/request';
import useUser from "hooks/useUser/useUser";

interface identity {
  created_at: string;
  current: boolean;
  id: string
  meta: {[index: string]: string};
  primary: boolean;
  type: string;
}

const SideBar = () => {
  const { data } = useSWR<any>("/api/v2/identities", get, {
    onErrorRetry: (error) => {
      if (error?.response?.status === 401) return
    },
    revalidateOnFocus: false,
  });
  const { user } = useUser();

  const identity = data?.find((item: any) => item.current);

  return (
    <div className="w-80" aria-label="Sidebar">
      <div className="space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ProfileCard
            content={user?.mission}
            name={identity?.meta?.name}
            avatar={user?.avatar?.url}
            following={user?.following}
            followers={user?.followers}
        />
        {/* TODO: Uncomment after status is fixed */}
        {/* <StatusCard status={user?.status} /> */}
        { identity?.type === "users" ? 
          <NetworkCard />
          :
          <OrganizationCard />
        }
        <ProjectsCard isOrganization={identity?.type !== "users"} />
      </div>
    </div>
  );
};

export default SideBar;
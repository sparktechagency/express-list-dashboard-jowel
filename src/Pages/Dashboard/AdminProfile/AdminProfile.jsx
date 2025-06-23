import { Tabs } from 'antd';
import React from 'react';
import UserProfile from './UserProfile';

const AdminProfile = () => { 

    const items = [
        {
          key: "1",
          label: "Edit Profile",
          children: <UserProfile />,
        },
        // {
        //   key: "2",
        //   label: "Change Password ",
        //   children: <ChangePassword/>,
        // },
      ]; 

    return (
        <div>
    
        <div
         
          className=" bg-white p-5 px-10 rounded-xl "
        >
          <Tabs defaultActiveKey="1" items={items} />
        </div>
   
        </div>
    );
};

export default AdminProfile;
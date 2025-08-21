import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { MdOutlineCategory, MdOutlineHome } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMiniUsers, HiUserGroup } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import { PiHouseLine, PiSquaresFourLight } from "react-icons/pi";
import { BiLock } from "react-icons/bi";
import image4 from "../../assets/image4.png";


const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <PiSquaresFourLight size={24} />,
      label: <Link to="/">Overview</Link>,
    },
    {
      key: "/retailer",
      icon: <PiHouseLine size={24} />,
      label: <Link to="/retailer">Retailer</Link>,
    },
    {
      key: "/wholesealer",
      icon: <MdOutlineHome size={24} />,
      label: <Link to="/wholesealer">WholeSealer</Link>,
    },
    {
      key: "/users",
      icon: <HiMiniUsers size={24} />,
      label: <Link to="/users">Subscribe</Link>,
    },
    /* {
            key: "/subscription",
            icon: <MdOutlineAdminPanelSettings size={24} />,
            label: <Link to="/subscription">Subscription</Link>
        }, */
    /* {
            key: "/admin",
            icon: <MdOutlineAdminPanelSettings size={24} />,
            label: <Link to="/admin">Make Admin</Link>
        }, */
    // {
    //   key: "/category",
    //   icon: <IoNotificationsOutline size={24} />,
    //   label: <Link to="/category">Push Notification</Link>,
    // },
    {
      key: "/invite-link",
      icon: <RiMoneyDollarBoxLine size={24} />,
      label: <Link to="/invite-link">Invite Link</Link>,
    },
    {
      key: "/events",
      icon: <BiLock size={24} />,
      label: <Link to="/events">Password</Link>,
    },
      {
        key: "subMenuSetting",
        icon: <IoSettingsOutline size={24} />,
        label: "Settings",
        children: [
          {
            key: "/banner",
            label: (
              <Link to="/banner" className="text-white hover:text-white">
                Banner
              </Link>
            ),
          },
          {
            key: "/about-us",
            label: (
              <Link to="/about-us" className="text-white hover:text-white">
                About Us
              </Link>
            ),
          },
          {
            key: "/terms-and-conditions",
            label: (
              <Link
                to="/terms-and-conditions"
                className="text-white hover:text-white"
              >
                Terms And Condition
              </Link>
            ),
          },
          {
            key: "/privacy-policy",
            label: (
              <Link
                to="/privacy-policy"
                className="text-white hover:text-white"
              >
                Privacy Policy
              </Link>
            ),
          },
          // {
          //   key: "/change-password",
          //   label: (
          //     <Link
          //       to="/change-password"
          //       className="text-white hover:text-white"
          //     >
          //       Change Password
          //     </Link>
          //   ),
          // },
        ],
      },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24}  />,
      label: (
        <p onClick={handleLogout}>
          Logout
        </p>
      ),
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="mb-20 h-screen bg-[#3FC7EE] text-white">
      <Link to={"/"} className="flex items-center justify-center py-4">
        <img src={image4} alt="logo" />
      </Link>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        className="font-poppins text-white"
        style={{
          borderRightColor: "transparent",
          background: "transparent",
        }}
        theme="dark" // Ensures a dark mode where text remains white
        items={menuItems.map((item) => ({
          ...item,
          label: <span className="text-white">{item.label}</span>, // Forces white text color
        }))}
      />
    </div>
  );
};

export default Sidebar;

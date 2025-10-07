import React, { useState } from "react";
import {
  useGetInviteLinksQuery,
  useCrateInviteLinksMutation,
  useUpdateInviteLinksMutation,
  useDeleteMutation,
} from "../../redux/apiSlices/inviteLinkApi";
import {
  useCreateAppleInviteLinksMutation,
  useGetAppleInviteLinksQuery,
} from "../../redux/apiSlices/appleInviteLinkApi";
import {
  Button,
  Card,
  Input,
  Modal,
  Spin,
  message,
  Tabs,
  Select,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  CalendarOutlined,
  AppleOutlined,
  AndroidOutlined,
} from "@ant-design/icons";

const InviteLinks = () => {
  // Invite Links API
  const { data: inviteLinks, isLoading, refetch } = useGetInviteLinksQuery();
  const [createInviteLink, { isLoading: isCreating }] =
    useCrateInviteLinksMutation();
  const [updateInviteLink, { isLoading: isUpdating }] =
    useUpdateInviteLinksMutation();
  const [deleteInviteLink, { isLoading: isDeleting }] = useDeleteMutation();

  // Apple Links API
  const {
    data: appleLinks,
    isLoading: isAppleLoading,
    refetch: refetchApple,
  } = useGetAppleInviteLinksQuery();
  const [createAppleLink, { isLoading: isCreatingApple }] =
    useCreateAppleInviteLinksMutation();

  const inviteLinksData = inviteLinks?.data || [];
  // Apple link data is an object, convert to array for cards
  const appleLinksData = appleLinks?.data ? [appleLinks.data] : [];

  const [activeTab, setActiveTab] = useState("invite");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkType, setLinkType] = useState("android");
  const [currentLink, setCurrentLink] = useState(null);

  // Invite Links Functions
  const handleCreateLink = async () => {
    if (!linkInput.trim()) {
      message.error("Please enter a valid link");
      return;
    }

    try {
      await createInviteLink({ link: linkInput });
      message.success("Invite link created successfully");
      setLinkInput("");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error("Failed to create invite link");
    }
  };

  const handleUpdateLink = async () => {
    if (!linkInput.trim() || !currentLink?._id) {
      message.error("Please enter a valid link");
      return;
    }

    try {
      await updateInviteLink({
        id: currentLink._id,
        data: { link: linkInput },
      });
      message.success("Invite link updated successfully");
      setLinkInput("");
      setIsEditModalOpen(false);
      setCurrentLink(null);
      refetch();
    } catch (error) {
      message.error("Failed to update invite link");
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await deleteInviteLink(id);
      message.success("Invite link deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete invite link");
    }
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setLinkInput(link.link);
    setIsEditModalOpen(true);
  };

  // Apple Links Functions
  const handleCreateAppleLink = async () => {
    if (!linkInput.trim()) {
      message.error("Please enter a valid link");
      return;
    }

    try {
      await createAppleLink({ link: linkInput, type: linkType });
      message.success("Apple link created successfully");
      setLinkInput("");
      setLinkType("android");
      setIsModalOpen(false);
      refetchApple();
    } catch (error) {
      message.error("Failed to create apple link");
    }
  };

  const handleUpdateAppleLink = async () => {
    if (!linkInput.trim()) {
      message.error("Please enter a valid link");
      return;
    }

    try {
      await createAppleLink({ link: linkInput, type: linkType });
      message.success("Apple link updated successfully");
      setLinkInput("");
      setLinkType("android");
      setIsEditModalOpen(false);
      setCurrentLink(null);
      refetchApple();
    } catch (error) {
      message.error("Failed to update apple link");
    }
  };

  const openAppleEditModal = (link) => {
    setCurrentLink(link);
    setLinkInput(link.link);
    setLinkType(link.type || "android");
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || isAppleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "invite",
      label: "Invite Links",
      children: (
        <div>
          <div className="flex justify-end mb-6">
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Create New Link
            </Button>
          </div>

          {inviteLinksData.length === 0 ? (
            <Empty description="No invite links found. Create one to get started." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inviteLinksData.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-lg transition-shadow"
                  actions={[
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </Button>,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteLink(item._id)}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <LinkOutlined className="text-primary mt-1" />
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {item.link}
                      </a>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span>Created: {formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span>Updated: {formatDate(item.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "apple",
      label: "Apple Links",
      children: (
        <div>
          <div className="flex justify-end mb-6">
            <Button
              type="primary"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Create New Apple Link
            </Button>
          </div>

          {appleLinksData.length === 0 ? (
            <Empty description="No apple links found. Create one to get started." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appleLinksData.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-lg transition-shadow"
                  actions={[
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => openAppleEditModal(item)}
                    >
                      Edit
                    </Button>,
                  ]}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "ios" ? (
                        <AppleOutlined className="text-lg" />
                      ) : (
                        <AndroidOutlined className="text-lg text-green-600" />
                      )}
                      <span className="font-semibold capitalize text-lg">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <LinkOutlined className="text-primary mt-1" />
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {item.link}
                      </a>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span>Created: {formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span>Updated: {formatDate(item.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Links Management</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* Create Modal */}
      <Modal
        title={
          activeTab === "invite" ? "Create Invite Link" : "Create Apple Link"
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setLinkInput("");
          setLinkType("android");
        }}
        footer={
          <div style={{ marginTop: "12px", textAlign: "right" }}>
            <Button
              key="cancel"
              onClick={() => {
                setIsModalOpen(false);
                setLinkInput("");
                setLinkType("android");
              }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={activeTab === "invite" ? isCreating : isCreatingApple}
              onClick={
                activeTab === "invite"
                  ? handleCreateLink
                  : handleCreateAppleLink
              }
              className="bg-primary hover:bg-primary/90 ml-2 py-4"
            >
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter link (e.g., https://youtu.be/example)"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          {activeTab === "apple" && (
            <Select
              placeholder="Select type"
              value={linkType}
              onChange={setLinkType}
              style={{ width: "100%" }}
              options={[
                { value: "android", label: "Android" },
                { value: "ios", label: "iOS" },
              ]}
            />
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={activeTab === "invite" ? "Edit Invite Link" : "Edit Apple Link"}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setLinkInput("");
          setLinkType("android");
          setCurrentLink(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsEditModalOpen(false);
              setLinkInput("");
              setLinkType("android");
              setCurrentLink(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={activeTab === "invite" ? isUpdating : isCreatingApple}
            onClick={
              activeTab === "invite" ? handleUpdateLink : handleUpdateAppleLink
            }
            className="bg-primary hover:bg-primary/90"
          >
            Update
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <Input
            placeholder="Enter link (e.g., https://youtu.be/example)"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          {activeTab === "apple" && (
            <Select
              placeholder="Select type"
              value={linkType}
              onChange={setLinkType}
              style={{ width: "100%" }}
              options={[
                { value: "android", label: "Android" },
                { value: "ios", label: "iOS" },
              ]}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default InviteLinks;

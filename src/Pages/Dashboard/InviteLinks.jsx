import React, { useState } from 'react';
import { useGetInviteLinksQuery, useCrateInviteLinksMutation, useUpdateInviteLinksMutation, useDeleteMutation } from '../../redux/apiSlices/inviteLinkApi';
import { Button, Card, Input, Modal, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';

const InviteLinks = () => {
  const { data: inviteLinks, isLoading, refetch } = useGetInviteLinksQuery();
  const [createInviteLink, { isLoading: isCreating }] = useCrateInviteLinksMutation();
  const [updateInviteLink, { isLoading: isUpdating }] = useUpdateInviteLinksMutation();
  const [deleteInviteLink, { isLoading: isDeleting }] = useDeleteMutation();
  
  // Updated data handling - data is now an array
  const inviteLinksData = inviteLinks?.data || [];
  console.log('Invite Links Data:', inviteLinksData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [currentLink, setCurrentLink] = useState(null);

  const handleCreateLink = async () => {
    if (!linkInput.trim()) {
      message.error('Please enter a valid link');
      return;
    }

    try {
      await createInviteLink({ link: linkInput });
      message.success('Invite link created successfully');
      setLinkInput('');
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error('Failed to create invite link');
    }
  };

  const handleUpdateLink = async () => {
    if (!linkInput.trim() || !currentLink?._id) {
      message.error('Please enter a valid link');
      return;
    }

    try {
      await updateInviteLink({ id: currentLink._id, data: { link: linkInput } });
      message.success('Invite link updated successfully');
      setLinkInput('');
      setIsEditModalOpen(false);
      setCurrentLink(null);
      refetch();
    } catch (error) {
      message.error('Failed to update invite link');
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await deleteInviteLink(id);
      message.success('Invite link deleted successfully');
      refetch();
    } catch (error) {
      message.error('Failed to delete invite link');
    }
  };

  const openEditModal = (link) => {
    setCurrentLink(link);
    setLinkInput(link.link);
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Invite Links</h1>
        <Button 
          type="primary" 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          Create New Link
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inviteLinksData.map((link) => (
          <Card 
            key={link._id}
            className="shadow-md hover:shadow-lg transition-shadow"
            actions={[
              <EditOutlined key="edit" onClick={() => openEditModal(link)} />,
              <DeleteOutlined key="delete" onClick={() => handleDeleteLink(link._id)} />,
            ]}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <LinkOutlined className="text-primary text-xl" />
                <a 
                  href={link.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {link.link}
                </a>
              </div>
              <p className="text-gray-500 text-sm">Created: {formatDate(link.createdAt)}</p>
              <p className="text-gray-500 text-sm">Updated: {formatDate(link.updatedAt)}</p>
            </div>
          </Card>
        ))}

        {inviteLinksData.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No invite links found. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        title="Create Invite Link"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setLinkInput('');
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsModalOpen(false);
              setLinkInput('');
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isCreating} 
            onClick={handleCreateLink}
            className="bg-primary hover:bg-primary/90"
          >
            Create
          </Button>
        ]}
      >
        <Input
          placeholder="Enter link (e.g., https://youtu.be/example)"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="mt-4"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Invite Link"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setLinkInput('');
          setCurrentLink(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsEditModalOpen(false);
              setLinkInput('');
              setCurrentLink(null);
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={isUpdating} 
            onClick={handleUpdateLink}
            className="bg-primary hover:bg-primary/90"
          >
            Update
          </Button>
        ]}
      >
        <Input
          placeholder="Enter link (e.g., https://youtu.be/example)"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="mt-4"
        />
      </Modal>
    </div>
  );
};

export default InviteLinks;
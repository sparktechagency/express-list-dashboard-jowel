import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Button, message, Modal } from 'antd';
import { useCreateContactUsMutation, useGetContactUsQuery, useUpdateContactUsMutation } from '../../redux/apiSlices/settings';

const ContactUs = () => {
  const editor = useRef(null);
  const { data: contactUsResponse, isLoading: isLoadingSetting, isError } = useGetContactUsQuery();
  const [updateContactUs, { isLoading: isUpdating }] = useUpdateContactUsMutation();
  const [createContactUs, { isLoading: isCreating }] = useCreateContactUsMutation();
  const [contactUsContent, setContactUsContent] = useState("");

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract contact us data from response array
  const contactUsData = contactUsResponse?.data?.find(item => item.types === 'contactUs');

  useEffect(() => {
    if (contactUsData?.body) {
      setContactUsContent(contactUsData.body);
    }
  }, [contactUsData]);

  // Show modal handler
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    // Reset content to original on cancel to discard changes
    setContactUsContent(contactUsData?.body || "");
    setIsModalOpen(false);
  };

  // Handle modal OK (save)
  const handleOk = async () => {
    if (!contactUsContent || contactUsContent.trim() === '') {
      message.error("Content cannot be empty");
      return;
    }

    try {
      let result;
      
      if (!contactUsData?._id) {
        // Create new Contact Us if no data exists
        result = await createContactUs({
          body: contactUsContent,
          types: "contactUs"
        }).unwrap();
      } else {
        // Update existing Contact Us
        result = await updateContactUs({ 
          id: contactUsData._id,
          data: {
            body: contactUsContent,
            types: "contactUs"
          }
        }).unwrap();
      }
      
      if (result.success) {
        message.success(result.message || "Contact Us saved successfully!");
        setIsModalOpen(false);
      } else {
        message.error(result.message || "Failed to save Contact Us.");
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save Contact Us.";
      message.error(errorMessage);
      console.error('Save error:', error);
    }
  };

  if (isLoadingSetting) return <p>Loading Contact Us...</p>;
  if (isError) return <p>Failed to load Contact Us.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Contact Us</h2>
        <Button
          onClick={showModal}
          className="h-10 text-white w-60 bg-[#3FC7EE]"
        >
          Edit Contact Us
        </Button>
      </div>

      <div className="p-6 rounded-lg bg-[#3FC7EE]">
        <div className="p-6 mt-6 bg-white border rounded-lg saved-content">
          <div
            dangerouslySetInnerHTML={{ __html: contactUsContent }}
            className="prose max-w-none"
          />
        </div>
      </div>

      <Modal
        title="Update Contact Us"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="65%"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="py-5 mr-2 text-white bg-red-500"
            disabled={isUpdating}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            className="text-white bg-[#3FC7EE]"
            disabled={isUpdating || isCreating}
          >
            {(isUpdating || isCreating) ? "Saving..." : (contactUsData?._id ? "Update Contact Us" : "Create Contact Us")}
          </Button>
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={contactUsContent}
              onChange={setContactUsContent}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactUs;
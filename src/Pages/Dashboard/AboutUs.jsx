import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Button, message, Modal } from 'antd';
import { useGetAboutUsQuery, useUpdateAboutUsMutation, useCreateAboutUsMutation } from '../../redux/apiSlices/aboutUsApi';
// import { useGetAboutUsQuery, useUpdateAboutUsMutation } from "../../redux/apiSlices/aboutSlice";

const AboutUs = () => {
  const editor = useRef(null);
  const { data: aboutUsResponse, isLoading: isLoadingSetting, isError } = useGetAboutUsQuery();
  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();
  const [createAboutUs, { isLoading: isCreating }] = useCreateAboutUsMutation();
  const [aboutUsContent, setAboutUsContent] = useState("");

  
  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract about us data from response array
  const aboutUsData = aboutUsResponse?.data?.find(item => item.types === 'aboutUs');

  useEffect(() => {
    if (aboutUsData?.body) {
      setAboutUsContent(aboutUsData.body);
    }
  }, [aboutUsData]);

  // Show modal handler
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    // Reset content to original on cancel to discard changes
    setAboutUsContent(aboutUsData?.body || "");
    setIsModalOpen(false);
  };

  // Handle modal OK (save)
  const handleOk = async () => {
    if (!aboutUsContent || aboutUsContent.trim() === '') {
      message.error("Content cannot be empty");
      return;
    }

    try {
      let result;
      
      if (!aboutUsData?._id) {
        // Create new About Us if no data exists
        result = await createAboutUs({
          body: aboutUsContent,
          types: "aboutUs"
        }).unwrap();
      } else {
        // Update existing About Us
        result = await updateAboutUs({ 
          id: aboutUsData._id,
          data: {
            body: aboutUsContent,
            types: "aboutUs"
          }
        }).unwrap();
      }
      
      if (result.success) {
        message.success(result.message || "About Us saved successfully!");
        setIsModalOpen(false);
      } else {
        message.error(result.message || "Failed to save About Us.");
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save About Us.";
      message.error(errorMessage);
      console.error('Save error:', error);
    }
  };

  if (isLoadingSetting) return <p>Loading About Us...</p>;
  if (isError) return <p>Failed to load About Us.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">About Us</h2>
        <Button
          onClick={showModal}
          className="h-10 text-white w-60 bg-[#3FC7EE]"
        >
          Edit About Us
        </Button>
      </div>

      <div className="p-6 rounded-lg bg-[#3FC7EE]">
        <div className="p-6 mt-6 bg-white border rounded-lg saved-content">
          <div
            dangerouslySetInnerHTML={{ __html: aboutUsContent }}
            className="prose max-w-none"
          />
        </div>
      </div>

      <Modal
        title="Update About Us"
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
            {(isUpdating || isCreating) ? "Saving..." : (aboutUsData?._id ? "Update About Us" : "Create About Us")}
          </Button>
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={aboutUsContent}
              onChange={setAboutUsContent}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AboutUs;
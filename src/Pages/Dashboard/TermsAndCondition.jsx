import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
// import GradientButton from "../../components/common/GradiantButton";
import { Button, message, Modal } from "antd";
import { useGetTermsQuery, useUpdateTermsMutation } from "../../redux/apiSlices/termsApi";


const TermsAndConditions = () => {
  const editor = useRef(null);
  const { data: termsResponse, isLoading: isLoadingSetting, isError } = useGetTermsQuery();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsMutation();
  const [termsContent, setTermsContent] = useState("");
  
  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract terms data from response array
  const termsData = termsResponse?.data?.find(item => item.types === 'termsAndConditions');

  useEffect(() => {
    if (termsData?.body) {
      setTermsContent(termsData.body);
    }
  }, [termsData]);

  // Show modal handler
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    // Reset content to original on cancel to discard changes
    setTermsContent(termsData?.body || "");
    setIsModalOpen(false);
  };

  // Handle modal OK (save)
  const handleOk = async () => {
    if (!termsContent || termsContent.trim() === '') {
      message.error("Content cannot be empty");
      return;
    }

    if (!termsData?._id) {
      message.error("Terms ID not found. Please refresh the page.");
      return;
    }

    try {
      const result = await updateTerms({ 
        id: termsData._id,
        body: termsContent,
        types: "termsAndConditions"
      }).unwrap();
      
      if (result.success) {
        message.success(result.message || "Terms and conditions updated successfully!");
        setIsModalOpen(false);
      } else {
        message.error(result.message || "Failed to update Terms and conditions.");
      }
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to update Terms and conditions.";
      message.error(errorMessage);
      console.error('Update error:', error);
    }
  };

  if (isLoadingSetting) return <p>Loading Terms and conditions...</p>;
  if (isError) return <p>Failed to load Terms and conditions.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Terms and conditions</h2>
        <Button
          onClick={showModal}
          className="h-10 text-white w-60 bg-secondary"
        >
          Edit Terms and Conditions
        </Button>
      </div>

      <div className="p-6 rounded-lg bg-primary">
        <div className="p-6 mt-6 bg-white border rounded-lg saved-content">
          <div
            dangerouslySetInnerHTML={{ __html: termsContent }}
            className="prose max-w-none"
          />
        </div>
      </div>

      <Modal
        title="Update Terms and conditions"
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
            className="text-white bg-secondary"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Terms and conditions"}
          </Button>
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={termsContent}
              onChange={setTermsContent}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TermsAndConditions;
import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useChangePasswordMutation } from "../../redux/apiSlices/authSlice";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm();

  // Define error messages state
  const [errorMessages, setErrorMessages] = useState({
    newPassError: "",
    conPassError: "",
  });

  // Validate password change
  const validatePasswordChange = (values) => {
    let errors = {};

    if (values.currentPassword === values.newPassword) {
      errors.newPassError = "The New password is similar to the old Password";
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.conPassError = "New Password and Confirm Password don't match";
    }

    setErrorMessages(errors);
    return errors;
  };

  const onFinish = async (values) => {
    const errors = validatePasswordChange(values);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const result = await changePassword(values);

      // Check if result.data exists and is the expected format
      if (result.data) {
        console.log("API Response:", result.data); // Inspect the response
        if (result.data.success) {
          toast.success("Password changed successfully");
          form.resetFields();
        }
      } else if (result.error) {
        console.log("Error response:", result.error);
        const errorMessage =
          result.error.data?.message || "Password change failed";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("An error occurred while changing the password");
    }
  };


  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-1">
          <IoArrowBackCircleOutline size={26} className="font-medium" />
          Change Password
        </h1>
      </div>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="w-[50%] mx-auto mt-20"
      >
        <Form.Item
          name="currentPassword"
          label={<p>Current Password</p>}
          rules={[
            { required: true, message: "Please enter your current password!" },
          ]}
        >
          <Input.Password
            placeholder="Enter current password"
            className="h-12"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={<p>New Password</p>}
          rules={[{ required: true, message: "Please enter a new password!" }]}
        >
          <Input.Password placeholder="Enter new password" className="h-12" />
        </Form.Item>
        {errorMessages.newPassError && (
          <p className="text-red-500">{errorMessages.newPassError}</p>
        )}

        <Form.Item
          name="confirmPassword"
          label={<p>Confirm Password</p>}
          rules={[
            { required: true, message: "Please confirm your new password!" },
          ]}
        >
          <Input.Password placeholder="Confirm new password" className="h-12" />
        </Form.Item>
        {errorMessages.conPassError && (
          <p className="text-red-500">{errorMessages.conPassError}</p>
        )}

        <Form.Item className="text-center">
          <Button
            htmlType="submit"
            loading={isLoading}
            className="w-full h-12 bg-[#3FC7EE] text-white"
          >
            Update password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;

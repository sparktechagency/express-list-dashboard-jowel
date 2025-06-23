import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  message,
  Upload,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  useCreateRetailerMutation,
  useUpdateRetailerMutation,
} from "../../redux/apiSlices/retailerApi";

const RetailerFormModal = ({ isOpen, onClose, retailer }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  const [createRetailer, { isLoading }] = useCreateRetailerMutation();
  const [updateRetailer, { isLoading: updating }] = useUpdateRetailerMutation();

  const isEditMode = !!retailer?._id;

  const businessCategories = [
    "HouseholdItem",
    "Technology",
    "Communication",
    "Education",
    "FashionAndBeauty",
  ];

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        form.setFieldsValue({
          name: retailer.name,
          storeName: retailer.storeName,
          email: retailer.email,
          phone: retailer.phone,
          // companyAddress: retailer.address,
          role: "Retailer",
          // Adding the storeInformation fields
          "storeInformation.businessName":
            retailer.storeInformation?.businessName || "",
          "storeInformation.businessCategory":
            retailer.storeInformation?.businessCategory || "",
          "storeInformation.location":
            retailer.storeInformation?.location || "",
        });

        // Set image if exists
        if (retailer.image) {
          setImageUrl(retailer.image);
          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: retailer.image,
            },
          ]);
        } else {
          setImageUrl("");
          setFileList([]);
        }
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: "Retailer",
          // Initialize storeInformation fields
          "storeInformation.businessName": "",
          "storeInformation.businessCategory": "",
          "storeInformation.location": "",
        });
        setImageUrl("");
        setFileList([]);
      }
    }
  }, [isOpen, retailer, form, isEditMode]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Create storeInformation object
      const storeInformation = {
        businessName: values["storeInformation.businessName"],
        businessCategory: values["storeInformation.businessCategory"],
        location: values["storeInformation.location"],
      };

      // Remove the individual storeInformation fields
      delete values["storeInformation.businessName"];
      delete values["storeInformation.businessCategory"];
      delete values["storeInformation.location"];

      // Add storeInformation as JSON
      formData.append("storeInformation", JSON.stringify(storeInformation));

      // Append remaining form values to FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Append image file if exists
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      let response;

      if (isEditMode) {
        // Update existing retailer using PATCH
        response = await updateRetailer({
          id: retailer._id,
          data: formData,
        });

        if (response.error) {
          throw new Error(response.error.data?.message || "Update failed");
        }

        message.success("Retailer updated successfully");
      } else {
        // Create new retailer
        response = await createRetailer(formData);

        if (response.error) {
          throw new Error(response.error.data?.message || "Creation failed");
        }

        message.success("Retailer added successfully");
      }

      onClose();
    } catch (error) {
      message.error(error.message || "Failed to save retailer information");
      console.error(error);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else if (newFileList.length > 0 && newFileList[0].url) {
      setImageUrl(newFileList[0].url);
    } else {
      setImageUrl("");
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={isEditMode ? "Update Retailer" : "Add Retailer"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Enter Company name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Company Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <PhoneInput
                country={"us"}
                inputStyle={{ width: "100%" }}
                containerStyle={{ width: "100%" }}
              />
            </Form.Item>

            {/* <Form.Item name="companyAddress" label="Company Address">
              <Input.TextArea placeholder="Enter Address" rows={4} />
            </Form.Item> */}

            {/* Store Information Fields */}
            <div style={{ marginBottom: 16 }}>
              <h3>Store Information</h3>
            </div>

            <Form.Item
              name="storeInformation.businessName"
              label="Business Name"
              rules={[
                { required: true, message: "Please enter business name" },
              ]}
            >
              <Input placeholder="Enter Business Name" />
            </Form.Item>

            <Form.Item
              name="storeInformation.businessCategory"
              label="Business Category"
              rules={[
                { required: true, message: "Please select business category" },
              ]}
            >
              <Select placeholder="Select Business Category">
                {businessCategories.map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="storeInformation.location"
              label="Location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input placeholder="Enter Location" />
            </Form.Item>

            {/* Role field - editable in edit mode, read-only in add mode */}
            <Form.Item name="role" label="Role">
              {isEditMode ? (
                <Input placeholder="Enter Role" />
              ) : (
                <Input
                  value="Retailer"
                  readOnly
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              )}
            </Form.Item>

            {/* Only show password fields when creating a new retailer */}
            {!isEditMode && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="Password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter password" },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter Password" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["Password"]}
                    rules={[
                      { required: true, message: "Please confirm password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("Password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm Password" />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>

          <Col span={8}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleImageChange}
              beforeUpload={() => false}
              maxCount={1}
              itemRender={(originNode, file) => {
                return (
                  <div
                    style={{
                      width: "150px",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={file.thumbUrl || file.url}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                );
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            <Row justify="space-between" style={{ marginTop: 24 }}>
              <Space className="mt-20">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#3FC7EE", borderColor: "#3FC7EE" }}
                  className="m"
                >
                  {isLoading
                    ? "Adding..."
                    : updating
                    ? "Updating..."
                    : isEditMode
                    ? "Update"
                    : "Add Retailer"}{" "}
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RetailerFormModal;

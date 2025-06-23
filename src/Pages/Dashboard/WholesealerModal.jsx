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
  useCreateWholesalerMutation,
  useUpdateWholesalerMutation,
} from "../../redux/apiSlices/wholesalerApi";


const WholesalerFormModal = ({ isOpen, onClose, wholesaler }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  const [createWholesaler, { isLoading }] = useCreateWholesalerMutation();
  const [updateWholesaler, { isLoading: updating }] =
    useUpdateWholesalerMutation();

  const isEditMode = !!wholesaler?._id;

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
          name: wholesaler.name,
          storeName: wholesaler.storeName,
          email: wholesaler.email,
          phone: wholesaler.phone,
          // companyAddress: wholesaler.address,
          role: "Wholesaler",
          // Adding the storeInformation fields
          "storeInformation.businessName":
            wholesaler.storeInformation?.businessName || "",
          "storeInformation.businessCategory":
            wholesaler.storeInformation?.businessCategory || "",
          "storeInformation.location":
            wholesaler.storeInformation?.location || "",
        });

        if (wholesaler.image) {
          setImageUrl(wholesaler.image);
          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: wholesaler.image,
            },
          ]);
        } else {
          setImageUrl("");
          setFileList([]);
        }
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: "Wholesaler",
          // Initialize storeInformation fields
          "storeInformation.businessName": "",
          "storeInformation.businessCategory": "",
          "storeInformation.location": "",
        });
        setImageUrl("");
        setFileList([]);
      }
    }
  }, [isOpen, wholesaler, form, isEditMode]);

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

      // Add other fields
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      let response;

      if (isEditMode) {
        response = await updateWholesaler({
          id: wholesaler._id,
          data: formData,
        });

        if (response.error) {
          throw new Error(response.error.data?.message || "Update failed");
        }

        message.success("Wholesaler updated successfully");
      } else {
        response = await createWholesaler(formData);

        if (response.error) {
          throw new Error(response.error.data?.message || "Creation failed");
        }

        message.success("Wholesaler added successfully");
      }

      onClose();
    } catch (error) {
      message.error(error.message || "Failed to save wholesaler information");
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
      title={isEditMode ? "Update Wholesaler" : "Add Wholesaler"}
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

            <Form.Item name="role" label="Role">
              {isEditMode ? (
                <Input placeholder="Enter Role" />
              ) : (
                <Input
                  value="Wholesaler"
                  readOnly
                  style={{ backgroundColor: "#f5f5f5" }}
                />
              )}
            </Form.Item>

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
                >
                  {isLoading
                    ? "Adding..."
                    : updating
                    ? "Updating..."
                    : isEditMode
                    ? "Update"
                    : "Add Wholesaler"}
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default WholesalerFormModal;

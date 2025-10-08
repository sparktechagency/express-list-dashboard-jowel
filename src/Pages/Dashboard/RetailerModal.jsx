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
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
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
  const [imageChanged, setImageChanged] = useState(false);

  const [createRetailer, { isLoading }] = useCreateRetailerMutation();
  const [updateRetailer, { isLoading: updating }] = useUpdateRetailerMutation();

  const isEditMode = !!retailer?._id;

  const businessCategories = [
   
    "Education",
    "Communication",
     "Technology",
       "HouseholdItem",
       "OfficeEquipment",
       "BuildingAndConstruction",
        "HealthcareAndFitness",
         "FoodAndProvision",
          "ElectricalAndElectronics",
    "FashionAndBeauty",
    "AutomotivesAndBikes",
     "Other",
   
   
    
    
  ];

  // Helper function to get image URL
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return `${"http://75.119.138.163:5006" || ""}${url}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        form.setFieldsValue({
          name: retailer.name,
          storeName: retailer.storeName,
          email: retailer.email,
          phone: retailer.phone,
          role: "Retailer",
          businessName: retailer.storeInformation?.businessName || "",
          businessCategory: retailer.storeInformation?.businessCategory || "",
          location: retailer.storeInformation?.location || "",
        });

        if (retailer.image) {
          setImageUrl(retailer.image);
          setFileList([]);
        } else {
          setImageUrl("");
          setFileList([]);
        }
        setImageChanged(false);
      } else {
        form.resetFields();
        form.setFieldsValue({
          role: "Retailer",
          businessName: "",
          businessCategory: "",
          location: "",
        });
        setImageUrl("");
        setFileList([]);
        setImageChanged(false);
      }
    }
  }, [isOpen, retailer, form, isEditMode]);

 
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append storeInformation fields with dot notation
      const storeInformation = {
        businessName: values.businessName,
        businessCategory: values.businessCategory,
        location: values.location,
      };

      // Remove the storeInformation fields from values
      delete values.businessName;
      delete values.businessCategory;
      delete values.location;

      // Add storeInformation as JSON
      formData.append("storeInformation", JSON.stringify(storeInformation));

      // For create mode, add confirmPassword
      if (!isEditMode && values.confirmPassword) {
        formData.append("confirmPassword", values.confirmPassword);
      }

      // Append remaining form values to FormData
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && key !== "confirmPassword") {
          formData.append(key, values[key]);
        }
      });

      // Append image file if new image was selected
      if (imageChanged && fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      let response;

      if (isEditMode) {
        response = await updateRetailer({
          id: retailer._id,
          data: formData,
        });

        if (response.error) {
          throw new Error(response.error.data?.message || "Update failed");
        }

        message.success("Retailer updated successfully");
      } else {
        response = await createRetailer(formData);

        console.log("Response:", response);

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
    setImageChanged(true);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setImageUrl("");
    }
  };

  const handleRemoveImage = () => {
    setFileList([]);
    setImageUrl("");
    setImageChanged(true);
  };

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
        {/* Image Upload Section - Top */}
        <Row justify="center" style={{ marginBottom: 32 }}>
          <Col>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  marginBottom: 16,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Upload Image
              </div>
              {imageUrl ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={getImageUrl(imageUrl)}
                    alt="Retailer"
                    style={{
                      width: 180,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "2px solid #e8e8e8",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Button
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveImage}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                  {/* Change Image Button */}
                  <Upload
                    fileList={[]}
                    onChange={handleImageChange}
                    beforeUpload={() => false}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      style={{
                        position: "absolute",
                        bottom: 8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 12,
                      }}
                      size="small"
                    >
                      Change
                    </Button>
                  </Upload>
                </div>
              ) : (
                <Upload
                  listType="picture-card"
                  fileList={[]}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  showUploadList={false}
                  style={{
                    width: 180,
                    height: 180,
                  }}
                >
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <UploadOutlined style={{ fontSize: 32, color: "#999" }} />
                    <div style={{ marginTop: 12, color: "#999" }}>
                      Click to Upload
                    </div>
                  </div>
                </Upload>
              )}
            </div>
          </Col>
        </Row>

        {/* Form Fields - Bottom */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input
                placeholder="Enter Company name"
                style={{ padding: "10px 12px" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Company Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter email"
                style={{ padding: "10px 12px" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <PhoneInput
                country={"us"}
                inputStyle={{
                  width: "100%",
                  height: "42px",
                  fontSize: "14px",
                }}
                containerStyle={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Role is required" }]}
            >
              {isEditMode ? (
                <Input
                  placeholder="Enter Role"
                  style={{ padding: "10px 12px" }}
                />
              ) : (
                <Input
                  value="Retailer"
                  readOnly
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "10px 12px",
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Store Information Section */}
        <div
          style={{
            marginTop: 24,
            marginBottom: 16,
            paddingBottom: 8,
            borderBottom: "2px solid #e8e8e8",
          }}
        >
          <h3 style={{ margin: 0, color: "#262626" }}>Store Information</h3>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="businessName"
              label="Business Name"
              rules={[
                { required: true, message: "Please enter business name" },
              ]}
            >
              <Input
                placeholder="Enter Business Name"
                style={{ padding: "10px 12px" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="businessCategory"
              label="Business Category"
              rules={[
                { required: true, message: "Please select business category" },
              ]}
            >
              <Select
                placeholder="Select Business Category"
                style={{ height: "42px" }}
              >
                {businessCategories.map((category) => (
                  <Select.Option key={category} value={category}>
                    {category}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input
            placeholder="Enter Location"
            style={{ padding: "10px 12px" }}
          />
        </Form.Item>

        {/* Password fields - Only for new retailer */}
        {!isEditMode && (
          <>
            <div
              style={{
                marginTop: 24,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "2px solid #e8e8e8",
              }}
            >
              <h3 style={{ margin: 0, color: "#262626" }}>
                Security Information
              </h3>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter password" },
                    {
                      min: 4,
                      max: 4,
                      message: "Password must be exactly 4 characters",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter Password"
                    style={{ padding: "10px 12px" }}
                  />
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
                  <Input.Password
                    placeholder="Confirm Password"
                    style={{ padding: "10px 12px" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Action Buttons */}
        <Row justify="end" style={{ marginTop: 32 }}>
          <Space size="middle">
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading || updating}
              style={{
                backgroundColor: "#3FC7EE",
                borderColor: "#3FC7EE",
                minWidth: 120,
              }}
            >
              {isEditMode ? "Update" : "Add Retailer"}
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default RetailerFormModal;

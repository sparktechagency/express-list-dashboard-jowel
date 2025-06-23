import React, { useEffect, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import {
  useGetLoginuserQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authSlice";
import { imageUrl } from "../../../redux/api/baseApi";
import Loading from "../../../components/common/Loading";

// import { imageUrl } from "../../../redux/api/baseApi";

const UserProfile = () => {
  const [form] = Form.useForm();
  const { data: user,  } = useGetLoginuserQuery();
  const [updateProfile, {isLoading}] = useUpdateProfileMutation();

  // Image state
  const [image, setImage] = useState(null);
  const [imgURL, setImgURL] = useState();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.data?.name,
        email: user?.data?.email,
        phone: user?.data?.phone,
        role: user?.data?.role,
      });

      setImgURL(
        user?.data?.profile?.startsWith("https")
          ? user?.data?.profile
          : `${imageUrl}${user?.data?.profile}`
      );
    }
  }, [user, setImgURL, form]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }

      formData.append("name", values?.name);
      formData.append("email", values?.email);
      // formData.append("location", values?.location);
      formData.append("phone", values?.phone);

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("An error occurred while updating");
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImgURL(imgUrl);
      setImage(file);
    }
  };

  if (isLoading) <Loading />;

  return (
    <div className=" lg:grid lg:grid-rows-2">
      {/* image   */}
      <div className="col-row-1">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            onChange={onChange}
            type="file"
            name=""
            id="img"
            style={{ display: "none" }}
          />
          <label
            className="relative"
            htmlFor="img"
            style={{
              width: "195px",
              cursor: "pointer",
              height: "195px",
              borderRadius: "100%",
              border: "1px solid #1D75F2",
              background: "white",
              backgroundImage: `url(${imgURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute -right-1 bottom-1 "
              style={{
                background: "#E8F6FE",
                width: "50px",
                height: "50px",
                border: "2px solid  #1D75F2",
                borderRadius: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdOutlineAddPhotoAlternate size={22} color="#1D75F2" />
            </div>
          </label>
        </div>
      </div>

      {/* forms  */}
      <div className="lg:col-rows-1  flex justify-center items-center  ">
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          style={{ width: "80%" }}
          onFinish={handleSubmit}
          form={form}
        >
          <div className=" grid lg:grid-cols-2 grid-cols-1 lg:gap-x-16 w-full gap-y-7 ">
            <div>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="name"
                label={<p style={{ display: "block" }}>Full Name</p>}
              >
                <Input
                  placeholder="Enter Your Full Name"
                  type="text"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="email"
                style={{ marginBottom: 0 }}
                label={
                  <p style={{ display: "block" }} htmlFor="">
                    Email
                  </p>
                }
              >
                <Input
                  type="text"
                  placeholder="Enter Email"
                  disabled
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                    cursor: "not-allowed",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="phone"
                label={
                  <p style={{}} htmlFor="email">
                    contact
                  </p>
                }
              >
                <Input
                  type="text"
                  placeholder="Enter Phone Number"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="role"
                style={{ marginBottom: 0 }}
                label={
                  <p style={{ display: "block" }} htmlFor="">
                    Role
                  </p>
                }
              >
                <Input
                  disabled
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="text-end mt-6">
            <Form.Item>
              <Button
                htmlType="submit"
                block
                style={{
                  border: "none",
                  height: "41px",
                  background: "#3FC7EE",
                  color: "white",
                  borderRadius: "8px",
                  outline: "none",
                  width: "150px",
                }}
              >
                {isLoading ? " Update ..." : "Update"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;

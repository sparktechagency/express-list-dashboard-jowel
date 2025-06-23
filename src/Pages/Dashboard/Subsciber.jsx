import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  Row,
  Col,
  Popconfirm,
  message,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import UpdateModal from "../../components/common/UpdateModal";
import { useGetAllSubscriberQuery } from "../../redux/apiSlices/subscriberApi";
import moment from "moment";
import Loading from "../../components/common/Loading";

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
  });
  const [searchType, setSearchType] = useState("name");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
  });

  // RTK Query hooks
  const { data, isLoading,  } = useGetAllSubscriberQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    ...searchParams,
  });

  const subscribers = data?.data?.userDataWithSubscription || [];
  const total = data?.pagination?.total || subscribers.length;

  const handleSearch = (value) => {
    // Reset other search params and set only the selected type
    const newSearchParams = {
      name: "",
      email: "",
    };
    newSearchParams[searchType] = value;

    setSearchParams(newSearchParams);
    setPagination({
      ...pagination,
      current: 1, // Reset to first page on new search
    });
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    // Clear search params when changing search type
    setSearchParams({
      name: "",
      email: "",
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = (updatedUserData) => {
    // Assuming the modal handles RTK Query invalidation
    message.success("Subscriber updated successfully");
    setIsUpdateModalOpen(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Assuming you have a delete mutation or function here
          // await deleteSubscriber(id);
          Swal.fire("Deleted!", "Subscriber has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete subscriber.", "error");
        }
      }
    });
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Subscriber Name",
      dataIndex: "name",
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.image}
            icon={!record.image && <UserOutlined />}
            size={40}
          >
            {!record.image && record?.name?.[0]?.toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Price",
      dataIndex: ["subscriptionDetails", "amount"],
    },
    {
      title: "TransactionId",
      dataIndex: ["subscriptionDetails", "transactionId"],
    },
    {
      title: "StartDate",
      dataIndex: ["subscriptionDetails", "startTime"],
      render: (text) => <p>{moment(text).format("L")}</p>,
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         onClick={() => handleEdit(record)}
    //         style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
    //       />
    //       <Popconfirm
    //         title="Delete this subscriber?"
    //         description="Are you sure you want to delete this subscriber? This action cannot be undone."
    //         onConfirm={() => handleDelete(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //         icon={<QuestionCircleOutlined style={{ color: "red" }} />}
    //       >
    //         <Button type="primary" danger icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={4}>Subscribers Management</Title>
        </Col>
        <Col>
          <Space>
            <Select
              defaultValue="name"
              style={{ width: 140 , height: 40 }}
              onChange={handleSearchTypeChange}
              value={searchType}
            >
              <Option value="name">Name</Option>
              <Option value="email">Email</Option>
            </Select>
            <Input
              placeholder={`Search by ${searchType}...`}
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchParams[searchType]}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250, height:40 }}
              allowClear
            />
          </Space>
        </Col>
      </Row>

      {isLoading && <div><Loading /> </div>}

      <Table
        columns={columns}
        dataSource={subscribers}
        rowKey="_id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
        }}
        loading={isLoading}
        onChange={handleTableChange}
        size="small"
      />

      {/* Update Modal */}
      {isUpdateModalOpen && selectedUser && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleUpdate}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default Users;

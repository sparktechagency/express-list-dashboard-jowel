import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  Row,
  Col,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Swal from "sweetalert2";
import {
  useDeleteWholesalerMutation,
  useGetWholesalersQuery,
} from "../../redux/apiSlices/wholesalerApi";
import { getImageUrl } from "../../components/common/imageUrl";
import WholesalerFormModal from "./WholesealerModal";
import Loading from "../../components/common/Loading";

const { Title } = Typography;
const { Option } = Select;

const WholesaleTable = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
  });
  const [searchType, setSearchType] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWholesale, setEditingWholesale] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
  });

  // RTK Query hooks
  const { data, isLoading } = useGetWholesalersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    ...searchParams,
  });

  const [deleteWholesaler] = useDeleteWholesalerMutation();
  const wholesaleData = data?.data || [];
  const total = data?.pagination?.total || 0;

  const handleSearch = (value) => {
    // Reset other search params and set only the selected type
    const newSearchParams = {
      name: "",
      email: "",
      businessName: "",
      phone: "",
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
      businessName: "",
      phone: "",
    });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleEdit = (record) => {
    setEditingWholesale(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingWholesale(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this wholesale!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3FC7EE",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteWholesaler(id);
          Swal.fire({
            title: "Deleted!",
            text: "The wholesale has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the wholesale.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingWholesale(null);
  };

  const columns = [
    {
      title: "#",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 50,
      align: "center",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <Avatar
          src={getImageUrl(image)}
          icon={!image && <UserOutlined />}
          size={40}
        >
          {!image && record?.name?.[0]?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Wholesale Name",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Business Name",
      dataIndex: ["storeInformation", "businessName"],
    },
    {
      title: "Status",
      dataIndex: "role",
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
      title: "Address",
      dataIndex: ["storeInformation", "location"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) <Loading />;
  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={4}>Wholesales Management</Title>
        </Col>
        <Col>
          <Space>
            <Select
              defaultValue="name"
              style={{ width: 140 }}
              onChange={handleSearchTypeChange}
              value={searchType}
              className="h-10"
            >
              <Option value="name">Name</Option>
              <Option value="email">Email</Option>
              <Option value="businessName">Business Name</Option>
              <Option value="phone">Phone</Option>
            </Select>
            <Input
              placeholder={`Search by ${searchType}...`}
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchParams[searchType]}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250, height: "40px" }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: "#3FC7EE", borderColor: "#3FC7EE" }}
              className="h-10"
            >
              Add Wholesale
            </Button>
          </Space>
        </Col>
      </Row>

      {isLoading && (
        <div>
          <Loading />{" "}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={wholesaleData}
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

      <WholesalerFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        wholesaler={editingWholesale || null}
      />
    </div>
  );
};

export default WholesaleTable;

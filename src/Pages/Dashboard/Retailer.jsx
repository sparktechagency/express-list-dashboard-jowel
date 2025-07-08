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
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  useDeleteRetailerMutation,
  useGetRetailersQuery,
} from "../../redux/apiSlices/retailerApi";
import RetailerFormModal from "./RetailerModal";
import { getImageUrl } from "../../components/common/imageUrl";
import Swal from "sweetalert2";
import Loading from "../../components/common/Loading";

const { Title } = Typography;
const { Option } = Select;

const RetailerTable = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
  });
  const [searchType, setSearchType] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
  });

  // RTK Query hooks
  const { data, isLoading } = useGetRetailersQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    ...searchParams,
  });
console.log(data)
  const [deleteRetailer] = useDeleteRetailerMutation();
  const retailersData = data?.data || [];
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
    setEditingRetailer(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRetailer(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this retailer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3FC7EE",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRetailer(id);
          Swal.fire({
            title: "Deleted!",
            text: "The retailer has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the retailer.", "error");
        }
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRetailer(null);
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
      title: "Retailer Name",
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


  // if(isLoading) <Loading />

  return (
    <div className="p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={4}>Retailers Management</Title>
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
              <Option value="businessName">Business Name</Option>
              <Option value="phone">Phone</Option>
            </Select>
            <Input
              placeholder={`Search by ${searchType}...`}
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchParams[searchType]}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 , height: 40}}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{ backgroundColor: "#3FC7EE", borderColor: "#3FC7EE", height:40 }}
            >
              Add Retailer
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
        dataSource={retailersData}
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

      <RetailerFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        retailer={editingRetailer || null}
      />
    </div>
  );
};

export default RetailerTable;

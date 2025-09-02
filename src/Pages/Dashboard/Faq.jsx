import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Input,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  message,
  Card,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import Loading from '../../components/common/Loading';
import { useCreateFaqMutation, useDeleteFaqMutation, useGetFaqQuery, useUpdateFaqMutation } from '../../redux/apiSlices/faqApi';

const { Title } = Typography;
const { TextArea } = Input;

const Faq = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [errors, setErrors] = useState({});

  // API hooks
  const { data: faqResponse, isLoading, refetch } = useGetFaqQuery();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const faqData = faqResponse?.data || [];

  useEffect(() => {
    if (faqData) {
      const filtered = faqData.filter(
        (item) =>
          item.question?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.answer?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [faqData, searchText]);

  const handleAddNew = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingFaq(record);
    setFormData({
      question: record.question,
      answer: record.answer,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3FC7EE',
        cancelButtonColor: '#ff4d4f',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await deleteFaq(id).unwrap();
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your FAQ has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete FAQ',
        icon: 'error',
        confirmButtonColor: '#3FC7EE',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question || formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    }
    if (!formData.answer || formData.answer.length < 20) {
      newErrors.answer = 'Answer must be at least 20 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          data: formData,
        }).unwrap();
        
        Swal.fire({
          title: 'Success!',
          text: 'FAQ updated successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createFaq(formData).unwrap();
        
        Swal.fire({
          title: 'Success!',
          text: 'FAQ created successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
      setFormData({ question: '', answer: '' });
      refetch();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: editingFaq ? 'Failed to update FAQ' : 'Failed to create FAQ',
        icon: 'error',
        confirmButtonColor: '#3FC7EE',
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setErrors({});
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '2rem' }}>
          <Col>
            <Space align="center" size="large">
              <div style={{ 
                padding: '12px', 
                borderRadius: '16px', 
                background: 'linear-gradient(90deg, #0090B9 0%, #3FC7EE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QuestionCircleOutlined style={{ fontSize: '32px', color: 'white' }} />
              </div>
              <div>
                <Title level={1} style={{ 
                  margin: 0, 
                  background: 'linear-gradient(90deg, #0090B9 0%, #3FC7EE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  FAQ Management
                </Title>
                <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage your frequently asked questions</p>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{
                background: 'linear-gradient(90deg, #0090B9 0%, #3FC7EE 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontWeight: '600'
              }}
            >
              Add New FAQ
            </Button>
          </Col>
        </Row>

        {/* Search */}
        <Row style={{ marginBottom: '2rem' }}>
          <Col span={8}>
            <Input
              placeholder="Search FAQs..."
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="large"
              style={{
                borderRadius: '8px',
                border: '1px solid #d9d9d9'
              }}
            />
          </Col>
        </Row>

        {/* FAQ List */}
        <Card
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {filteredData.length > 0 ? (
            <Collapse
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{
                background: 'transparent',
                border: 'none'
              }}
              items={filteredData.map((faq, index) => ({
                key: faq._id,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(90deg, #0090B9 0%, #3FC7EE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#3FC7EE',
                        fontSize: '16px'
                      }}>
                        {faq.question}
                      </span>
                    </div>
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(faq);
                        }}
                        style={{ color: '#3FC7EE' }}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(faq._id);
                        }}
                        style={{ color: '#ff4d4f' }}
                      />
                    </Space>
                  </div>
                ),
                children: (
                  <div style={{
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    marginLeft: '44px'
                  }}>
                    <p style={{ 
                      color: '#666',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {faq.answer}
                    </p>
                  </div>
                )
              }))}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <QuestionCircleOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Title level={3} style={{ color: '#999', marginBottom: '8px' }}>No FAQs found</Title>
              <p style={{ color: '#999' }}>Click "Add New FAQ" to create your first FAQ.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined style={{ color: '#3FC7EE' }} />
            <span>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isCreating || isUpdating}
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(90deg, #0090B9 0%, #3FC7EE 100%)',
              border: 'none'
            }}
          >
            {editingFaq ? 'Update FAQ' : 'Add FAQ'}
          </Button>
        ]}
        width={600}
        style={{ top: 20 }}
      >
        <Form layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item
            label="Question"
            validateStatus={errors.question ? 'error' : ''}
            help={errors.question}
            required
          >
            <Input
              placeholder="Enter your question here..."
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Answer"
            validateStatus={errors.answer ? 'error' : ''}
            help={errors.answer}
            required
          >
            <TextArea
              rows={6}
              placeholder="Enter your answer here..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Faq;
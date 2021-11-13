import React from 'react';
import {  Modal, Form, Input} from 'antd';

const MapEdit = ({ visible, onCreate, onCancel,selectedData }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      key={selectedData.id}
      visible={visible}
      title="Edit the Place Details"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        key={selectedData.id}
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          name: selectedData.name,
          image_url: selectedData.image_url,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the place name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image_url"
          label="Image URL"
          rules={[
            {
              required: true,
              message: 'Please input the image url!',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default MapEdit

import React, { useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";

function UpdateIncome({
  handleUpdateModal,
  onUpdate,
  isUpdate,
  updateTranction,
}) {
  // Convert the date string to a Date object
  const dateObject = dayjs(new Date(updateTranction.date));

  // Create a new object with the updated date field as a Date object
  const newObj = { ...updateTranction, date: dateObject };
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(newObj);
  }, [updateTranction]);

  return (
    <div>
      <Modal
        open={isUpdate}
        title="Update Transactions"
        onCancel={handleUpdateModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => {
            console.warn(values); // This will log the form values
            onUpdate(values, updateTranction.type,updateTranction.id);
            form.resetFields();
          }}
          style={{ maxWidth: 600 }}
          initialValues={newObj} // Set the initialValues object
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter a name",
              },
            ]}
          >
            <Input className="custom-input" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                type: "number",
                required: true,
                message: "Please enter an Amount",
              },
            ]}
          >
            <InputNumber className="custom-input" />
          </Form.Item>
          <Form.Item
            label="DatePicker"
            name="date"
            rules={[
              {
                required: true,
                message: "Please enter a Date",
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" className="custom-input" />
          </Form.Item>
          {updateTranction.type === "Income" ? (
            <Form.Item
              name="tag"
              label="Tag"
              rules={[{ required: true, message: "Please select Tag!" }]}
            >
              <Select placeholder="Select your Tag" className="custom-input">
                <Select.Option value="Salary">Salary</Select.Option>
                <Select.Option value="Freelance">Freelance</Select.Option>
                <Select.Option value="Investment">Investment</Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              name="tag"
              label="Tag"
              rules={[{ required: true, message: "Please select Tag!" }]}
            >
              <Select placeholder="select your Tag" className="custom-input">
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="Movie">Movie</Select.Option>
                <Select.Option value="Study">Study</Select.Option>
                <Select.Option value="Transportation">
                  Transportation
                </Select.Option>
                <Select.Option value="Shopping">Shopping</Select.Option>
                <Select.Option value="Rent">Rent</Select.Option>
                <Select.Option value="Utilities">Utilities</Select.Option>
                <Select.Option value="Entertainment">
                  Entertainment
                </Select.Option>
              </Select>
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit">
            Update Transaction
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default UpdateIncome;

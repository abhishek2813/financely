import React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
function UpdateIncome({ handleIncomeModal, onFinish,isUpdate,UpdateData}) {
  const [form] = Form.useForm();
  return (
    <div>
        <div className="income-modal-update">
        <Modal
        open={isUpdate}
        title="Add Income Update"
        onCancel={handleIncomeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(value) => {
            onFinish(value, "Income");
            form.resetFields();
          }}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name={"name"}
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
            name={"amount"}
            rules={[
              {
                type: "number",
                required: true,
                message: "Please enter a Amount",
              },
            ]}
          >
            <InputNumber className="custom-input" />
          </Form.Item>
          <Form.Item label="DatePicker" name={"date"} rules={[
              {
                required: true,
                message: "Please enter Date",
              },
            ]}>
            <DatePicker format="YYYY-MM-DD" className="custom-input" />
          </Form.Item>
          <Form.Item
            name="tag"
            label="Tag"
            rules={[{ required: true, message: "Please select Tag!" }]}
          >
            <Select placeholder="select your Tag" className="custom-input">
              <Select.Option value="Salary">Salary</Select.Option>
              <Select.Option value="Freelance">Freelance</Select.Option>
              <Select.Option value="Investment">Investment</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form>
      </Modal>
        </div>
        <div className="expense-modal-update"></div>
          </div>
  );
}

export default UpdateIncome;

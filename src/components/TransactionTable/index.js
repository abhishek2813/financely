import { Button, Col, Input, Radio, Row, Select, Table, Space } from "antd";
import React, { useState } from "react";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

function TransactionTable({
  transactions,
  addTransaction,
  fetchTransactions,
  deleteTransaction,
  setUpdateTranction,
  showUpdateModal,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (text, record) => (
        <Space wrap>
          <Button
            type="primary"
            onClick={() => {
              setUpdateTranction(record);
              showUpdateModal();
            }}
          >
            Edit
          </Button>{" "}
          <br />
          <Button
            type="primary"
            danger
            onClick={() => deleteTransaction(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const filterArr = transactions.filter(
    (value) =>
      value.name.toLowerCase().includes(search.toLowerCase()) &&
      value.type.includes(typeFilter)
  );
  const sortFilterArr = filterArr.sort((a, b) => {
    if (sortKey === "amount") {
      return a.amount - b.amount;
    } else if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return 0;
    }
  });
  //Export method
  const exportCSV = () => {
    // Specifying fields and data explicitly
    var csvFile = unparse({
      fields: ["name", "type", "tag", "amount", "date"],
      data: transactions,
    });
    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const importFromCSV = (event) => {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            // console.log(transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("Import from Csv successfully");
      fetchTransactions();
      event.target.files = null;
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <div>
        <Row>
          <Col span={22}>
            <Input
              name="serach"
              placeholder="Search by Name"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col span={2}>
            <Select
              value={typeFilter}
              placeholder="Type"
              allowClear
              onChange={(value) => setTypeFilter(value)}
            >
              <Select.Option value="">All</Select.Option>
              <Select.Option value="Income">Income</Select.Option>
              <Select.Option value="Expense">Expense</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <h1>All Transactions</h1>
          </Col>
          <Col span={12}>
            <Radio.Group
              onChange={(e) => setSortKey(e.target.value)}
              value={sortKey}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="">No Sort</Radio.Button>
              <Radio.Button value="amount">Sort by Amount</Radio.Button>
              <Radio.Button value="date">Sort by Date</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={6}>
            <Row>
              <Col>
                <label for="input-id" className="btn btn-blue">
                  Import CSV
                </label>
                <input
                  accept=".csv"
                  onChange={(e) => importFromCSV(e)}
                  type="file"
                  style={{ display: "none" }}
                  id="input-id"
                />
              </Col>
              <Col>
                <Button onClick={exportCSV}>Export to CSV</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Table dataSource={sortFilterArr} columns={columns} />;
    </div>
  );
}

export default TransactionTable;

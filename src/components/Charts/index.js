import { Card, Col, Divider, Row, Typography } from "antd";
import React from "react";
import Chart from "chart.js/auto";
import { Line, Pie } from "react-chartjs-2";

function Charts({ sortTransactionArr }) {
  const charData = sortTransactionArr.map((item) => {
    return { date: item.date, amount: item.amount };
  });
  let finalSpendingArr = sortTransactionArr.reduce((acc, obj) => {
    if (obj.type === "Expense") {
      let tag = obj.tag;
      if (!acc[tag]) {
        acc[tag] = { tag: tag, amount: obj.amount };
      } else {
        acc[tag].amount += obj.amount;
      }
    }
    return acc;
  }, {});

  const LineLabels = charData.map((item) => item.date);
  const lineData = {
    labels: LineLabels,
    datasets: [
      {
        label: "Amount",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: charData.map((item) => item.amount),
        borderCapStyle: "round",
        pointBackgroundColor: "rgba(255, 0, 0, 0.2)",
        pointOpacity: 0.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        responsive: true,
      },
    ],
  };
  // const options = {
  //   maintainAspectRatio: false,
  // };
  const pieLabels = Object.keys(finalSpendingArr);
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: "Expense",
        data: pieLabels.map((label) => finalSpendingArr[label].amount),
        borderWidth: 1,
        responsive: true,
      },
    ],
  };
  return (
    <div className="">
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
        }}
        justify={"center"}
      >
        <Col xs={22} sm={22} md={16} lg={15} xl={15}>
          <Card
            bordered={false}
            hoverable
            style={{ marginTop: 16, marginBottom: 10 }}
          >
            <Card.Meta
              title="Income Line Chart"
              style={{ textAlign: "center", marginTop: 2 }}
            />
            <div>
              <Line data={lineData} />
            </div>
          </Card>
        </Col>
        <Col xs={22} sm={22} md={6} lg={8} xl={8}>
          <Card bordered={false} hoverable style={{ marginTop: 16 }}>
            <Card.Meta
              title="Expense Pie Chart"
              style={{ textAlign: "center", marginTop: 2 }}
            />
            {pieData.labels.length !== 0 ? (
              <Pie data={pieData} />
            ) : (
              <Typography.Title level={3} style={{ textAlign: "center" }}>
                There is No Expense
              </Typography.Title>
            )}
          </Card>
        </Col>
      </Row>
      <Divider dashed />
    </div>
  );
}

export default Charts;

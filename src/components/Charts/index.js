import { Col, Row } from "antd";
import React from "react";
import Chart from "chart.js/auto";
import { Line,Pie } from "react-chartjs-2";

function Charts({ sortTransactionArr }) {
  const charData = sortTransactionArr.map((item) => {
    return { date: item.date, amount: item.amount };
  });
  let finalSpendingArr = sortTransactionArr.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount }; //create a new object with same tag
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

const LineLabels = charData.map((item)=>item.date)
const lineData = { 
  labels: LineLabels,
  datasets: [
    {
      label: "Amount",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: charData.map((item)=>item.amount),
    },
  ],
  
};

const pieLabels = Object.keys(finalSpendingArr)
const pieData = {
  labels: pieLabels,
  datasets: [
    {
      label: "Expense",
      data: pieLabels.map(label => finalSpendingArr[label].amount),
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
      >
        <Col span={16} offset={1}>
          <div>
          <Line data={lineData} />
          </div>
        </Col>
        <Col span={7}>
          <div>
            <Pie data={pieData} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Charts;

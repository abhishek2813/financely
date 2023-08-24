import { Col, Row } from "antd";
import React from "react";
import Chart from "chart.js/auto";
import { Line,Pie } from "react-chartjs-2";

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
console.log(finalSpendingArr);
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

import { Line, Pie } from "@ant-design/charts";
import { Col, Row } from "antd";
import React from "react";

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

  const config = {
    data: charData,
    xField: "date",
    yField: "amount",
  };
  const pieConfig = {
    appendPadding: 10,
    data: Object.values(finalSpendingArr),
    angleField: "amount",
    colorField: "tag",
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
  };

  let chart;
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
            <Line
              {...config}
              onReady={(chartInstance) => (chart = chartInstance)}
            />
          </div>
        </Col>
        <Col span={7}>
          <div>
            <Pie {...pieConfig} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Charts;

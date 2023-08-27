import React from "react";
import transactions from "../../assets/transactions.svg";
import { Col, Empty, Row } from "antd";
function NOtransactions() {
  return (
      <Row justify="center" align="bottom" >
        <Col>
          <Empty
            image={transactions}
            imageStyle={{
              height: "250px",
              width:"300px"
            }}
            description={false}
          >
            <h3>You Have No Transactions Currently</h3>
          </Empty>
        </Col>
      </Row>
  );
}

export default NOtransactions;

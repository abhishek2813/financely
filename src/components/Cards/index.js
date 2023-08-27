import React from "react";
import "./style.css";
import { Row, Card, Col } from "antd";
import ButtonCom from "../Button";
function Cards({
  totalBalance,
  income,
  expense,
  showIncomeModal,
  showExpenseModal,
  handleReset,
}) {
  return (
    <div>
      <Row
        className="card-row"  gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 24,
        }}
        justify="center"
      >
        <Col xs={22} sm={22} md={12} lg={8} xl={8}>
          <Card className="card-item" hoverable style={{ marginTop: 16 }}>
            <h2>Current Balance</h2>
            <p>₹ {totalBalance}</p>
            <ButtonCom text="Reset balance" blue={true} onclick={handleReset} />
          </Card>
        </Col>
        <Col xs={22} sm={22} md={12} lg={8} xl={8}>
          <Card className="card-item" hoverable style={{ marginTop: 16 }}>
            <h2>Income Balance</h2>
            <p>₹ {income}</p>
            <ButtonCom text="Total Income" blue={true} onclick={showIncomeModal} />
          </Card>
        </Col>
        <Col xs={22} sm={22} md={12} lg={7} xl={7}>
          <Card className="card-item" hoverable style={{ marginTop: 16 }}>
            <h2>Expense Balance</h2>
            <p>₹ {expense}</p>
            <ButtonCom
              text="Total Expens"
              blue={true}
              onclick={showExpenseModal}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Cards;

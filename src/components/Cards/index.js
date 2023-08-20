import React from "react";
import "./style.css";
import { Row, Card } from "antd";
import Button from "../Button";
function Cards({
  totalBalance,
  income,
  expense,
  showIncomeModal,
  showExpenseModal,
  handleReset
}) {
  return (
    <div>
      <Row className="card-row">
        <Card className="card-item">
          <h2>Current Balance</h2>
          <p>₹ {totalBalance}</p>
          <Button text="Reset balance" blue={true} onclick={handleReset} />
        </Card>
        <Card className="card-item">
          <h2>Income Balance</h2>
          <p>₹ {income}</p>
          <Button text="Total Income" blue={true} onclick={showIncomeModal} />
        </Card>
        <Card className="card-item">
          <h2>Expense Balance</h2>
          <p>₹ {expense}</p>
          <Button text="Total Expens" blue={true} onclick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;

import React from 'react'
import transactions from "../../assets/transactions.svg"
import { Empty } from 'antd'
function NOtransactions() {
  return (
    <div style={{ display:"flex",
    justifyContent:"center",
    alignItems: "center",
    }}>
        <Empty
    image={transactions}
    imageStyle={{
      width: '400px',
      height: '400px',
    }}
    description={false}
    >
    <h3>You Have No Transactions Currently</h3>
    </Empty>
    </div>
  )
}

export default NOtransactions
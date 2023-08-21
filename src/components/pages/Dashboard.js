import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Cards from "../Cards";
import AddIncome from "../Modals/addIncome";
import AddExpense from "../Modals/addExpense";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../TransactionTable";
import Charts from "../Charts";
import NOtransactions from "../Notransactions";

function Dashboard() {
  const [isExpenseModalVisiable, setIsExpenseModalVisiable] = useState(false);
  const [isIncomeModalVisiable, setIsIncomeModalVisiable] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [user] = useAuthState(auth);
  //Modals functions
  const showExpenseModal = () => setIsExpenseModalVisiable(true); // set isExpenseMod visible
  const showIncomeModal = () => setIsIncomeModalVisiable(true); // set isIncomeModal visible
  const handleExpenseModal = () => setIsExpenseModalVisiable(false); // set isExpenseMod visible false
  const handleIncomeModal = () => setIsIncomeModalVisiable(false); // set isIncomeMod visible false

  // check variables with console messages
  // console.log(user.uid);
  // console.log(transactions)

  //Handle the submit of modal
  const onFinish = (value, type) => {
    const newTransaction = {
      type,
      tag: value.tag,
      name: value.name,
      amount: parseFloat(value.amount),
      date: value.date.format("YYYY-MM-DD"),
    };
    // console.warn(newTransaction);
    //add transaction to firebase function
    addTransaction(newTransaction);
  };
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      console.warn("documents added with transaction id ", docRef.id);
      
      // Create a new array and append the new transaction
      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);
      
      if (!many) toast.success("Transactions added successfully");
      calcalateBalance();
    } catch (error) {
      if (!many) toast.error("add transaction failed");
    }
  }
  

   useEffect(() => {
    fetchTransactions();
   }, [user]);

  useEffect(() => {
    calcalateBalance();
  }, [transactions]);

  // fetch Transactions from firebase database
  async function fetchTransactions() {
    setisLoading(true);
    if (user) {
      try {
        const queryData = query(
          collection(db, `users/${user.uid}/transactions`)
        );
        const getData = await getDocs(queryData);
        let transactionArray = [];
        getData.forEach((doc) => transactionArray.push(doc.data()));
        setTransactions(transactionArray);
        setisLoading(false);
        toast.success("Transactions loaded successfully");
      } catch (error) {
        toast.error(error);
        setisLoading(false);
      }
    }
  }
  //handle rest balance function
  const handleReset = async()=>{
    toast.warning("Resetting")
    //  try {
    //   await deleteDoc(collection(db, `users/${user.uid}/transactions`));
    //   toast.success("All transactions have been reset")
    //  } catch (error) {
    //   toast.error(error.message)
    //   console.log(error);
    //  }
  }

  function calcalateBalance() {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "Income") {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    setIncome(totalIncome);
    setExpense(totalExpenses);
    setTotalBalance(totalIncome - totalExpenses);
  }
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);
  // console.warn(sortTransactionArr);
  return (
    <div>
      <Header />
      {isLoading ? (
        <>
          <p>Loading .......</p>
        </>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            handleReset={handleReset}
          />
          {transactions && transactions.length !== 0 ? (
            <Charts sortTransactionArr={sortedTransactions} />
          ) : (
            <NOtransactions />
          )}
          <AddIncome
            isIncomeModalVisiable={isIncomeModalVisiable}
            handleIncomeModal={handleIncomeModal}
            onFinish={onFinish}
          />
          <AddExpense
            isExpenseModalVisiable={isExpenseModalVisiable}
            handleExpenseModal={handleExpenseModal}
            onFinish={onFinish}
          />
          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;

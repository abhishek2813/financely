import React, { useEffect, useMemo, useState } from "react";
import Header from "../Header";
import Cards from "../Cards";
import AddIncome from "../Modals/addIncome";
import AddExpense from "../Modals/addExpense";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../TransactionTable";
import Charts from "../Charts";
import NOtransactions from "../Notransactions";
import UpdateIncome from "../Modals/UpdateIncome";

function Dashboard() {
  const [isExpenseModalVisiable, setIsExpenseModalVisiable] = useState(false);
  const [isIncomeModalVisiable, setIsIncomeModalVisiable] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [user, loading] = useAuthState(auth);
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
       await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      // console.warn("documents added with transaction id ", docRef.id);
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
  }, [user, loading]);

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
        getData.forEach((doc) => {
          const transactionData = doc.data(); // Extract the data from the Firestore document
          const transactionObject = {
            id: doc.id, // Add the ID
            ...transactionData, // Spread the rest of the data
          };
          transactionArray.push(transactionObject);
        });
        setTransactions(transactionArray);
        setisLoading(false);
        toast.success("Transactions loaded successfully");
      } catch (error) {
        toast.error(error);
        setisLoading(false);
      }
    }
  }

  // console.log(transactions);

  //handle rest balance function
  const handleReset = async () => {
    try {
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);
      const transactionsSnapshot = await getDocs(transactionsRef);

      // Delete each document in the transactions collection
      const deletePromises = transactionsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      toast.success("All transactions have been reset");
      fetchTransactions();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const deleteTransaction =async(id) =>{
    setisLoading(true)
    try {
    await deleteDoc(doc(db, `users/${user.uid}/transactions/${id}`)); // Remove '/transactions' from the path
    toast.success("Successfully deleted")
    fetchTransactions();
    setisLoading(false)
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setisLoading(false)
    }
  }
  
  const editTransaction = async(tranc)=>{
    toast.warn("edit transaction")
    console.log(tranc);
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
    return [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
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
            isUpdate={false}
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
            deleteTransaction={deleteTransaction}
            editTransaction={editTransaction}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;

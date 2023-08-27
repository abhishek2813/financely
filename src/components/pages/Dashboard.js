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
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../TransactionTable";
import Charts from "../Charts";
import NOtransactions from "../Notransactions";
import UpdateIncome from "../Modals/UpdateIncome";
import { Row, Spin } from "antd";

function Dashboard() {
  const [isExpenseModalVisiable, setIsExpenseModalVisiable] = useState(false);
  const [isIncomeModalVisiable, setIsIncomeModalVisiable] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [updateTranction, setUpdateTranction] = useState({});
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [user, loading] = useAuthState(auth);

  //Modals functions
  const showExpenseModal = () => setIsExpenseModalVisiable(true); // set isExpenseMod visible
  const showIncomeModal = () => setIsIncomeModalVisiable(true); // set isIncomeModal visible
  const showUpdateModal = () => setIsUpdate(true); // set isUpadteModal visible
  const handleExpenseModal = () => setIsExpenseModalVisiable(false); // set isExpenseMod visible false
  const handleIncomeModal = () => setIsIncomeModalVisiable(false); // set isIncomeMod visible false
  const handleUpdateModal = () => setIsUpdate(false); // set isIncomeMod visible false

  // check variables with console messages
  // console.log(user.uid);
  // console.log(transactions)
  // console.log("UPadte tracnction on edit", updateTranction);
  // Reset updateTranction when isUpdate becomes false
  useEffect(() => {
    if (!isUpdate) {
      setUpdateTranction({});
    }
  }, [isUpdate]);
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
    handleIncomeModal();
    handleExpenseModal();
  };
  async function addTransaction(transaction, many) {
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      if (!many) toast.error("add transaction failed");
      setIsLoading(false);
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
    setIsLoading(true);
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
        setIsLoading(false);
        toast.success("Transactions loaded successfully");
      } catch (error) {
        toast.error(error);
        setIsLoading(false);
      }
    }
  }

  // console.log(transactions);

  //handle rest balance function
  const handleReset = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions/${id}`)); // Remove '/transactions' from the path
      toast.success("Successfully deleted");
      fetchTransactions();
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setIsLoading(false);
    }
  };

  const onUpdate = async (value, type, id) => {
    setIsLoading(true);
    try {
      const updateTransaction = {
        type,
        tag: value.tag,
        name: value.name,
        amount: parseFloat(value.amount),
        date: value.date.format("YYYY-MM-DD"),
      };
      const docRef = doc(db, `users/${user.uid}/transactions`, id);
      await updateDoc(docRef, updateTransaction); // This line updates the Firestore document
      toast.success(`Updated transaction`);
      fetchTransactions();
      handleUpdateModal(); // for closing the update modal
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
      setIsLoading(false);
    }
  };

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
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Header />
      {isLoading ? (
        <Row
          justify={"space-around"}
          align={"middle"}
          style={{ minHeight: "100vh" }}
        >
          <Spin tip="Loading..." size="large"></Spin>
        </Row>
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
            deleteTransaction={deleteTransaction}
            setUpdateTranction={setUpdateTranction}
            showUpdateModal={showUpdateModal}
          />
          <UpdateIncome
            isUpdate={isUpdate}
            handleUpdateModal={handleUpdateModal}
            onUpdate={onUpdate}
            updateTranction={updateTranction}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;

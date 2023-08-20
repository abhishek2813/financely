import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import SignIn from "./components/pages/SignIn";
import Dashboard from "./components/pages/Dashboard";
import { ToastContainer } from 'react-toastify';
import "./App.css";
function App() {
  return (
    <>
    <ToastContainer />
     <Router>
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
     </Router>
     </>
  );
}

export default App;

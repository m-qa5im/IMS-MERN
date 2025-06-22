import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import AccountVerificationPage from "./pages/AccountVerificationPage.jsx";
import ForgotPasswordPage from "./pages/ForgetPasswordPage.jsx";

import SidebarLayout from "./layouts/SidebarLayout.jsx";
import HomePage from "./pages/HomePage.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ProductTable from "./components/product/ProductTable.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import Account from './pages/Account.jsx'; 
import ProductPage from "./pages/ProductPage.jsx";





function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-3 me-3"
      />

      <Routes>
       
        <Route path="/" element={<HomePage />} />
        <Route path="/email-verify" element={<AccountVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        
        <Route element={<SidebarLayout />}>
          <Route
            path="/products"
            element={
                <ProductPage />
            }
          />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

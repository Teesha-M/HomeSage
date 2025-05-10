import { BrowserRouter, Routes, Route } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import React from "react";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";
import AdminSignin from "./pages/AdminSignin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./components/UserProfile";
import UserListings from "./components/UserListings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/listing/:listingId" element={<Listing />} />

          <Route path="/signup" element={<AdminSignup />} />
          <Route path="/signin" element={<AdminSignin />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />}/>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users/profile" element={<UserProfile />} />
          <Route path="/admin/users/:id" element={<UserProfile />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="api/user/listings/:id" component={<UserListings />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/update-listing/:listingId"element={<UpdateListing />}/>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

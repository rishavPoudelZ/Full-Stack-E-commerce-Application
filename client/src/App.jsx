import { BrowserRouter, Routes, Route, ScrollRestoration } from "react-router-dom"
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Products from "./components/products";
import HeaderFooter from "./components/headerFooter";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import ProductPage from "./components/ProductPage";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";

function App() {
  let userStatus = false;
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken !== null) {
    userStatus = true;
  }

  history.scrollRestoration = "manual";

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<HeaderFooter userStatus={userStatus}/>}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/products' element={<Products />}></Route>
            <Route path='/products/:productId' element={<ProductPage />}></Route>
            <Route path='/register'
              element={
                <Login userStatus={userStatus}>
                  <Register />
                </Login>
              }>
            </Route>
            <Route path='/user/profile' element={<UserProfile userStatus={userStatus}/>}></Route>
            <Route path='*' element={<NotFound />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

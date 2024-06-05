import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"

function Login({ children, userStatus }){
    console.log(userStatus);
    return (
        userStatus ? <Navigate to='/'/> : children
    )
};

export default Login;
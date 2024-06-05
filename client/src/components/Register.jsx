import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [register, setRegister] = useState(true);
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [registerStatus, setRegisterStatus] = useState(null);
    // Used to check if the there is an error is set to false when an error has occured when trying to log in
    const [loginStatus, setLoginStatus] = useState(true);
    const [loginError, setLoginError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        if (register) {
            try {
                const response = await fetch('http://localhost:5000/register/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                const responseData = await response.json();
                if (!response.ok) {
                    setRegisterStatus(false);
                    setTimeout(() =>{
                        setRegisterStatus(null);
                    },5000)
                    setStatusMessage(responseData.message);
                }
                else {
                    setRegisterStatus(true);
                    setTimeout(() =>{
                        setRegisterStatus(null);
                    },5000) 

                    setStatusMessage(responseData.message);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        else {
            userLogin();
        }
    }

    async function userLogin() {
        try {
            const response = await fetch('http://localhost:5000/login/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const responseData = await response.json();

            if( !response.ok ){
                setLoginStatus(false);

                setTimeout(() =>{
                    setLoginStatus(true);
                }, 5000)
                setLoginError(responseData.message)
            } else {
                const accessToken = responseData.token;
                localStorage.setItem('accessToken', accessToken);
                window.location = '/';
            }


        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col">
                <div className="text-center">
                    {
                        register ? <h1 className="text-5xl font-bold">Register now!</h1> : <h1 className="text-5xl font-bold">Login</h1>
                    }
                    <p className="py-6"></p>
                </div>
                {
                    registerStatus != null ? (
                        registerStatus ? (
                            <div role="alert" className="alert alert-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Resgistration successful ! Please login</span>
                            </div>
                        ) : (
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{statusMessage}</span>
                            </div>
                        )
                    ) : null
                    
                }
                {
                    // nothing is rendered as loginStatus is true and !loginStatus is false so null is returned but when trying to login if there is a error like wrong username password or internal server error then loginStatus is false then this alert is rendered
                    !loginStatus ? (
                        <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{loginError}</span>
                            </div>
                    ) : null
                }
                <div className="card shrink-0 w-96 shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={(e) => { handleLogin(e) }}>
                        <div className="form-control">
                            <label className="input input-bordered flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                <input type="text" className="grow" placeholder="Username" onChange={(e) => {
                                    setUser(prevState => ({
                                        ...prevState,
                                        username: e.target.value
                                    }));
                                }} required />
                            </label>
                        </div>
                        {register ? (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" onChange={(e) => {
                                    setUser(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                    }));
                                }} required />
                            </div>
                        ) : null}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="password" className="input input-bordered" required onChange={(e) => {
                                setUser(prevState => ({
                                    ...prevState,
                                    password: e.target.value
                                }));
                            }} />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="join join-horizontal">
                            <div className="btn join-item mr-1" onClick={() => setRegister(true)}>Register</div>
                            <div className="btn join-item" onClick={() => setRegister(false)}>Login</div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">{ register ? 'Sign Up' : 'Login' }</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
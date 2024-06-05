import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function HeaderFooter({ userStatus }) {
    const [user, setUser] = useState({});
    const [cart, setCart] = useState([]);
    
    async function userDetails() {
        if (userStatus) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:5000/user', {
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                })
                const responseData = await response.json();
                setUser(responseData[0]);
            } catch (error) {
                console.error(error);
            }
        }
    };

    function userLogout() {
        localStorage.removeItem('accessToken');
        window.location = '/';
    }

    async function getCart() {
        if (!localStorage.getItem('accessToken')) {
            return;
        }
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5000/cart', {
                headers: {
                    authorization: `bearer ${accessToken}`
                }
            });
            const responseData = await response.json();
            setCart(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    function returnTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        return total;
    }


    useEffect(() => {
        userDetails();
    }, []);

    useEffect(() => {
        getCart();
    }, []);

    return (
        <>
            <div className="navbar rounded-lg shadow-2xl" style={{ backgroundColor: '#252733'}}>
                <div className="navbar-start">
                    <Link className="btn btn-ghost text-2xl" to='/'>ShopY</Link>
                </div>
                <div className="navbar-center flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='./products'>Products</Link></li>
                        <li><a>Github</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    {
                        userStatus ? (
                            <div className="flex-none justify-end">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                        <div className="indicator">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            <span className="badge badge-sm indicator-item">{cart.length}</span>
                                        </div>
                                    </div>
                                    <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                                        <div className="card-body">
                                            <span className="font-bold text-lg">{cart.length} Items</span>
                                            <span className="text-info">Subtotal: ${returnTotal()} </span>
                                            <div className="card-actions">
                                                <Link to ='/user/profile' state={{ newState: 'cart' }} className="btn btn-primary btn-block" >View cart</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    {
                        userStatus ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                    <span className="ml-3 border-b-2 text-center">Hi, {`${user.username}`}!</span>
                                    <li><Link to='/user/profile'>Dashboard</Link></li>
                                    <li onClick={userLogout}><a>Logout</a></li>
                                </ul>
                            </div>
                        ) : <Link to='/register' className="btn">Login</Link>
                    }
                </div>
            </div>
            <Outlet />
            <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded" style={{ backgroundColor: '#252733'}}>
                <nav className="grid grid-flow-col gap-4">
                    <a className="link link-hover" href="https://linkedin.com/in/poudelrishavz" target="blank">About me</a>
                    <a className="link link-hover" href="https://poudelrishav.com.np" target="blank">Blog site</a>
                </nav>
                <nav>
                    <div className="grid grid-flow-col gap-4">
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
                    </div>
                </nav>
                <aside>
                    <p>Copyright © 2024 - All right reserved </p>
                    <p><a className="link link-hover hover:cursor-text">Email: pdl.rishav88@gmail.com</a></p>
                </aside>
            </footer>
        </>
    )
};

export default HeaderFooter;
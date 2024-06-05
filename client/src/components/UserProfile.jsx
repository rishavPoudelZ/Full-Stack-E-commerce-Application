import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function UserProfile({ userStatus }) {
    if (!userStatus) {
        return (
            <Navigate to='/register'></Navigate>
        )
    }

    const location = useLocation();
    const [user, setUser] = useState({});
    const [profileState, setProfileState] = useState('userInfo');
    const navigate = useNavigate();

    async function userDetails() {
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
    };

    async function becomeSeller() {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:5000/user/user_type', {
                method: 'PUT',
                headers: {
                    authorization: `bearer ${accessToken}`
                }
            })
            userDetails();
        } catch (error) {
            console.log(error);
        }
    }


    function UserInfo() {
        const [userData, setUserData] = useState(user);
        async function updateDetails() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:5000/user/details', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `bearer ${accessToken}`
                    },
                    body: JSON.stringify(userData)
                })
                const responseData = await response.json();
                console.log(responseData);
                setUser(userData);
            } catch (error) {
                console.error(error);
            }
        }
        return (
            <div>
                <div className="flex justify-between p-2">
                    <div className="w-1/2">
                        <label className="font-medium">Username</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.username} readOnly />
                    </div>
                    <div className="w-1/2">
                        <label className="font-medium">Full Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.full_name} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    full_name: e.target.value
                                }))
                        }} />
                    </div>
                </div>
                <div className="flex justify-between p-2">
                    <div className="w-1/2">
                        <label className="font-medium">Email</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.email} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    email: e.target.value
                                }))
                        }} />
                    </div>
                    <div className="w-1/2">
                        <label className="font-medium">Phone</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.phone} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    phone: e.target.value
                                }))
                        }} />
                    </div>
                </div>
                <div className="flex justify-between p-2">
                    <div className="w-1/2">
                        <label className="font-medium">Address</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.address} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    address: e.target.value
                                }))
                        }} />
                    </div>
                    <div className="w-1/2">
                        <label className="font-medium">City</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.city} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    city: e.target.value
                                }))
                        }} />
                    </div>
                </div>
                <div className="flex justify-between p-2">
                    <div className="w-1/2">
                        <label className="font-medium">Zip</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder={user.zip} onChange={e => {
                            setUserData(
                                prevState => ({
                                    ...prevState,
                                    zip: e.target.value
                                }))
                        }} />
                    </div>
                </div>
                <button className="text-white p-2 rounded-lg btn w-[400px] ml-[120px]" onClick={updateDetails}>Update</button>
            </div>
        )
    }

    function Cart() {
        const [cartItems, setCartItems] = useState([]);

        //to get cart items as in from cart table join product table
        async function getCartItems() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/cart`, {
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                });
                const responseData = await response.json();
                setCartItems(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        //to remove item from cart
        async function removeItem(product_id) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/cart/${product_id}`, {
                    method: 'DELETE',
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                });
                const responseData = await response.json();
                console.log(responseData);
                getCartItems();
            } catch (error) {
                console.error(error);
            }
            document.location.reload();
        };

        //grand total of all items in cart
        function getTotal() {
            let total = 0;
            cartItems.forEach(item => {
                total += item.price * item.quantity;
            })
            return total;
        };

        //to buy all item on cart
        async function checkout() {
            if (cartItems.length == 0) {
                alert('Cart is empty');
                return;
            }
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/checkout`, {
                    method: 'POST',
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                });
                console.log(response);
                console.log('redirecting to home page');
                if (response.ok) {
                    alert('Transaction successful');
                    window.location.reload();
                }
                else {
                    alert('Server error, please try again later');
                    window.location.reload();
                }
            } catch (error) {
                console.error(error);
            }

        };


        useEffect(() => {
            getCartItems();
        }, []);

        return (
            <div>
                <h1 className="m-5 text-xl font-medium">Your Cart</h1>
                {cartItems.map(product => (
                    <div className="flex items-center justify-between p-2 m-5 border rounded-md" key={product.product_id}>
                        <div className="flex items-center">
                            <img src={`http://localhost:5000/assets/productImages/${product.file_name}`} alt="Product Image" className="w-18 h-16 object-cover rounded-lg mr-4" />
                            <div>
                                <h3 className="text-lg font-medium">{product.product_name} <span></span></h3>
                                <p className="text-sm line-clamp-2">Quantity: {product.quantity}, Price Per: ${product.price}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-center">Total: ${product.price * product.quantity}</p>
                            <button className="btn btn-error" onClick={() => removeItem(product.product_id)}>Remove</button>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between p-2 m-5">
                    <span className="text-white bg-indigo-600 p-3 rounded-lg shadow-lg ">Grand Total: ${getTotal()}</span>
                    <button className="btn btn-success" onClick={checkout}>Checkout</button>
                </div>
            </div>
        )
    }

    function Orders() {
        const [orders, setOrders] = useState([]);
        const [orderItems, setOrderItems] = useState([]);
        const [orderDetails, setOrderDetails] = useState(true);

        async function getOrders() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/orders`, {
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                });
                const responseData = await response.json();
                setOrders(responseData);
            }
            catch (error) {
                console.error(error);
            }
        };

        async function getOrdersItems(order_id) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/transactions/${order_id}`, {
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                });
                const responseData = await response.json();
                setOrderItems(responseData);
            }
            catch (error) {
                console.error(error);
            }
        };


        useEffect(() => {
            getOrders();
        }, []);

        return (
            <div>
                {orderDetails ? (
                    <div>
                        <h1 className="m-5 text-xl font-medium">Order History</h1>
                        {orders.map((order) => (
                            <div
                                key={order.order_id}
                                className="flex items-center justify-between p-2 m-5 border rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-black transition duration-300 ease-in-out"
                                onClick={() => {
                                    setOrderDetails(false)
                                    getOrdersItems(order.order_id)
                                }}
                            >
                                <div>
                                    <h3 className="text-lg font-medium">Order ID: #{order.order_id}</h3>
                                    <p>Order Status: {order.order_status}</p>
                                </div>
                                <div>
                                    <p>Total Amount: ${order.total_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <button onClick={() => setOrderDetails(true)} className="m-5 mb-1 p-2 btn bg-blue-500 hover:bg-blue-600 border-none text-white">Back to Orders</button>
                        <h1 className="m-5 mt-1 text-xl font-medium">Order Details</h1>
                        {orderItems.map(item => (
                            <div className="flex items-center justify-between p-2 m-5 border rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-black hover:border-black transition duration-300 ease-in-out" key={item.product_id}>
                                <div className="flex items-center" onClick={() => {
                                    navigate(`/products/${item.product_id}`)
                                }}>
                                    <img src={`http://localhost:5000/assets/productImages/${item.file_name}`} alt="Product Image" className="w-18 h-16 object-cover rounded-lg mr-4" />
                                    <div>
                                        <h3 className="text-lg font-medium">{item.product_name} <span></span></h3>
                                        <p className="text-sm line-clamp-2">Quantity: {item.quantity}, Price Per: ${item.price}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-center">Total: ${item.total_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        );
    }

    function Seller() {
        const [product, setProduct] = useState({ productName: '', price: 0, description: '', quantity: 0 });

        async function handleFormSubmit(e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('image', e.target.querySelector('#imageInput').files[0]);

            for (const key in product) {
                formData.append(key, product[key]);
            }

            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch('http://localhost:5000/upload/product', {
                    method: 'POST',
                    headers: {
                        authorization: `bearer ${accessToken}`
                    },
                    body: formData
                });
                const data = await response.json();
                console.log(data);
                // Handle success (e.g., display confirmation message)
                setProfileState('products');
            } catch (error) {
                console.error(error.message);
                // Handle error (e.g., display error message)
            }
        }
        return (
            user.user_type === 'buyer' ?
                <div className="m-6">
                    <h1 className="text-3xl">Become a Seller</h1>
                    <button className="btn btn-active mt-4" onClick={becomeSeller}>Join now</button>
                </div> : user.user_type !== 'seller' ? <div>
                    <h1>Error</h1>
                </div> :
                    <div>
                        <h1 className="mx-5 mt-5 text-lg font-medium">Welcome, {user.username}</h1>
                        <p className="ml-5">Upload a product</p>
                        <div>
                            <form className="m-5" id="uploadForm" encType="multipart/form-data" onSubmit={(e) => handleFormSubmit(e)}>
                                <label className=" mr-2">Upload Product Image: </label> <br />
                                <input className="file-input file-input-bordered file-input-sm w-full max-w-xs" type="file" name="image" id="imageInput" accept="image/*" required />
                                <div>
                                    <label className="font-medium">Product Name</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Enter product name" onChange={e => {
                                        setProduct(
                                            prevState => ({
                                                ...prevState,
                                                productName: e.target.value
                                            }))
                                    }} required />
                                </div>
                                <div>
                                    <label className="font-medium">Price($)</label>
                                    <input type="number" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Enter price" onChange={e => {
                                        setProduct(
                                            prevState => ({
                                                ...prevState,
                                                price: e.target.value
                                            }))
                                    }} required />
                                </div>
                                <div>
                                    <label className="font-medium">Quantity Available</label>
                                    <input type="number" className="w-full border border-gray-300 rounded-lg p-2" placeholder="Enter price" onChange={e => {
                                        setProduct(
                                            prevState => ({
                                                ...prevState,
                                                quantity: e.target.value
                                            }))
                                    }} required />
                                </div>
                                <div>
                                    <label className="font-medium">Description</label>
                                    <textarea className="w-full border border-gray-300 rounded-lg p-2" placeholder="Enter description" onChange={e => {
                                        setProduct(
                                            prevState => ({
                                                ...prevState,
                                                description: e.target.value
                                            }))
                                    }} required />
                                </div>
                                <button className="btn" type="submit">Upload</button>
                            </form>
                        </div>
                    </div>
        )
    }

    function Products() {
        const [products, setProducts] = useState([]);

        async function getUserProducts() {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/products/${user.user_id}`)
                const responseData = await response.json();
                setProducts(responseData);
            } catch (error) {
                console.error(error);
            }
        }

        async function deleteProduct(product_id) {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:5000/products/${product_id}`, {
                    method: 'DELETE',
                    headers: {
                        authorization: `bearer ${accessToken}`
                    }
                })
                const responseData = await response.json();
                console.log(responseData);
                getUserProducts();
            } catch (error) {
                console.error(error);
            }
        }

        useEffect(() => {
            getUserProducts();
        }, [products]);

        return (
            <div>
                <h1 className="m-5 text-xl font-medium">Your Products</h1>
                {products.map(product => (
                    <div className="flex items-center justify-between p-2 m-5 border rounded-md  hover:cursor-pointer hover:bg-gray-100 hover:text-black hover:border-black transition duration-300 ease-in-out" key={product.product_id}
                    >
                        <div className="flex items-center" onClick={() => {
                            navigate(`/products/${product.product_id}`)
                        }}>
                            <img src={`http://localhost:5000/assets/productImages/${product.file_name}`} alt="Product Image" className="w-18 h-16 object-cover rounded-lg mr-4" />
                            <div>
                                <h3 className="text-lg font-medium">{product.product_name}</h3>
                                <p className="text-sm line-clamp-2">{product.description}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-center">${product.price}</p>
                            <button className="btn btn-error" onClick={() => deleteProduct(product.product_id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    useEffect(() => {
        userDetails();
    }, [])

    useEffect(() => {
        if (location.state && location.state.newState) {
            setProfileState(location.state.newState);
        }
    }, []);

    return (
        <>
            <h1 className=" text-center text-[50px] font-semibold">Dashboard</h1>
            <div className="flex justify-center" >
                <div className="min-h-96 w-[943px] mt-5 bg-slate-rounded-xl flex mb-12 rounded-lg shadow-xl" >
                    <div className="basis-[20%] rounded-xl shadow-2xl rounded-r-none" style={{ backgroundColor: '#333f67' }}>
                        <button className="text-center mx-5 mt-2 mb-2 font-medium btn btn-wide bg-indigo-700 text-white hover:bg-indigo-600 border-none" onClick={() => setProfileState('userInfo')}>User Info</button>
                        <button className="text-center mx-5 mb-2 font-medium btn btn-wide bg-indigo-700 text-white hover:bg-indigo-600 border-none" onClick={() => setProfileState('cart')}>Cart</button>
                        <button className="text-center mx-5 mb-2 font-medium btn btn-wide bg-indigo-700 text-white hover:bg-indigo-600 border-none" onClick={() => setProfileState('orders')}>Orders</button>
                        <button className="text-center mx-5 mb-2 font-medium btn btn-wide bg-indigo-700 text-white hover:bg-indigo-600 border-none" onClick={() => setProfileState('seller')}>Seller</button>
                        {user.user_type === 'seller' && <button className="text-center mx-5 mb-2 font-medium btn btn-wide bg-indigo-700 text-white hover:bg-indigo-600 border-none" onClick={() => setProfileState('products')}>Products</button>}
                    </div>
                    <div className="basis-[80%] rounded-xl shadow-2xl rounded-l-none" style={{ backgroundColor: '#424769' }}>
                        {profileState === 'userInfo' && <UserInfo />}
                        {profileState === 'cart' && <Cart />}
                        {profileState === 'orders' && <Orders />}
                        {profileState === 'seller' && <Seller />}
                        {profileState === 'products' && <Products />}
                    </div>
                </div>
            </div>
        </>
    )



};

export default UserProfile;
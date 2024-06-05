import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProductPage() {
    //for the product details that is selected
    const [product, setProduct] = useState({});
    //for the products from the same seller
    const [products, setProducts] = useState([]);
    const { productId } = useParams();
    const [count, setCount] = useState(1);
    const [cart, setCart] = useState([]);

    async function getProductDetails() {
        const response = await fetch(`http://localhost:5000/product/${productId}`);
        const responseData = await response.json();
        setProduct(responseData[0]);
    }

    async function getProducts(seller_id) {
        const response = await fetch(`http://localhost:5000/products/${seller_id}`);
        const responseData = await response.json();
        setProducts(responseData);
    };

    const incrementCount = () => {
        setCount(count + 1);
    };

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    async function getCart() {
        try {
            const response = await fetch(`http://localhost:5000/cart`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const responseData = await response.json();
            setCart(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    async function addToCart(product_id) {
        if (!localStorage.getItem('accessToken')) {
            window.location = '/register';
            return;
        }
        for (const item of cart) {
            if (item.product_id == product_id) {
                const itemPresent = document.querySelector('.item-present');
                if (itemPresent) {
                    itemPresent.classList.remove('hidden');
                    setTimeout(() => {
                        itemPresent.classList.add('hidden');
                    }, 2000);
                }
                return;
            }
        }
        try {
            const response = await fetch(`http://localhost:5000/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: count,
                    total_price: count * product.price,
                })
            });
            const responseData = await response.json();
            console.log(responseData);
            window.location = window.location.pathname;
            document.querySelector('.add-to-cart').textContent = 'Added ✓';
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProductDetails();
        setCount(1);
    }, [productId]);

    useEffect(() => {
        if (product.seller_id !== undefined) {
            getProducts(product.seller_id);
        }
    }, [product]);

    useEffect(() => {
        getCart();
    }, []);

    return (
        <>

            <div className="bg-gray-100 dark:bg-gray-800 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" key={product.product_id}>
                    <div className="flex flex-col md:flex-row -mx-4">
                        <div className="md:flex-1 px-4">
                            <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                                <img className="w-full h-full object-cover" src={`http://localhost:5000/assets/productImages/${product.file_name}`} alt="Product Image" />
                            </div>
                            <div className="flex -mx-2 mb-4">
                                <div className="w-1/2 px-2">
                                    <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => addToCart(product.product_id)}>Add to Cart</button>
                                </div>
                                <div className="w-1/2 px-2">
                                    <button className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"><Link Link to='/user/profile' state={{ newState: 'cart' }}>Checkout</Link></button>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex-1 px-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.product_name}</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">

                            </p>
                            <div className="flex mb-4">
                                <div className="mr-4">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                                    <span className="text-gray-600 dark:text-gray-300">${product.price}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                                    <span className="text-gray-600 dark:text-gray-300">In Stock</span>
                                </div>
                            </div>
                            <div className="flex my-5">
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-l" onClick={decrementCount}> - </button>
                                <span className=" text-gray-600 font-bold py-2 px-4">{count}</span>
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-r" onClick={incrementCount}> + </button>
                            </div>
                            <div className='text-indigo-300 item-present text-xl hidden'>This item is already in cart</div>
                            <div>
                                <span className="font-bold text-gray-700 dark:text-gray-300">Product Description:</span>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className='text-2xl text-blue-400 bg-base-100 p-5 text-center m-5 shadow-2xl'>More from {product.seller_name}</h1>
            <div className="flex justify-center items-center m-5 shadow-2xl">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-x-1 gap-y-3">
                    {products.map(product => {
                        if (product.product_id != productId) {
                            return (
                                <div key={product.product_id} className="card card-compact bg-base-100 shadow-xl h-[390px]" style={{ backgroundColor: '#292c38' }}>
                                    <figure className="h-[50%]"><img src={`http://localhost:5000/assets/productImages/${product.file_name}`} alt={product.product_name} /></figure>
                                    <div className="card-body">
                                        <h2 className="font-medium truncate text-wrap ">{product.product_name}</h2>
                                        <span className="line-clamp-3 h-[68px]">{product.description}</span>
                                        <div className="card-actions justify-end">
                                            <p className=" font-semibold text-xl">{`$${product.price}`}</p>
                                            <Link to={`/products/${product.product_id}`} className="btn btn-primary">Buy Now</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>

        </>
    )
}

export default ProductPage;

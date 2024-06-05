import { useNavigate, Link  } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [products, setProducts] = useState([]);
    const [searchString, setSearchString] = useState("_");
    const navigate = useNavigate();

    async function getProducts() {
        const response = await fetch('http://localhost:5000/products');
        const responseData = await response.json();
        setProducts(responseData);
    }

    async function handleSearch(e) {
        e.preventDefault();
        navigate(`/products?search=${searchString}`);
    }

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <div className="hero min-h-[70vh]" style={{ backgroundImage: 'url(http://localhost:5000/assets/productImages/6b92832d1866bc43c6105a4de61a205b_upscayl_4x_realesrgan-x4plus-anime.png)' }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                        <p className="mb-5">Join our thriving marketplace and turn your passion into profit. Upload your products with ease and reach customers worldwide.</p>
                        <Link to='./user/profile' state={{ newState: 'seller' }} className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </div>
            <div>
                <div className="navbar shadow-2xl">
                    <div className="flex-1">
                        <a className="btn btn-ghost text-xl">Products</a>
                    </div>
                    <form onSubmit={ (e) => handleSearch(e) }>
                        <label className="input input-bordered flex items-center gap-2">
                            <input type="text" className="grow" placeholder="Search" onChange={ (e) =>{setSearchString(e.target.value)}} />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </form>
                </div>
            </div>
            <div className="flex justify-center items-center m-5">
                <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 grid-cols-2  gap-x-1 gap-y-3">
                    {products.map(product => {
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
                    })}
                </div>
            </div>
        </>
    )
}

export default Home
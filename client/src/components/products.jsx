import { useLocation, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"

function Products() {
    const [products, setProducts] = useState([]);
    const [searchItem, setSearchItem] = useState("_");
    const [minprice, setMinprice] = useState(0);
    const [maxprice, setMaxprice] = useState(999999999);
    const [listOrder, setListOrder] = useState("Latest");
    const [orderParameter, setOrderParameter] = useState("date_uploaded");
    const [orderBy, setOrderBy] = useState('desc');
    const location = useLocation();
    const navigate = useNavigate();

    async function getProducts() {
        const response = await fetch('http://localhost:5000/products');
        const responseData = await response.json();
        setProducts(responseData);
    }

    async function filterProducts(e) {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/products/filter/query?min=${minprice}&max=${maxprice}&orderParameter=${orderParameter}&orderBy=${orderBy}&s=${searchItem}`);
            const responseData = await response.json();
            if (responseData.length != 0) {
                setProducts(responseData);
            } else {

            }
        } catch (err) {
            console.error(err.message);
        }
    }

    function productListOrder(e) {
        setListOrder(e.target.textContent);
        const id = e.currentTarget.id;
        if (id == "priceDesc") {
            setOrderParameter("price");
            setOrderBy("desc");
        }
        else if (id == "priceAsc") {
            setOrderParameter("price");
            setOrderBy("asc");
        }
        else if (id == "default") {
            setOrderParameter("date_uploaded");
            setOrderBy("desc");
        }
    }

    async function homeSearchHandle() {
        // Parse search query from URL
        const searchParams = new URLSearchParams(location.search);
        const searchString = searchParams.get('search');
        if (searchString == null) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/products/filter/query?min=${minprice}&max=${maxprice}&orderParameter=${orderParameter}&orderBy=${orderBy}&s=${searchString}`);
            const responseData = await response.json();
            if (responseData.length != 0) {
                setProducts(responseData);
            } else {
 
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getProducts();
        homeSearchHandle();
        
    }, []);
    
    return (
        <>
            <div className="navbar bg-base-100 bg-inherit shadow-2xl border-t-2" style={{ backgroundColor: '#1d232a' }}>
                 <div className="flex-1">
                    <a className="btn btn-ghost text-xl" onClick={() => {navigate('/products')}}>Products</a>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text text-[10px]">Range</span>
                            </div>
                            <input type="number" placeholder="Min" className="input input-bordered w-[100px] max-w-xs"
                                onChange={(e) => {
                                    if (e.target.value == "") {
                                        setMinprice(0);
                                    } else {
                                        setMinprice(e.target.value);
                                    }
                                }} />
                            <input type="number" placeholder="Max" className="input input-bordered w-[100px] max-w-xs" onChange={(e) => {
                                if (e.target.value == "") {
                                    setMaxprice(999999999);
                                } else {
                                    setMaxprice(e.target.value);
                                }
                            }} />
                        </label></li>
                        <li className="dropdown dropdown-end mt-2">
                            <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">{listOrder}</div>
                            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                                <li id="default" onClick={(e) => { productListOrder(e) }}><a>{`Latest`}</a></li>
                                <li id="priceAsc" onClick={(e) => { productListOrder(e) }}><a>{`Price(Low to High)↓`}</a></li>
                                <li id="priceDesc" onClick={(e) => { productListOrder(e) }}><a>{`Price(High to Low)↑`}</a></li>
                            </ul>
                        </li>
                        <li className="mt-2"><button className="btn btn-success" onClick={(e) => { filterProducts(e) }}>Filter</button></li>
                        <li><form onSubmit={(e) => { filterProducts(e) }}><label className="input input-bordered flex items-center gap-2 ml-2">
                            <input type="text" className="grow" placeholder="Search" onChange={(e) => { setSearchItem(e.target.value) }} />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label></form></li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-center items-center m-5 shadow-xl">
                <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-x-1 gap-y-3">
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
};

export default Products;
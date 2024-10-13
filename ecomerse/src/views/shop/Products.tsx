import { React, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart, FaSpinner } from 'react-icons/fa';

import apiInstance from '../../utils/axios';
import Addon from '../plugin/Addon';
import GetCurrentAddress from '../plugin/UserCountry';
import UserData from '../plugin/UserData';
import CartID from '../plugin/cartID';
import { addToCart } from '../plugin/addToCart';
import { addToWishlist } from '../plugin/addToWishlist';
import { CartContext } from '../plugin/Context';
import { Category } from './Productspage/Category/Category';
import { Featured } from './Productspage/FeaturedProducts/Featured';

function Products() {

    const [featuredProducts, setFeaturedProducts] = useState([])
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [brand, setBrand] = useState([])


    let [isAddingToCart, setIsAddingToCart] = useState("Add To Cart");
    const [loadingStates, setLoadingStates] = useState({});
    let [loading, setLoading] = useState(true);

    const axios = apiInstance
    const addon = Addon()
    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    let cart_id = CartID()

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColors, setSelectedColors] = useState({});
    const [selectedSize, setSelectedSize] = useState({});
    const [colorImage, setColorImage] = useState("")
    const [colorValue, setColorValue] = useState("No Color")
    const [sizeValue, setSizeValue] = useState("No Size")
    const [qtyValue, setQtyValue] = useState(1)
    let [cartCount, setCartCount] = useContext(CartContext);

    // Pagination
    // Define the number of items to be displayed per page
    const itemsPerPage = 3;

    // State hook to manage the current page being displayed
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index of the last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;

    // Calculate the index of the first item on the current page
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Extract a subset of items (current page) from the products array
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate the total number of pages needed based on the total number of items
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Generate an array of page numbers for pagination control
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    // Explanation:
    // - `indexOfLastItem` and `indexOfFirstItem` are used to determine the range of items
    //   to be displayed on the current page.
    // - `currentItems` holds the subset of products to be displayed on the current page.
    // - `totalPages` calculates the total number of pages required based on the total number
    //   of items and the specified items per page.
    // - `pageNumbers` is an array containing the page numbers from 1 to the total number of pages.
    //   It's often used for generating pagination controls or navigation.


    // Define an async function for fetching data from an API endpoint and updating the state.
    // This function takes two parameters:
    // - endpoint: The API endpoint to fetch data from.
    // - setDataFunction: The state update function to set the retrieved data.
    async function fetchData(endpoint, setDataFunction) {
        try {
            // Send an HTTP GET request to the provided endpoint using Axios.
            const response = await axios.get(endpoint);

            // If the request is successful, update the state with the retrieved data.
            setDataFunction(response.data);
            if (products) {
                setLoading(false)
            }
        } catch (error) {
            // If an error occurs during the request, log the error to the console.
            console.log(error);
        }
    }

    // Use the useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
        fetchData('products/', setProducts);

    }, []);

    // Use the useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
        fetchData('featured-products/', setFeaturedProducts);
    }, []);

    // Use another useEffect hook to execute code when the component mounts (empty dependency array).
    useEffect(() => {
        // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
        fetchData('category/', setCategory);
    }, []);

    // Fetch and set the 'brand' data by calling fetchData with the 'brand/' endpoint.

    useEffect(() => {
        // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
        fetchData('brand/', setBrand);
    }, []);



    const handleColorButtonClick = (event, product_id, colorName, colorImage) => {
        setColorValue(colorName);
        setColorImage(colorImage);
        setSelectedProduct(product_id);

        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [product_id]: colorName,
        }));


    };

    const handleSizeButtonClick = (event, product_id, sizeName) => {
        setSizeValue(sizeName);
        setSelectedProduct(product_id);

        setSelectedSize((prevSelectedSize) => ({
            ...prevSelectedSize,
            [product_id]: sizeName,
        }));

    };

    const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value);
        setSelectedProduct(product_id);
    };


    const handleAddToCart = async (product_id, price, shipping_amount) => {
        setLoadingStates((prevStates) => ({
            ...prevStates,
            [product_id]: 'Adding...',
        }));


        try {
            await addToCart(product_id, userData?.user_id, qtyValue, price, shipping_amount, currentAddress.country, colorValue, sizeValue, cart_id, setIsAddingToCart)

            // After a successful operation, set the loading state to false
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Added to Cart',
            }));



            setColorValue("No Color");
            setSizeValue("No Size");
            setQtyValue(0)

            const url = userData?.user_id ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`;
            const response = await axios.get(url);

            setCartCount(response.data.length);
            console.log(response.data.length);


        } catch (error) {
            console.log(error);

            // In case of an error, set the loading state for the specific product back to "Add to Cart"
            setLoadingStates((prevStates) => ({
                ...prevStates,
                [product_id]: 'Add to Cart',
            }));
        }


    };


    const handleAddToWishlist = async (product_id) => {
        try {
            await addToWishlist(product_id, userData?.user_id)
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            {loading === false &&
                <div>
                    <main className="mt-5">
                        <div className="container">

                            <Category/>

                            <Featured/>


                        </div>
                    </main>

                    <main>
                        <section className="text-center container">
                            <div className="row mt-4 mb-3">
                                <div className="col-lg-6 col-md-8 mx-auto">
                                    <h1 className="fw-light">Category</h1>
                                    <p className="lead text-muted">
                                        Our Latest Categories
                                    </p>
                                </div>
                            </div>
                        </section>
                        <div className="d-flex justify-content-center">
                            {category.map((c, index) => (
                                <div className="align-items-center d-flex flex-column" style={{ background: "#e8e8e8", marginLeft: "10px", borderRadius: "10px", padding: "30px" }}>
                                    <img src={c.image}
                                        alt=""
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <p><a href="" className='text-dark'>{c.title}</a></p>
                                </div>
                            ))}

                        </div>
                        <section className="text-center container mt-5">
                            <div className="row py-lg-5">
                                <div className="col-lg-6 col-md-8 mx-auto">
                                    <h1 className="fw-light">Trending Products</h1>
                                    <p className="lead text-muted">
                                        Something short and leading about the collection below—its contents
                                    </p>
                                </div>
                            </div>
                        </section>
                        <div className="album py-5 bg-light">
                            <div className="container">
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                    {featuredProducts.map((product, index) => (
                                        <div className="col-lg-4 col-md-12 mb-4" key={index.id}>
                                            <div className="card">
                                                <div
                                                    className="bg-image hover-zoom ripple"
                                                    data-mdb-ripple-color="light"
                                                >
                                                    <img
                                                        src={product.image}
                                                        className="w-100"
                                                        style={{ width: "100px", height: "300px", objectFit: "cover" }}
                                                    />
                                                </div>
                                                <div className="card-body">
                                                    <a href="" className="text-reset">
                                                        <h5 className="card-title mb-3 ">{product.title.slice(0, 30)}...</h5>
                                                    </a>
                                                    <a href="" className="text-reset">
                                                        <p>{product?.brand.title}</p>
                                                    </a>
                                                    <h6 className="mb-3">{addon.currency_sign}{product.price}</h6>
                                                    <button type="button" className="btn btn-primary me-1 mb-1">
                                                        Add to cart
                                                    </button>
                                                    <button type="button" className="btn btn-danger px-3 me-1 mb-1">
                                                        <i className="fas fa-heart" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            }

            {loading === true &&
                <div className="container text-center">
                    <img className='' src="https://cdn.dribbble.com/users/2046015/screenshots/5973727/06-loader_telega.gif" alt="" />
                </div>
            }
        </>




    )
}

export default Products
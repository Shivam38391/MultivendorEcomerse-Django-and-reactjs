import apiInstance from '@/utils/axios';
import { productsApi } from '@/utils/Https/apicalls';
import Addon from '@/views/plugin/Addon';
import { addToCart } from '@/views/plugin/addToCart';
import { addToWishlist } from '@/views/plugin/addToWishlist';
import CartID from '@/views/plugin/cartID';
import { CartContext } from '@/views/plugin/Context';
import GetCurrentAddress from '@/views/plugin/UserCountry';
import UserData from '@/views/plugin/UserData';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react'
import { FaCheckCircle, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Featured = () => {
    const [products, setProducts] = useState([])



    let [isAddingToCart, setIsAddingToCart] = useState("Add To Cart");
    const [loadingStates, setLoadingStates] = useState({});

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



    const { isPending, data, isError, error } = useQuery({ queryKey: ['Products'], queryFn: productsApi })

    if (isPending) return <div>Loading...</div>
  
    if (isError) return <div>Error: {error.message}</div>
  


    return (
        <>

            <section className="text-center container">
                <div className="row mt-4 mb-3">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Featured Products separate component 📍</h1>
                        <p className="lead text-muted">
                            Our Featured Products
                        </p>
                    </div>
                </div>
            </section>
            <section className="text-center">
                <div className="row">
                    {data.data.map((product, index) => (
                        <div className="col-lg-4 col-md-12 mb-4" key={index.id}>
                            <div className="card">
                                <div
                                    className="bg-image hover-zoom ripple"
                                    data-mdb-ripple-color="light"
                                >
                                    <Link to={`/detail/${product.slug}`}>
                                        <img
                                            src={(selectedProduct === product.id && colorImage) ? colorImage : product.image}
                                            className="w-100"
                                            style={{ width: "100px", height: "300px", objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="card-body">

                                    <h6 className="">By: <Link to={`/vendor/${product?.vendor?.slug}`}>{product.vendor.name}</Link></h6>
                                    <Link to={`/detail/${product.slug}`} className="text-reset"><h5 className="card-title mb-3 ">{product.title.slice(0, 30)}...</h5></Link>
                                    <Link to="/" className="text-reset"><p>{product?.brand.title}</p></Link>
                                    <h6 className="mb-1">${product.price}</h6>

                                    {((product.color && product.color.length > 0) || (product.size && product.size.length > 0)) ? (
                                        <div className="btn-group">
                                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuClickable" data-bs-toggle="dropdown" data-bs-auto-close="false" aria-expanded="false">
                                                Variation
                                            </button>
                                            <ul className="dropdown-menu" style={{ maxWidth: "400px" }} aria-labelledby="dropdownMenuClickable">
                                                {/* Quantity */}
                                                <div className="d-flex flex-column mb-2 mt-2 p-1">
                                                    <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                        <>
                                                            <li>
                                                                <input
                                                                    type="number"
                                                                    className='form-control'
                                                                    placeholder='Quantity'
                                                                    onChange={(e) => handleQtyChange(e, product.id)}
                                                                    min={1}
                                                                    defaultValue={1}
                                                                />
                                                            </li>
                                                        </>
                                                    </div>
                                                </div>

                                                {/* Size */}
                                                {product?.size && product?.size.length > 0 && (
                                                    <div className="d-flex flex-column">
                                                        <li className="p-1"><b>Size</b>: {selectedSize[product.id] || 'Select a size'}</li>
                                                        <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                            {product?.size?.map((size, index) => (
                                                                <>
                                                                    <li key={index}>
                                                                        <button
                                                                            className="btn btn-secondary btn-sm me-2 mb-1"
                                                                            onClick={(e) => handleSizeButtonClick(e, product.id, size.name)}
                                                                        >
                                                                            {size.name}
                                                                        </button>
                                                                    </li>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}


                                                {/* Color */}
                                                {product.color && product.color.length > 0 && (
                                                    <div className="d-flex flex-column mt-3">
                                                        <li className="p-1 color_name_div"><b>Color</b>: {selectedColors[product.id] || 'Select a color'}</li>
                                                        <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                                            {product?.color?.map((color, index) => (
                                                                <>
                                                                    <input type="hidden" className={`color_name${color.id}`} name="" id="" />
                                                                    <li key={index}>
                                                                        <button
                                                                            key={color.id}
                                                                            className="color-button btn p-3 me-2"
                                                                            style={{ backgroundColor: color.color_code }}
                                                                            onClick={(e) => handleColorButtonClick(e, product.id, color.name, color.image)}
                                                                        >
                                                                        </button>
                                                                    </li>
                                                                </>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Add To Cart */}
                                                <div className="d-flex mt-3 p-1 w-100">
                                                    <button
                                                        onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                                        disabled={loadingStates[product.id] === 'Adding...'}
                                                        type="button"
                                                        className="btn btn-primary me-1 mb-1"
                                                    >
                                                        {loadingStates[product.id] === 'Added to Cart' ? (
                                                            <>
                                                                Added to Cart <FaCheckCircle />
                                                            </>
                                                        ) : loadingStates[product.id] === 'Adding...' ? (
                                                            <>
                                                                Adding to Cart <FaSpinner className='fas fa-spin' />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {loadingStates[product.id] || 'Add to Cart'} <FaShoppingCart />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </ul>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product.id, product.price, product.shipping_amount)}
                                            disabled={loadingStates[product.id] === 'Adding...'}
                                            type="button"
                                            className="btn btn-primary me-1 mb-1"
                                        >
                                            {loadingStates[product.id] === 'Added to Cart' ? (
                                                <>
                                                    Added to Cart <FaCheckCircle />
                                                </>
                                            ) : loadingStates[product.id] === 'Adding...' ? (
                                                <>
                                                    Adding to Cart <FaSpinner className='fas fa-spin' />
                                                </>
                                            ) : (
                                                <>
                                                    {loadingStates[product.id] || 'Add to Cart'} <FaShoppingCart />
                                                </>
                                            )}
                                        </button>

                                    )}

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={() => handleAddToWishlist(product.id)}
                                        type="button"
                                        className="btn btn-danger px-3 ms-2 "
                                    >
                                        <i className="fas fa-heart" />
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <nav className='d-flex  gap-1 pt-2'>
                <ul className='pagination'>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            <i className="ci-arrow-left me-2" />
                            Previous
                        </button>
                    </li>
                </ul>
                <ul className="pagination">
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(number)}>
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>

                <ul className="pagination">
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            Next
                            <i className="ci-arrow-right ms-3" />

                        </button>
                    </li>
                </ul>

            </nav>
            <div>
                <div className="d-blfock mt-5" aria-label="Page navigation" >
                    <span className="fs-sm text-muted me-md-3">Page <b>{currentPage} </b> of <b>{totalPages}</b></span>
                </div>
                {totalPages !== 1 &&
                    <div className="d-block mt-2" aria-label="Page navigation" >
                        <span className="fs-sm text-muted me-md-3">Showing <b>{itemsPerPage}</b> of <b>{products?.length}</b> records</span>
                    </div>
                }
            </div>


        </>
    )
}

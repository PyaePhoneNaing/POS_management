import React, { useState } from 'react';
import '../Styles/Dashboard.styles.scss';
import Cart from '../Components/Cart';
import { useNavigate } from 'react-router-dom';
import useIsMobile from '../Hooks/useIsMobile';
import useIsLaptop from '../Hooks/useIsLaptop';

export default function Dashboard() {
  const [cartItems, setCartItems] = useState([]); // Cart items array
  const [isCartVisible, setIsCartVisible] = useState(false); // State for cart visibility
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const navigate = useNavigate(); // For navigation to the Products page
const isMobile = useIsMobile();
const isLaptop = useIsLaptop();

  const products = [
    { id: 1, name: 'Water',  price: '1.10' },
    { id: 2, name: 'Water', price: '1.50' },
    { id: 3, name: 'Water', price: '2.00' },
    { id: 4, name: 'Mineral Water', price: '3.00' },
    { id: 5, name: 'Sparkling Water', price: '2.50' },
    { id: 6, name: 'Spring Water',price: '2.20' },
    { id: 7, name: 'Distilled Water',price: '1.80' },
    { id: 8, name: 'Flavored Water',price: '2.75' },
    { id: 9, name: 'Electrolyte Water',price: '3.20' },
    { id: 10, name: 'Alkaline Water', price: '3.50' },
    { id: 11, name: 'Coconut Water', price: '4.00' },
    { id: 12, name: 'Vitamin Water', price: '3.80' },
  ];

  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleAddClick = (product) => {
    // Check if product is already in cart
    const exists = cartItems.find((item) => item.id === product.id);
    if (!exists) {
      setCartItems((prev) => [
        ...prev,
        { ...product, quantity: 1, date: new Date().toISOString().split('T')[0] }
      ]);
    }
    setIsCartVisible(true); // Open the cart
  };

  const handleCartConfirm = (finalizedProducts) => {
    navigate('/products', { state: { finalizedProducts } });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  return (
    <div className="row dashboard">
      <div className="col-12 ">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3>Products</h3>
            {/* Page Navigation Header (top for mobile, bottom for tablet+) */}
            {isMobile && (
              <div className="page-nav-header">
                <div className="flex items-center space-x-4">
                  <button
                    className="page-nav-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    aria-label="Previous Page"
                  >
                    &#8592;
                  </button>
                  <span className="text-sm font-medium">
  Page {currentPage + 1} of {totalPages}
</span>

                  <button
                    className="page-nav-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Next Page"
                  >
                    &#8594;
                  </button>
                </div>
              </div>
            )}
            <div className="table-responsive">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .slice(
                      currentPage * productsPerPage,
                      currentPage * productsPerPage + productsPerPage
                    )
                    .map((product) => (
                      <tr key={product.id}>
                        <td className="product-cell" data-label="Product">
                          <img
                            src={`/path/to/valid/${product.id}.jpg`}
                            alt={product.name}
                            className="product-image me-2"
                          />
                        </td>
                        <td data-label="Description">{product.name}</td>
                        <td data-label="Price">{product.price}</td>
                        <td data-label="Action">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddClick(product)}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Page Navigation Header (bottom for tablet+) */}
            {isLaptop && (
              <div className="page-nav-header">
                <div className="flex items-center space-x-4">
                  <button
                    className="page-nav-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    aria-label="Previous Page"
                  >
                    &#8592;
                  </button>
                  <span className="text-sm font-medium">
  Page {currentPage + 1} of {totalPages}
</span>

                  <button
                    className="page-nav-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    aria-label="Next Page"
                  >
                    &#8594;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isCartVisible && (
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          onClose={() => setIsCartVisible(false)}
          onConfirm={handleCartConfirm}
          onAddMore={() => setIsCartVisible(false)} // Add this prop to allow adding more items
        />
      )}
    </div>
  );
}
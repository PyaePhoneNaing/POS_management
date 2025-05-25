import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/Sales.styles.scss';
import DateFilter from '../Components/Date';
import useIsMobile from '../Hooks/useIsMobile';
import useIsLaptop from '../Hooks/useIsLaptop';
import { isSameDay, isSameWeek, isSameMonth, isSameYear } from '../Components/FilterDate';
import { IoTrashOutline } from "react-icons/io5";

// --- REPLACE WITH BACKEND CALLS BELOW ---
const LOCAL_STORAGE_KEY = 'persistedProducts'; // <-- Remove when using backend
// Utility to get a unique key for a product by id and date
const getProductKey = (item) => `${item.id}-${item.date}`;

export default function Sales() {
  const location = useLocation();
  const finalizedProducts = location.state?.finalizedProducts || [];
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const [products, setProducts] = useState([]);
  const [period, setPeriod] = useState('all');
  const isMobile = useIsMobile();
  const isLaptop = useIsLaptop();

  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const productsPerPage = 4;

  // Load from localStorage on mount
  useEffect(() => {
    // REPLACE: Fetch products from backend instead of localStorage
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  // Add new products from navigation state
  useEffect(() => {
    // REPLACE: Send finalizedProducts to backend and fetch updated list
    if (finalizedProducts.length > 0) {
      setProducts((prev) => {
        // Use a map to merge products by id+date
        const map = new Map();
        prev.forEach((p) => map.set(getProductKey(p), { ...p }));
        finalizedProducts.forEach((p) => {
          const key = getProductKey(p);
          if (map.has(key)) {
            // Update quantity if exists
            const existing = map.get(key);
            map.set(key, { ...existing, quantity: existing.quantity + p.quantity });
          } else {
            map.set(key, { ...p });
          }
        });
        const merged = Array.from(map.values());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
      // Clear the navigation state so it doesn't re-add on refresh
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [finalizedProducts]);

  // Delete handler
  const handleDelete = (id, date) => {
    // REPLACE: Send delete request to backend and fetch updated list
    setProducts((prev) => {
      const filtered = prev.filter((item) => !(item.id === id && item.date === date));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  // Filtering logic
  const getFilteredProducts = () => {
    if (period === 'all'){
      return [...products];
    }
    let filtered = [...products];
    if (period !== 'all' || filterDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        let periodMatch = true;
        let dateMatch = true;
        if (period !== 'all' && filterDate) {
          const selected = new Date(filterDate);
          if (period === 'day') periodMatch = isSameDay(itemDate, selected);
          else if (period === 'week') periodMatch = isSameWeek(itemDate, selected);
          else if (period === 'month') periodMatch = isSameMonth(itemDate, selected);
          else if (period === 'year') periodMatch = isSameYear(itemDate, selected);
        } else if (period !== 'all') {
          const today = new Date();
          if (period === 'day') periodMatch = isSameDay(itemDate, today);
          else if (period === 'week') periodMatch = isSameWeek(itemDate, today);
          else if (period === 'month') periodMatch = isSameMonth(itemDate, today);
          else if (period === 'year') periodMatch = isSameYear(itemDate, today);
        } else if (filterDate) {
          const selected = new Date(filterDate);
          dateMatch = isSameDay(itemDate, selected);
        }
        return periodMatch && dateMatch;
      });
    }
    return filtered;
  };

  // Memoize filtered products and total pages for performance
  const filteredProducts = React.useMemo(() => getFilteredProducts(), [products, period, filterDate]);
  const totalPages = React.useMemo(() => Math.ceil(filteredProducts.length / productsPerPage), [filteredProducts.length, productsPerPage]);

  useEffect(() => {
    // Reset to first page if filter changes
    setCurrentPage(0);
  }, [period, filterDate, products.length]);

  return (
    <div className="products-page">
      {/* Filter Controls */}
      <div className='filter' >
        <label>
          Period:
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className='filter-select'
          >
            <option value="all">All</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </label>
        <DateFilter filterDate={filterDate} setFilterDate={setFilterDate} />
      </div>
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
      {filteredProducts.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.slice(
                  currentPage * productsPerPage,
                  currentPage * productsPerPage + productsPerPage
                ).map((item) => (
                  <tr key={getProductKey(item)}>
                    <td className="product-cell" data-label="Product">
                      <img
                        src={`/path/to/valid/${item.id}.jpg`}
                        alt={item.name}
                        className="product-image me-2"
                      />
                    </td>
                    <td data-label="Description">{item.name}</td>
                    <td data-label="Price">${item.price}</td>
                    <td data-label="Quantity">{item.quantity}</td>
                    <td data-label="Total Price">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    <td data-label="Action">
                      <button className="btn btn-secondary" onClick={() => handleDelete(item.id, item.date)}>
                        <IoTrashOutline />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </>
      ) : (
        <p>
          {period !== 'all' || filterDate
            ? 'No products match the selected filter.'
            : 'No product added yet.'}
        </p>

      )}
    </div>
  );
}


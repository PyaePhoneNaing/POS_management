import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/Products.styles.scss';
import DateFilter from '../Components/Date';
import useIsMobile from '../Hooks/useIsMobile';
import useIsLaptop from '../Hooks/useIsLaptop';

const LOCAL_STORAGE_KEY = 'persistedProducts';
const getProductKey = (item) => `${item.id}-${item.date}`;


function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
function isSameWeek(date1, date2) {
  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday = 0
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const d1Start = startOfWeek(date1);
  const d2Start = startOfWeek(date2);

  return (
    d1Start.getFullYear() === d2Start.getFullYear() &&
    d1Start.getMonth() === d2Start.getMonth() &&
    d1Start.getDate() === d2Start.getDate()
  );
}

function isSameMonth(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}
function isSameYear(date1, date2) {
  return date1.getFullYear() === date2.getFullYear();
}

export default function Products() {
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
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  // Add new products from navigation state
  useEffect(() => {
    if (finalizedProducts.length > 0) {
      setProducts((prev) => {
        // Avoid duplicates by id+date, but update quantity if same id+date exists
        const map = new Map();
        prev.forEach((p) => map.set(getProductKey(p), { ...p }));
        finalizedProducts.forEach((p) => {
          const key = getProductKey(p);
          if (map.has(key)) {
            map.set(key, { ...p, quantity: map.get(key).quantity + p.quantity });
          } else {
            map.set(key, { ...p });
          }
        });
        const merged = Array.from(map.values());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
      // Clear the navigation state so it doesn't re-add on refresh
      window.history.replaceState({}, document.title);
    }
  }, [finalizedProducts]);

  // Delete handler
  const handleDelete = (id, date) => {
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

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    // Reset to first page if filter changes
    setCurrentPage(0);
  }, [period, filterDate, products.length]);

  return (
    <div className="products-page">
      {/* Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 500 }}>
          Period:
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: 6 }}
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
      {isMobile  && (
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
                  <th>Action</th>
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
                        Delete
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
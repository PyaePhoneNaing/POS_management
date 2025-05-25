import React from 'react';
import '../Styles/Cart.styles.scss';

export default function Cart({ cartItems, setCartItems, onClose, onConfirm, onAddMore }) {
  // Handle quantity change for a specific item
  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Handle date change for a specific item
  const handleDateChange = (id, date) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, date } : item
      )
    );
  };

  // Remove item from cart
  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirm = () => {
    onConfirm(cartItems);
    onClose();
  };

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Cart</h3>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid #eee', marginBottom: 16, paddingBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: '#666', fontSize: 14 }}>{item.status}</div>
              <div style={{ color: '#333', fontSize: 15 }}>Price: ${parseFloat(item.price * item.quantity).toFixed(2)}</div>
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
              <div className="date-selector">
                <label>Date:</label>
                <input
                  type="date"
                  value={item.date}
                  onChange={(e) => handleDateChange(item.id, e.target.value)}
                />
              </div>
              <button className="btn btn-secondary remove-btn"onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))
        )}
        <div className="cart-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={onAddMore}>Add More</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={cartItems.length === 0}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

import data from "./data.json";
import { useState, useEffect } from "react";

function useLocalStorageListener(key) {
  const [storageValue, setStorageValue] = useState(() =>
    localStorage.getItem(key)
  );

  const handleStorageChange = () => {
    setStorageValue(localStorage.getItem(key));
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  useEffect(() => {
    // Manual trigger for changes made in the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (k, v) {
      originalSetItem.apply(this, arguments);
      if (k === key) handleStorageChange();
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, [key]);

  return storageValue;
}

function Card({ dt }) {
  const [quantity, setQuantity] = useState(dt.quantity);

  useEffect(() => {
    if (quantity !== null) {
      handleCart();
    }
  }, [quantity]);

  function handleCart() {
    let items = JSON.parse(localStorage.getItem("cart"));
    const itemExists = items.some((item) => item.name === dt.name);

    if (itemExists) {
      // Update the existing item
      items = items.map((item) =>
        item.name === dt.name ? { ...item, quantity: quantity } : item
      );
    } else {
      // Add the new item
      items = [...items, { ...dt, quantity: quantity }];
    }

    localStorage.setItem("cart", JSON.stringify(items));
  }

  function handleEmptyCart() {
    setQuantity(1);
  }

  function handleQtyRemCart() {
    setQuantity((q) => (q === 1 ? (q = null) : q - 1));
  }

  function handleQtyAddCart() {
    setQuantity((q) => q + 1);
  }

  return (
    <div className="card">
      <div className="img-container">
        <img src={dt.image.desktop} alt={dt.name} />
        {quantity === null ? (
          <button className="cart-btn btn-cart-add" onClick={handleEmptyCart}>
            <img src="./assets/images/icon-add-to-cart.svg" />
            Add to Cart
          </button>
        ) : (
          <div className="cart-btn btn-cart-qty">
            <button onClick={handleQtyRemCart}>-</button>
            {quantity}
            <button onClick={handleQtyAddCart}>+</button>
          </div>
        )}
      </div>
      <p className="card-category">{dt.category}</p>
      <h3 className="card-name">{dt.name}</h3>
      <p className="card-price">${dt.price.toFixed(2)}</p>
    </div>
  );
}

function Cards({ data }) {
  return (
    <div className="cards">
      {data.map((dt) => (
        <Card dt={dt} key={crypto.randomUUID()} />
      ))}
    </div>
  );
}

function CartItem({ item }) {
  function handleCartItemRemove() {
    let items = JSON.parse(localStorage.getItem("cart"));

    items = items.filter((it) => it.name !== item.name);

    localStorage.setItem("cart", JSON.stringify(items));
  }

  return (
    <li>
      <div className="details">
        <div className="content">
          <strong>{item.name}</strong>
          <div className="quan-price">
            <span className="quan">{item.quantity}x</span>
            <span className="priceEach">@ ${item.price.toFixed(2)}</span>
            <span className="priceWhole">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
        <button className="itemRemove" onClick={handleCartItemRemove}>
          <img src="./assets/images/icon-remove-item.svg" alt="remove-icon" />
        </button>
      </div>
      <hr className="li-end" />
    </li>
  );
}

function Cart(data) {
  const localStorageValue = useLocalStorageListener("cart");
  const cartItems = localStorageValue ? JSON.parse(localStorageValue) : [];

  const cartLength = cartItems.reduce((acc, item) => {
    acc += item?.quantity || 0;
    return acc;
  }, 0);

  const totalPrice = cartItems.reduce((acc, item) => {
    acc += item?.quantity * item?.price || 0;
    return acc;
  }, 0);

  return (
    <div className="cartContainer">
      <h2 className="cartHeading">Your Cart ({cartLength})</h2>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <img src="./assets/images/illustration-empty-cart.svg" alt="cart" />
          <p>Your added items will appear here</p>
        </div>
      ) : (
        <div>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <CartItem item={item} key={crypto.randomUUID()} />
            ))}
          </ul>
          <div className="totalPrice">
            <p>Order Total</p>
            <strong> ${totalPrice.toFixed(2)} </strong>
          </div>
          <div className="carbon-neutral-msg">
            <img
              src="./assets/images/icon-carbon-neutral.svg"
              alt="tree-icon"
            />
            <p>
              This is <strong>carbon-neutral</strong> delivery
            </p>
          </div>
          <button className="btn-confirm-order">Confirm Order</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  localStorage.setItem("cart", JSON.stringify([]));

  const items = data.map((it) =>
    it?.quantity === undefined ? { ...it, quantity: null } : it
  );

  return (
    <div className="container">
      <h1 className="heading">Desserts</h1>
      <main>
        <Cards data={items} />
        <Cart />
      </main>
    </div>
  );
}

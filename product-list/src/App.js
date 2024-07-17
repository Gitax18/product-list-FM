import data from "./data.json";
import { useState } from "react";

function Card({ dt, setCart }) {
  const [quantity, setQuantity] = useState(null);

  function handleCartDetail() {
    const item = { ...dt, quantity: quantity };
  }

  function handleEmptyCart() {
    setQuantity(1);
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
            <button
              onClick={(e) =>
                setQuantity((q) => (q === 1 ? (q = null) : q - 1))
              }
            >
              -
            </button>
            {quantity}
            <button onClick={(e) => setQuantity((q) => q + 1)}>+</button>
          </div>
        )}
      </div>
      <p className="card-category">{dt.category}</p>
      <h3 className="card-name">{dt.name}</h3>
      <p className="card-price">${dt.price.toFixed(2)}</p>
    </div>
  );
}

function Cards({ data, setCart }) {
  return (
    <div className="cards">
      {data.map((dt) => (
        <Card dt={dt} setCart={setCart} key={crypto.randomUUID()} />
      ))}
    </div>
  );
}

function Cart() {}

export default function App() {
  const [cart, setCart] = useState([]);
  console.log(cart);
  return (
    <div className="container">
      <h1 className="heading">Desserts</h1>
      <main>
        <Cards data={data} setCart={setCart} />
      </main>
    </div>
  );
}

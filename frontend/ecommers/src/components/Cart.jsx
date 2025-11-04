import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

export default function Cart() {
  const { cart, removeFromCart, total } = useContext(CartContext);
  return (
    <aside className="cart">
      <h4>Cart</h4>
      {cart.length === 0 ? <p>No items</p> : cart.map(it => (
        <div key={it.product._id} className="cart-item">
          <div>
            <div>{it.product.title}</div>
            <div>Qty: {it.qty} x ₹{it.product.price}</div>
          </div>
          <button onClick={() => removeFromCart(it.product._id)}>Remove</button>
        </div>
      ))}
      <hr/>
      <div>Total: ₹{total().toFixed(2)}</div>
    </aside>
  );
}

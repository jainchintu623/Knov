
export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card">
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>Vendor: {product.vendor?.name}</p>
      <p>₹ {product.price}</p>
      <button onClick={onAdd}>Add to cart</button>
    </div>
  );
}

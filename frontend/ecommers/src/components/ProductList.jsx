import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => { fetchPage(1); }, []);

  async function fetchPage(p) {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?limit=6&page=${p}`);
      const data = await res.json();
      setProducts(prev => p === 1 ? data : [...prev, ...data]);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  }

  // infinite scroll
  useEffect(() => {
    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
        setPage(p => p + 1);
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading]);

  useEffect(() => {
    if (page === 1) return;
    fetchPage(page);
  }, [page]);

  return (
    <section>
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => <ProductCard key={p._id} product={p} onAdd={() => addToCart(p)} />)}
      </div>
      {loading && <p>Loading...</p>}
    </section>
  );
}

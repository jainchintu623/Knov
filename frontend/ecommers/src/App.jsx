import { useState } from 'react';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SignUp from './components/signUp';
import { CartProvider } from './contexts/CartContext';

export default function App() {
  const [user, setUser] = useState(null);

  const [showLogin, setShowLogin] = useState(true);
  return (
    <CartProvider>
      <div className="container">
        <header className="header">
          <h1>Mini Ecom (MERN)</h1>
          <div>
             {user ? (
        <div>
          <h2>Hello, {user.name}</h2>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          {showLogin ? (
            <Login onLogin={setUser} />
          ) : (
            <SignUp onLogin={setUser} />
          )}
          <div className="toggle-auth mt-4">
            {showLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setShowLogin(false)}>Sign Up</button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setShowLogin(true)}>Login</button>
              </p>
            )}
          </div>
        </div>
      )}
          </div>
        </header>

        <main>
          <ProductList />
          <Cart />
        </main>
      </div>
    </CartProvider>
  );
}

import { useState } from 'react';
import './Cart.css';

// The two numbers that decide the discount. Change them here and nowhere else.
export const DISCOUNT_THRESHOLD = 1000; // cart total at which the discount starts
export const DISCOUNT_RATE = 0.1;       // 10% off

const fmt = (n) => n.toFixed(2);

export default function Cart({ products = [] }) {
  // The cart only remembers { id, qty }. Name and price are looked up from
  // `products` at render time, so they can't drift out of date.
  const [lines, setLines] = useState([]);

  const add = (id) =>
    setLines((cur) =>
      cur.some((l) => l.id === id)
        ? cur.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...cur, { id, qty: 1 }]
    );

  const change = (id, step) =>
    setLines((cur) =>
      cur.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + step) } : l))
    );

  const remove = (id) => setLines((cur) => cur.filter((l) => l.id !== id));

  const priced = lines
    .map((l) => ({ ...l, product: products.find((p) => p.id === l.id) }))
    .filter((l) => l.product);

  const total = priced.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const discount = total >= DISCOUNT_THRESHOLD ? Math.round(total * DISCOUNT_RATE * 100) / 100 : 0;
  const grandTotal = total - discount;

  return (
    <div className="counter">
      <header className="masthead">
        <h1>Paper Counter</h1>
        <p>Pick what you need. Spend {DISCOUNT_THRESHOLD} or more and {DISCOUNT_RATE * 100}% comes off by itself.</p>
      </header>

      <div className="desk">
        <section className="shelf" aria-label="Products">
          <h2>On the shelf</h2>
          <ul>
            {products.map((p) => (
              <li key={p.id}>
                <span className="item-name">{p.name}</span>
                <span className="item-price">{fmt(p.price)}</span>
                <button type="button" className="add" data-testid={`add-${p.id}`} onClick={() => add(p.id)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="slip" aria-label="Your cart">
          <h2>Your slip</h2>

          {priced.length === 0 ? (
            <p className="empty" data-testid="cart-empty">Cart is empty</p>
          ) : (
            <ul className="lines">
              {priced.map(({ id, qty, product }) => (
                <li key={id}>
                  <div className="line-top">
                    <span className="line-name">{product.name}</span>
                    <span className="line-sum">{fmt(product.price * qty)}</span>
                  </div>
                  <div className="line-bottom">
                    <span className="unit">{fmt(product.price)} each</span>
                    <span className="stepper">
                      <button type="button" data-testid={`dec-${id}`} aria-label={`One less ${product.name}`} onClick={() => change(id, -1)}>&minus;</button>
                      <span className="qty" data-testid={`qty-${id}`}>{qty}</span>
                      <button type="button" data-testid={`inc-${id}`} aria-label={`One more ${product.name}`} onClick={() => change(id, 1)}>+</button>
                    </span>
                    <button type="button" className="drop" data-testid={`remove-${id}`} onClick={() => remove(id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="sums">
            <p data-testid="total">{`Total: ${fmt(total)}`}</p>
            {discount > 0 && (
              <>
                <p className="saving" data-testid="discount">{`Discount: ${fmt(discount)}`}</p>
                <p className="grand" data-testid="grand-total">{`Grand Total: ${fmt(grandTotal)}`}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

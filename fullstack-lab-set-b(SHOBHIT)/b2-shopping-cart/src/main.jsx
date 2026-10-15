import React from 'react';
import { createRoot } from 'react-dom/client';
import Cart from './Cart.jsx';

// Demo shelf. Cart only needs { id, name, price } per product.
const shelf = [
  { id: 1, name: 'Ruled notebook', price: 120 },
  { id: 2, name: 'Gel pens, pack of 5', price: 50 },
  { id: 3, name: 'Highlighter set', price: 85 },
  { id: 4, name: 'Geometry box', price: 150 },
  { id: 5, name: 'Scientific calculator', price: 720 },
  { id: 6, name: 'Desk lamp', price: 560 },
];

createRoot(document.getElementById('root')).render(<Cart products={shelf} />);

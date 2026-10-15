import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Cart from './Cart.jsx';

const products = [
  { id: 1, name: 'Notebook', price: 100 },
  { id: 2, name: 'Pen', price: 35 },
  { id: 3, name: 'Lamp', price: 1000 },
];

const setup = () => ({ user: userEvent.setup(), ...render(<Cart products={products} />) });
const id = (x) => screen.getByTestId(x);

describe('Cart', () => {
  it('starts empty', () => {
    setup();
    expect(id('cart-empty')).toHaveTextContent('Cart is empty');
    expect(id('total')).toHaveTextContent('Total: 0.00');
    expect(screen.queryByTestId('discount')).toBeNull();
  });

  it('adds a product and bumps the quantity on a repeat add', async () => {
    const { user } = setup();
    await user.click(id('add-1'));
    expect(id('qty-1')).toHaveTextContent('1');
    await user.click(id('add-1'));
    expect(id('qty-1')).toHaveTextContent('2');
    expect(screen.queryByTestId('cart-empty')).toBeNull();
  });

  it('increases and decreases, but never below 1', async () => {
    const { user } = setup();
    await user.click(id('add-1'));
    await user.click(id('inc-1'));
    await user.click(id('inc-1'));
    expect(id('qty-1')).toHaveTextContent('3');
    await user.click(id('dec-1'));
    await user.click(id('dec-1'));
    await user.click(id('dec-1'));
    expect(id('qty-1')).toHaveTextContent('1');
  });

  it('removes a line and goes back to empty', async () => {
    const { user } = setup();
    await user.click(id('add-2'));
    await user.click(id('remove-2'));
    expect(screen.queryByTestId('qty-2')).toBeNull();
    expect(id('cart-empty')).toBeInTheDocument();
  });

  it('shows the total with two decimals and no discount below the threshold', async () => {
    const { user } = setup();
    await user.click(id('add-1'));
    await user.click(id('add-2'));
    await user.click(id('inc-1'));
    expect(id('total')).toHaveTextContent('Total: 235.00');
    expect(screen.queryByTestId('discount')).toBeNull();
    expect(screen.queryByTestId('grand-total')).toBeNull();
  });

  it('applies 10% off once the total reaches 1000', async () => {
    const { user } = setup();
    await user.click(id('add-3'));
    expect(id('total')).toHaveTextContent('Total: 1000.00');
    expect(id('discount')).toHaveTextContent('Discount: 100.00');
    expect(id('grand-total')).toHaveTextContent('Grand Total: 900.00');
  });

  it('drops the discount again when the total falls back under it', async () => {
    const { user } = setup();
    await user.click(id('add-3'));
    await user.click(id('remove-3'));
    expect(screen.queryByTestId('discount')).toBeNull();
  });
});

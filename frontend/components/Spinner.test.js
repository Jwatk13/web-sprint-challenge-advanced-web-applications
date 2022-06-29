// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import Spinner from '../components/Spinner';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

const spinnerTest = {
  spinnerOn: false
}

test('sanity', () => {
  expect(true).toBe(true)
})

test('renders without errors with no props', async () => {
  render(<Spinner />)
});

test('spinner not running', () => {
  render(<Spinner spinnerOn={spinnerTest}/>)

  const spinner = screen.queryByText(/please wait.../i);

  expect(spinner).not.toBeTruthy();
})
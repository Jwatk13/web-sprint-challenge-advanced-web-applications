// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import Spinner from '../components/Spinner';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

test('sanity', () => {
  expect(true).toBe(true)
})

test('renders without errors with no props', async () => {
  render(<Spinner />)
});

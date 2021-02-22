import { render, screen } from '@testing-library/react';
import App from "../index";
import Login from "../Pages/login";

// test('error object from failed ', () => {
//   render(<App />);
//   const loginTextback = screen.getByText(login);
//   expect(linkElement).toBeInTheDocument();
// });

test('calls onClick prop when clicked', () => {
  const handleClick = jest.fn()
  render(<Login />)
  fireEvent.click(screen.getByText(/Login/i))
  expect(loginUserCallback).toHaveBeenCalledTimes(1)
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../Login';
import { AuthContext } from '../../contexts/AuthContext';

const mockLogin = vi.fn();

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        token: null,
        isAdmin: false,
        login: mockLogin,
        register: vi.fn(),
        logout: vi.fn(),
        loading: false,
      }}
    >
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithContext(<Login />);
    
    expect(screen.getByRole('heading', { name: /lotwise/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    renderWithContext(<Login />);
    
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/must be a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderWithContext(<Login />);
    
    const emailInput = screen.getByLabelText(/work email/i);
    await userEvent.type(emailInput, 'not-an-email');
    
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/must be a valid email address/i)).toBeInTheDocument();
    });
  });

  it('calls login function on valid submission', async () => {
    renderWithContext(<Login />);
    
    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/security key/i);
    const submitBtn = screen.getByRole('button', { name: /log in/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    
    renderWithContext(<Login />);
    
    await userEvent.type(screen.getByLabelText(/work email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/security key/i), 'wrongpassword');
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

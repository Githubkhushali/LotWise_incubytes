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
    expect(screen.getByLabelText(/registry id \/ email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/access key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter showroom/i })).toBeInTheDocument();
  });

  it('calls login function on valid submission', async () => {
    renderWithContext(<Login />);
    
    const emailInput = screen.getByLabelText(/registry id \/ email/i);
    const passwordInput = screen.getByLabelText(/access key/i);
    const submitBtn = screen.getByRole('button', { name: /enter showroom/i });

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
    
    await userEvent.type(screen.getByLabelText(/registry id \/ email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/access key/i), 'wrongpassword');
    
    fireEvent.click(screen.getByRole('button', { name: /enter showroom/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '../Register';
import { AuthContext } from '../../contexts/AuthContext';

const mockRegister = vi.fn();

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        token: null,
        isAdmin: false,
        login: vi.fn(),
        register: mockRegister,
        logout: vi.fn(),
        loading: false,
      }}
    >
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    renderWithContext(<Register />);
    
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/create password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    renderWithContext(<Register />);
    
    const submitBtn = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/must be a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderWithContext(<Register />);
    
    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/create password/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'short');
    
    const submitBtn = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('calls register function on valid submission', async () => {
    renderWithContext(<Register />);
    
    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/create password/i);
    const submitBtn = screen.getByRole('button', { name: /register/i });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'securepassword123');
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'securepassword123',
        role: 'user', // Defaults to user in the schema
      });
    });
  });

  it('shows error message when registration fails (e.g. 409 conflict)', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Email already registered'));
    
    renderWithContext(<Register />);
    
    await userEvent.type(screen.getByLabelText(/work email/i), 'taken@example.com');
    await userEvent.type(screen.getByLabelText(/create password/i), 'password123');
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });
});

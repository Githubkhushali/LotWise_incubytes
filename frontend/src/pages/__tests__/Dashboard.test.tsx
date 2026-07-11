import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { AuthContext } from '../../contexts/AuthContext';
import { vehicleApi } from '../../api/vehicles';

// Mock the vehicle API
vi.mock('../../api/vehicles', () => ({
  vehicleApi: {
    getVehicles: vi.fn(),
    searchVehicles: vi.fn(),
    purchaseVehicle: vi.fn(),
  },
}));

const mockVehicles = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model 3',
    category: 'Sedan',
    price: 40000,
    quantity: 2,
  },
  {
    id: '2',
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    price: 50000,
    quantity: 0,
  },
];

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <AuthContext.Provider
      value={{
        user: { id: 'u1', email: 'test@test.com', role: 'user' },
        token: 'fake-token',
        isAdmin: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loading: false,
      }}
    >
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and renders vehicles on mount', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);

    renderWithContext(<Dashboard />);

    expect(vehicleApi.getVehicles).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
      expect(screen.getByText(/Ford F-150/i)).toBeInTheDocument();
    });

    // Check pricing
    expect(screen.getByText(/\$40,000/)).toBeInTheDocument();
  });

  it('disables purchase button when quantity is 0', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ford F-150/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button', { name: /purchase|out of stock/i });
    const outOfStockBtn = buttons.find(b => b.textContent?.match(/Out of Stock/i) || b.hasAttribute('disabled'));
    
    expect(outOfStockBtn).toBeDisabled();
  });

  it('calls purchase API and refetches on successful purchase', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce([
      { ...mockVehicles[0], quantity: 1 },
      mockVehicles[1]
    ]);
    vi.mocked(vehicleApi.purchaseVehicle).mockResolvedValueOnce({ ...mockVehicles[0], quantity: 1 });

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
    });

    const purchaseBtns = screen.getAllByRole('button', { name: /Purchase Vehicle|Purchase/i });
    fireEvent.click(purchaseBtns[0]);

    await waitFor(() => {
      expect(vehicleApi.purchaseVehicle).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(2);
    });
  });

  it('searches for vehicles via form submit (make)', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValue([]);
    vi.mocked(vehicleApi.searchVehicles).mockResolvedValue([]);

    renderWithContext(<Dashboard />);

    const searchInput = screen.getByPlaceholderText(/SEARCH BY MAKE/i);
    await userEvent.type(searchInput, 'Tesla');
    
    const submitBtn = screen.getByRole('button', { name: /EXECUTE/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(vehicleApi.searchVehicles).toHaveBeenCalledWith({ make: 'Tesla' });
    });
  });

  it('searches by multiple fields including price range', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValue([]);
    vi.mocked(vehicleApi.searchVehicles).mockResolvedValue([]);

    renderWithContext(<Dashboard />);

    const makeInput = screen.getByPlaceholderText(/SEARCH BY MAKE/i);
    const priceMinInput = screen.getByPlaceholderText(/MIN PRICE/i);
    const priceMaxInput = screen.getByPlaceholderText(/MAX PRICE/i);

    await userEvent.type(makeInput, 'BMW');
    await userEvent.type(priceMinInput, '50000');
    await userEvent.type(priceMaxInput, '100000');

    const submitBtn = screen.getByRole('button', { name: /EXECUTE/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(vehicleApi.searchVehicles).toHaveBeenCalledWith({
        make: 'BMW',
        priceMin: 50000,
        priceMax: 100000,
      });
    });
  });

  it('shows error state when vehicle fetch fails', async () => {
    vi.mocked(vehicleApi.getVehicles).mockRejectedValueOnce(new Error('Network error'));

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to Load Inventory/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('retries fetch when Retry button is clicked after error', async () => {
    vi.mocked(vehicleApi.getVehicles).mockRejectedValueOnce(new Error('Network error'));
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));

    await waitFor(() => {
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
    });

    expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(2);
  });
});

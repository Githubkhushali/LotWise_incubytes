import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      {component}
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

    // Shows loading state initially
    expect(vehicleApi.getVehicles).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
      expect(screen.getByText('Ford F-150')).toBeInTheDocument();
    });

    // Check pricing and stock are rendered
    expect(screen.getByText('$40,000')).toBeInTheDocument();
    expect(screen.getByText('2 Units Left')).toBeInTheDocument();
  });

  it('disables purchase button when quantity is 0', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ford F-150')).toBeInTheDocument();
    });

    // The F-150 has 0 qty, so it should say "Out of Stock" and be disabled
    const outOfStockBtn = screen.getByRole('button', { name: /out of stock/i });
    expect(outOfStockBtn).toBeDisabled();
  });

  it('calls purchase API and refetches on successful purchase', async () => {
    // Initial fetch
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);
    // Fetch after purchase
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce([
      { ...mockVehicles[0], quantity: 1 },
      mockVehicles[1]
    ]);
    vi.mocked(vehicleApi.purchaseVehicle).mockResolvedValueOnce({ ...mockVehicles[0], quantity: 1 });

    renderWithContext(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /purchase vehicle/i });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(vehicleApi.purchaseVehicle).toHaveBeenCalledWith('1');
    });

    // Refetches vehicles
    await waitFor(() => {
      expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(2);
    });
  });

  it('debounces search and calls API with query', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValue([]);
    vi.mocked(vehicleApi.searchVehicles).mockResolvedValue([]);

    renderWithContext(<Dashboard />);

    const searchInput = screen.getByPlaceholderText(/search by make/i);
    await userEvent.type(searchInput, 'Tesla');

    // Fast forward or just wait for the debounce (300ms)
    await waitFor(() => {
      expect(vehicleApi.searchVehicles).toHaveBeenCalledWith({ make: 'Tesla' });
    }, { timeout: 1000 });
  });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPanel from '../AdminPanel';
import { AuthContext } from '../../contexts/AuthContext';
import { vehicleApi } from '../../api/vehicles';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../api/vehicles', () => ({
  vehicleApi: {
    getVehicles: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
    deleteVehicle: vi.fn(),
    restockVehicle: vi.fn(),
  },
}));

const mockVehicles = [
  { id: '1', make: 'Tesla', model: 'Model S', category: 'Sedan', price: 90000, quantity: 2 },
];

const renderWithContext = (isAdmin: boolean) => {
  return render(
    <AuthContext.Provider
      value={{
        user: { id: 'u1', email: 'admin@test.com', role: isAdmin ? 'admin' : 'user' },
        token: 'fake-token',
        isAdmin,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        loading: false,
      }}
    >
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('AdminPanel Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing if not admin', () => {
    const { container } = renderWithContext(false);
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches and renders vehicles for admin', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);
    renderWithContext(true);

    expect(screen.getByText(/Fleet Command/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
      expect(screen.getByText(/Model S/i)).toBeInTheDocument();
    });
  });

  it('can create a new vehicle', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce([]); // initial
    vi.mocked(vehicleApi.createVehicle).mockResolvedValueOnce({ ...mockVehicles[0], id: '2' });
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce([{ ...mockVehicles[0], id: '2' }]); // after fetch

    renderWithContext(true);

    // Click "Add New Vehicle" to open modal
    const openModalBtn = screen.getByText(/Add New Vehicle/i);
    fireEvent.click(openModalBtn);

    const makeInput = screen.getByLabelText(/Make/i);
    const modelInput = screen.getByLabelText(/Model/i);
    const priceInput = screen.getByLabelText(/Price/i);
    const qtyInput = screen.getByLabelText(/Quantity/i);
    const submitBtn = screen.getByRole('button', { name: /Execute/i });

    await userEvent.type(makeInput, 'BMW');
    await userEvent.type(modelInput, 'M3');
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '75000');
    await userEvent.clear(qtyInput);
    await userEvent.type(qtyInput, '5');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(vehicleApi.createVehicle).toHaveBeenCalledWith({
        make: 'BMW',
        model: 'M3',
        category: 'Sedan',
        price: 75000,
        quantity: 5,
      });
    });

    // Refetches
    await waitFor(() => {
      expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(2);
    });
  });

  it('can delete a vehicle', async () => {
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce(mockVehicles);
    vi.mocked(vehicleApi.deleteVehicle).mockResolvedValueOnce();
    vi.mocked(vehicleApi.getVehicles).mockResolvedValueOnce([]); // after delete fetch

    renderWithContext(true);

    await waitFor(() => {
      expect(screen.getByText(/Tesla/i)).toBeInTheDocument();
    });

    // Find the delete button (has title="Delete")
    const deleteBtn = screen.getByTitle('Delete');
    fireEvent.click(deleteBtn);

    // Find the confirm delete button in the overlay
    const confirmDeleteBtn = screen.getByText('DELETE');
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(vehicleApi.deleteVehicle).toHaveBeenCalledWith('1');
    });
    
    await waitFor(() => {
      expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(2);
    });
  });
});

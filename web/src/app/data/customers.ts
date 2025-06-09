// web/src/app/data/customers.ts
// Defines data interfaces for customers in the CRM module.
// This structure will align with data stored in Firebase Firestore.

// Interface for a customer profile
export interface Customer {
  id: string; // Unique customer ID (Firestore UID)
  firstName: string; // Customer's first name
  lastName: string; // Customer's last name
  email: string; // Customer's email address
  phone?: string; // Customer's phone number (optional)
  address?: { // Customer's address (optional object)
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  loyaltyPoints?: number; // Loyalty points (optional, for loyalty programs)
  lastPurchaseDate?: string; // Date of last purchase (ISO string, optional)
  notes?: string; // Any internal notes about the customer (optional)
  createdAt: string; // Timestamp of when the customer record was created
  lastUpdated: string; // Timestamp of when the customer record was last updated
}

// Example customer data (for testing or initial demonstration)
export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '555-123-4567',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    loyaltyPoints: 120,
    lastPurchaseDate: '2025-06-01T10:00:00Z',
    createdAt: '2025-01-15T09:00:00Z',
    lastUpdated: '2025-06-07T11:30:00Z',
  },
  {
    id: 'cust_2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-987-6543',
    loyaltyPoints: 50,
    createdAt: '2025-03-20T14:00:00Z',
    lastUpdated: '2025-05-25T17:45:00Z',
    notes: 'Prefers email communication.'
  },
  {
    id: 'cust_3',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    createdAt: '2025-04-10T11:00:00Z',
    lastUpdated: '2025-04-10T11:00:00Z',
  },
];

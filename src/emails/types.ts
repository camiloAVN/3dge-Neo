export interface OrderEmailData {
  orderId: string;
  orderDate: string;
  transactionId: string;
  customer: {
    name: string;
    email: string;
  };
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2: string | null;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  subTotal: number;
  tax: number;
  total: number;
}

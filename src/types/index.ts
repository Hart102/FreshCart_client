export type ModalTemplateType = {
  [key: string]: JSX.Element;
  loaderModal: JSX.Element;
  responseModal: JSX.Element;
};

export type ProductType = {
  id: string;
  images: string[];
  name: string;
  price: string;
  category: string;
  quantity: number;
  size: string;
  description: string;
  createdAt: string;
  status: string;
  isChecked: boolean;
  totalPrice: string | number;
  demanded_quantity: number;
  cartId: string;
};

export type AddressType = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  user_id: string;
  address_line: string;
  city: string;
  country: string;
  phone_number: string;
  state: string;
  zip_code: string;
};

export type PaymentCardType = {
  id: string;
  user_id: string;
  card_number: string;
  card_name: string;
  cvv: string;
  expiry_date: string;
};

export type OrderType = {
  id: string;
  images: string[];
  productId: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: Date;
  firstname: string;
  transaction_reference: string;
  user_id: number;
  payment_status: string;
  product_id: number;
  shipping_address_id: number;
  total_price: string;
  name: string;
};

export type CustomerOrderType = {
  address_line: string;
  city: string;
  country: string;
  createdAt: string;
  demanded_quantity: number;
  email: string;
  firstname: string;
  id: number;
  images: string[];
  lastname: string;
  name: string;
  password: string;
  payment_status: string;
  phone: string | null;
  phone_number: string;
  product_id: number;
  shipping_address_id: number;
  state: string;
  total_price: string;
  transaction_reference: string;
  user_id: number;
  zipe_code?: string;
};

export type CategoryWithProductCount = {
  id: number;
  name: string;
  status: string;
  createdAt: Date;
  product_count: number;
};
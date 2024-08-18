export type ModalTemplateType = {
  [key: string]: JSX.Element;
  loaderModal: JSX.Element;
  responseModal: JSX.Element;
};

export type ProductType = {
  _id: string;
  images: string[];
  name: string;
  price: string;
  quantity: number;
  size: string;
  description: string;
  createdAt: string;
  status: string;
  isChecked: boolean;
  totalPrice: string | number;
  demanded_quantity: number;
  cart_id: string;
  category_name: string;
  category_id: string;
  category: string;
  // categoryDetails: {
  //   _id: string;
  //   name: string;
  // };
};

export type ShoppingBagType = {
  addressId: string;
  totalPrice: number;
  products: {
    productId: string;
    demandedQuantity: number;
  }[];
};

export type PaymentCardType = {
  _id: string;
  user_id: string;
  card_number: string;
  card_name: string;
  cvv: string;
  expiry_date: string;
};

export type OrderType = {
  _id: string;
  images: string[];
  // product_id: string;
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
  _id: number;
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
  _id: number;
  name: string;
  status: string;
  createdAt: Date;
  product_count: number;
};

export type UserType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  user_role: string;
  addresses: {
    address_line: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    phone: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AddressType = {
  // addresses: {
  address_line: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone_number?: string;
  _id: string;
  // }[];
};
export const api = "http://localhost:5000/api";

export const ApiEndPoint = (endpoint: string, params: string) =>
  params == "" ? `${api}/${endpoint}` : `${api}/${endpoint}/${params}`;

export const endpoints = {
  register: "user/register",
  login: "user/login",
  logout: "user/logout",
  fetch_user_role: "user/fetch-user-role",

  create_categories: "categories/create",
  edit_category_using_id: "categories/edit", //useParams /:category_id
  fetch_all_categories: "categories/fetch-all-categorie",
  delete_category_by_id: "categories/delete", //useParams /:category_id

  fetch_all_products: "products/",
  create_product: "products/create",
  edit_product: "products/edit",
  delete_product_using_products_id: "products/delete", //useParams /:product_id
  fetch_related_products: "products/category", //useParams /:category

  remove_cart_item: "cart/remove-cart-item", //useParams /:Id
  fetch_cart_items: "cart/get-cart-items",
  add_to_cart: "cart/add-to-cart",

  fetch_user_address: "user/get-user-and-user-address",
  edit_profile: "user/edit-profile",
  reset_password: "user/reset-password",
  delete_address: "user/delete-address", //useParams /:address_id

  accept_payment: "transactions/accept-payment",
  fetch_uncompleted_transactions: "transactions/getUncompleted-payment",
  confirm_payment: "transactions/confirm-payment",
  fetch_all_orders: "transactions/fetch-all-orders",
  fetch_order_by_userId: "transactions/fetch-order-by-userId",
  fetch_customer_and_order_using_orderId:
    "transactions/fetch-customer-and-orderDetails", //useParams /:order_id
  fetch_order_products: "transactions/fetch-order-and-products",
  delete_order: "transactions/delete-order", //useParams /:order_id
};
// "get-products-by-userId";
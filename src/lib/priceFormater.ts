export const formatPrice = (price: string | undefined) => {
  if(price) {
    const productPrice = price
    return Number(productPrice).toLocaleString("en-US", {
      style: "currency",
      currency: "NGN",
    });
  }
};

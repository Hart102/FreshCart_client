import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { dateOptions, imageUrl } from "@/lib";
import { CustomerOrderType } from "@/types/index";
import instance from "@/api";
import { showAlert } from "@/util/alert";

export type ModalTemplateType = {
  [key: string]: JSX.Element;
  responseModal: JSX.Element;
};

export default function SingleOrder() {
  const location = useLocation();
  const navigation = useNavigate();
  const [orderDetails, setOrderDetails] = useState<CustomerOrderType>();
  const [orders, setOrders] = useState<CustomerOrderType[]>([]);

  const FetchData = useCallback(async () => {
    const { data } = await instance.get(
      `/transactions/fetch-customer-and-orderDetails/${location.state}`
    );
    if (!data.isError) {
      setOrderDetails(data.payload);
      const request = await instance.post(
        "/transactions/fetch-order-and-products",
        {
          userId: data.payload.user_id,
          orderId: data.payload.transaction_reference,
        }
      );
      const response = await request.data;
      setOrders(response.payload);
    } else {
      showAlert("Error", data?.message, "error");
    }
  }, [location.state]);

  const totalPrice = () => {
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      const price = parseFloat(orders[i].total_price.replace(/[^0-9.-]+/g, ""));
      total += price;
    }
    return total;
  };
  const grandTotal = `NGN ${totalPrice()}`;
  useEffect(() => {
    if (location.state == null) {
      navigation("/");
    }
    FetchData();
  }, [location.state, navigation, FetchData]);

  return (
    <>
      <div className="w-full flex flex-col gap-8 py-8">
        <div className="flex gap-2 items-baseline">
          <p className="text-2xl font-semibold">Order</p>
          <span
            className={`capitalize text-sm px-2 rounded ${
              orders[0]?.payment_status == "success"
                ? "bg-deep-green-50"
                : "bg-orange-200"
            }`}
          >
            {orders[0]?.payment_status}
          </span>
        </div>
        {orderDetails && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border rounded flex flex-col gap-2 p-4">
                <p className="text-xl font-semibold">Customer Details</p>
                <div className="flex flex-col gap-1">
                  <p className="capitaize">
                    {orderDetails?.firstname} {orderDetails?.lastname}
                  </p>
                  <p>{orderDetails?.email}</p>
                  <Link to="" className="text-deep-blue-100">
                    View profile
                  </Link>
                </div>
              </div>
              <div className="border rounded flex flex-col gap-2 p-4">
                <p className="text-xl font-semibold">Shipping Address</p>
                <div className="flex flex-col gap-1 capitalize">
                  <p>{orderDetails?.address_line}</p>
                  <p>
                    {orderDetails?.city}, {orderDetails?.state}
                  </p>
                  <p>{orderDetails?.country}</p>
                  <p>Contact No: {orderDetails?.phone_number}</p>
                  <p>Zipe Code: {orderDetails?.zipe_code}</p>
                </div>
              </div>
              <div className="border rounded flex flex-col gap-2 p-4">
                <p className="text-xl font-semibold">Order Details</p>
                <div className="flex flex-col gap-1">
                  <p>Order ID: {orderDetails?.transaction_reference}</p>
                  <p>
                    Order Date:{" "}
                    {new Date(orderDetails?.createdAt).toLocaleDateString(
                      "en-US",
                      dateOptions
                    )}
                  </p>
                  <p>Order Total: {orderDetails?.total_price}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="">
                <Table
                  classNames={{
                    base: "text-center capitalize overflow-x-scroll md:overflow-x-hidden",
                    th: "bg-dark-gray-200",
                    tbody: "py-4 bg-white text-sm",
                  }}
                >
                  <TableHeader>
                    <TableColumn>
                      <div className="text-start">
                        <b>Basic Info</b>
                      </div>
                    </TableColumn>
                    <TableColumn>Oder Id</TableColumn>
                    <TableColumn>Customer</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Quantity</TableColumn>
                    <TableColumn>Total</TableColumn>
                  </TableHeader>
                  {orders ? (
                    <TableBody>
                      {orders.map((order, index) => (
                        <TableRow key={index} className="hover:bg-deep-gray-50">
                          <TableCell>
                            <div className="md:flex items-center gap-4">
                              <div className="md:flex md:items-center gap-4">
                                <Image
                                  src={imageUrl(order?.images[0])}
                                  className="hidden md:block"
                                  classNames={{
                                    img: "h-[50px] w-[50px]",
                                  }}
                                />
                                {order?.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{order?.transaction_reference}</TableCell>
                          <TableCell>{orderDetails?.firstname}</TableCell>
                          <TableCell>
                            {new Date(order?.createdAt).toLocaleDateString(
                              "en-US",
                              dateOptions
                            )}
                          </TableCell>
                          <TableCell>{order?.demanded_quantity}</TableCell>
                          <TableCell>{order?.total_price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <TableBody emptyContent={"No rows to display."}>
                      {[]}
                    </TableBody>
                  )}
                </Table>
              </div>
              <div className="w-full flex justify-end border-t pt-5 px-4 md:px-8">
                <div className="w-full md:w-1/3 flex flex-col gap-5">
                  <div className="flex justify-between font-semibold">
                    <p>Grand Total :</p>
                    <p>{grandTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

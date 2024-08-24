import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageUrl, dateOptions } from "@/lib";
import { OrderType } from "@/types/index";
import { routes } from "@/routes/route";
import instance from "@/api";
import { showAlert } from "@/lib/alert";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/modal_actions";
import { ConfirmationModal, Loader } from "@/components/Templates";
import { BiSearch } from "react-icons/bi";

export default function Orders() {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [index, setIndex] = useState<number>(0);

  const searchResult = useMemo(() => {
    if (orders?.length > 0) {
      return orders.filter((order) => {
        return (
          order.transaction_reference
            .toString()
            .toLocaleLowerCase()
            .includes(searchString.toLocaleLowerCase()) ||
          order.firstname
            .toString()
            .toLocaleLowerCase()
            .includes(searchString.toLocaleLowerCase())
        );
      });
    } else {
      return [];
    }
  }, [orders, searchString]);

  useEffect(() => {
    FetchOrders();
  }, []);

  const FetchOrders = async () => {
    const { data } = await instance.get("/transactions/fetch-order-by-userId");
    if (data.error) {
      showAlert("Error", data?.message, "error");
    } else {
      setOrders(data.payload);
    }
  };

  const DeleteOrder = async () => {
    dispatch(openModal(<Loader />, "md"));
    const { data } = await instance.delete(
      `/transactions/delete-order/${orders[index]._id}`
    );
    if (data.isError) {
      showAlert("Error", data?.message, "error");
    } else {
      orders.splice(index, 1);
      setOrders([...orders]);
      showAlert("Success", "Order deleted successfully", "success");
    }
  };

  const handleDeletemodal = (index: number) => {
    setIndex(index);
    dispatch(
      openModal(
        <ConfirmationModal
          message="Are you sure "
          onContinue={() => DeleteOrder()}
        />,
        "md"
      )
    );
  };

  const ViewOrder = (id: string) =>
    navigation(routes.user_single_order, { state: id });

  return (
    <>
      <div className="bg-white text-dark-gray-100 flex flex-col gap-4">
        <form className="flex w-1/2 items-center gap-2 md:ml-4">
          <Input
            size="sm"
            type="search"
            startContent={
              <BiSearch
                size={25}
                className="bg-white h-full pl-2 rounded-l-lg"
              />
            }
            placeholder="Search by Name or order Id"
            classNames={{
              base: "h-10 text-sm outline-0 border rounded-lg",
              mainWrapper: "h-full hover:bg-whites",
              input:
                "text-small focus:bg-white bg-white w-full rounded-r-lg px-3",
              inputWrapper: "h-full font-normal px-0",
            }}
            style={{ outline: "0" }}
            onValueChange={setSearchString}
          />
        </form>
        <Table
          shadow="none"
          classNames={{
            base: "text-center",
            th: "capitalize bg-dark-gray-200",
            tbody: "capitalize py-4 text-sm",
          }}
        >
          <TableHeader>
            <TableColumn>
              <div className="text-start">Basic Info</div>
            </TableColumn>
            <TableColumn>order id</TableColumn>
            <TableColumn>payment status</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          {searchResult && searchResult?.length > 0 ? (
            <TableBody>
              {searchResult?.map((order, index) => (
                <TableRow key={order?._id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image
                        src={imageUrl(order?.images[0])}
                        classNames={{ img: "h-[50px] w-[50px]" }}
                      />
                      {order?.name}
                    </div>
                  </TableCell>
                  <TableCell>{order?.transaction_reference}</TableCell>
                  <TableCell
                    className={
                      order?.payment_status == "success"
                        ? "text-deep-blue-100"
                        : "text-deep-red-100"
                    }
                  >
                    {order?.payment_status}
                  </TableCell>
                  <TableCell>
                    {new Date(order?.createdAt).toLocaleDateString(
                      "en-US",
                      dateOptions
                    )}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger className="cursor-pointer">
                        ...
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Dynamic Actions"
                        className="z-10 bg-white text-sm"
                      >
                        <DropdownItem
                          className="py-1 my-1 rounded hover:bg-deep-blue-100 hover:text-white"
                          onClick={() => ViewOrder(order?._id)}
                        >
                          View Order
                        </DropdownItem>
                        <DropdownItem
                          className="py-1 my-1 rounded hover:bg-deep-blue-100 hover:text-white"
                          onClick={() => handleDeletemodal(index)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
          )}
        </Table>
      </div>
    </>
  );
}

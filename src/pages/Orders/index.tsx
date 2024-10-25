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
import {  useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { imageUrl, dateOptions } from "@/lib";
import { OrderType } from "@/types/index";
import { routes } from "@/routes/route";
// import instance from "@/api";
// import { useDispatch } from "react-redux";
// import { closeModal, openModal } from "@/redux/modal_actions";
// import { ConfirmationModal } from "@/components/Templates";
// import { showAlert } from "@/lib/alert";

export default function Orders() {
  const navigation = useNavigate();
  // const dispatch = useDispatch();
  const [orders] = useState<OrderType[]>([]);
  const [searchString, setSearchString] = useState<string>("");

  const searchResult = useMemo(() => {
    if (orders.length > 0) {
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
      return orders;
    }
  }, [orders, searchString]);





  // const DeleteOrder = async (index: number) => {
  //   const { data } = await instance.delete(
  //     `/transactions/delete-order/${orders[index]._id}`
  //   );
  //   dispatch(closeModal());
  //   if (data.error) {
  //     showAlert("Error", data?.message, "error");
  //   } else {
  //     orders.splice(index, 1);
  //     setOrders([...orders]);
  //     showAlert("Success", data?.message, "success");
  //   }
  // };

  // const openDeleteModal = (index: number) => {
  //   dispatch(
  //     openModal(
  //       <ConfirmationModal
  //         onContinue={() => DeleteOrder(index)}
  //         message="Are you sure you want to delete this ?"
  //       />,
  //       "md"
  //     )
  //   );
  // };
  const ViewOrder = (id: string) =>
    navigation(routes.dashboard_single_order, { state: id });

  return (
    <>
      <div className="flex flex-col gap-4">
        <form className="w-full md:w-1/2 px-4">
          <Input
            size="sm"
            type="search"
            placeholder="Search category by name"
            classNames={{
              base: "h-10 text-sm outline-0 border rounded-lg",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal hover:border-0",
            }}
            style={{ outline: "0" }}
            onValueChange={setSearchString}
          />
        </form>

        <Table
          classNames={{
            base: "text-center overflow-x-scroll md:overflow-x-auto",
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
          {searchResult && searchResult.length > 0 ? (
            <TableBody>
              {searchResult.map((order, index) => (
                <TableRow
                  key={order?._id}
                  className={`hover:bg-deep-gray-50 cursor-pointer ${
                    index % 2 == 0 ? "bg-white" : "bg-deep-gray-200"
                  }`}
                >
                  <TableCell>
                    <div className="md:flex items-center gap-4">
                      <Image
                        src={imageUrl(order?.images[0])}
                        className="hidden md:block"
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
                          className="py-1 my-1 rounded text-deep-green-100 hover:bg-deep-blue-100 hover:text-white"
                          onClick={() => ViewOrder(order?._id)}
                        >
                          View
                        </DropdownItem>
                        <DropdownItem
                          className="py-1 my-1 rounded text-deep-green-100 hover:bg-deep-blue-100 hover:text-white"
                          // onClick={() => openDeleteModal(index)}
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

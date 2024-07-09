import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { products } from "@/dummy/products";

export default function Customers() {
  const navigation = useNavigate();
  const actions = ["View", "Delete"];

  const viewProduct = (id: string) => navigation(`/dashboard/orders/${id}`);

  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-8">
      <div className="hidden px-4 md:flex items-center justify-between border-b pb-4">
        <div className="flex items-baseline gap-2">
          <b className="text-3xl">150</b>
          <p className="text-neutral-400 text-sm italic">Customers</p>
        </div>

        <form className="flex w-1/2 items-center gap-2 bg-deep-gray-200 rounded px-2">
          <BiSearch size={18} className="text-deep-gray-100" />
          <Input
            size="sm"
            type="search"
            placeholder="tim@gmail.com"
            classNames={{
              base: "h-10 border-l outline-0",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal hover:border-0",
            }}
            style={{ outline: "0" }}
          />
        </form>
      </div>

      <Table
        classNames={{
          base: "text-center",
          th: "text-neutral-400",
          tbody: "capitalize py-4 bg-deep-gray-200 text-sm",
        }}
      >
        <TableHeader>
          <TableColumn>
            <div className="text-start">
              <b>Name</b>
            </div>
          </TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone Number</TableColumn>
          <TableColumn>Spent</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>
              <div className="text-start">Hart C</div>
            </TableCell>

            <TableCell>hartjust@gmail.com</TableCell>
            <TableCell>090 123 456</TableCell>
            <TableCell>$49.00</TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger className="cursor-pointer">
                  ...
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Dynamic Actions"
                  items={actions}
                  className="z-10 bg-white text-sm"
                >
                  {actions.map((action) => (
                    <DropdownItem
                      key={action}
                      color="default"
                      className="py-2 hover:bg-deep-gray-200"
                      onClick={() => viewProduct(products[0].id)}
                    >
                      {action}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

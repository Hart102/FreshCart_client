import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { routes } from "@/routes/route";
import instance from "@/api";
import { closeModal, openModal } from "@/redux/modal_actions";
import { useDispatch } from "react-redux";
import { ConfirmationModal } from "@/components/Templates";
import { showAlert } from "@/util/alert";

type CategoryWithProductCount = {
  _id: number;
  name: string;
  status: string;
  createdAt: Date;
  product_count: number;
};

export default function Categories() {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [categorie, setCategories] = useState<CategoryWithProductCount[]>([]);
  const [query, setQuery] = useState<string>("");

  const FetchCategories = async () => {
    const { data } = await instance.get("/categories/fetch-all-categorie");
    if (!data.isError) {
      setCategories(data.payload);
    }
  };

  const searchResult = useMemo(() => {
    return categorie.filter((cat: CategoryWithProductCount) =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [categorie, query]);

  useEffect(() => {
    FetchCategories();
  }, []);

  const DeleteCategory = async (index: number) => {
    const { data } = await instance.delete(
      `/categories/delete/${categorie[index]?._id}`
    );
    dispatch(closeModal());
    if (data.isError) {
      showAlert("Error", data?.message, "error");
    } else {
      showAlert("Success", data?.message, "success");
      categorie.splice(index, 1);
      setCategories([...categorie]);
    }
  };

  const handleOpenModalForDeletingOfItems = (index: number) => {
    dispatch(
      openModal(
        <ConfirmationModal
          onContinue={() => DeleteCategory(index)}
          message="Are you sure you want to delete this ?"
        />,
        "md"
      )
    );
  };

  const EditCategory = (category: CategoryWithProductCount) =>
    navigation(`${routes.dashboard_create_edit_category}/edit`, {
      state: category,
    });

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-4">
            <input
              type="search"
              placeholder="Type to search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              className="w-full md:w-1/2 text-sm outline-none border rounded bg-transparent p-2"
            />
            <Button
              onClick={() =>
                navigation(`${routes.dashboard_create_edit_category}/create`)
              }
              className="py-1 px-2 rounded-lg flex items-center gap-1 font-semibold bg-deep-blue-100 text-white"
            >
              <BiAddToQueue />
              <p className="text-sm">ADD CATEGORY</p>
            </Button>
          </div>
          <Table
            classNames={{
              base: "text-center overflow-x-scroll md:overflow-x-auto",
              th: "capitalize bg-dark-gray-200",
              tbody: "capitalize bg-white py-4 text-sm",
            }}
          >
            <TableHeader>
              <TableColumn>
                <div className="text-start">
                  <b>Name</b>
                </div>
              </TableColumn>
              <TableColumn>Products</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            {searchResult.length > 0 ? (
              <TableBody>
                {searchResult.map((category, index) => (
                  <TableRow
                    key={category._id}
                    className={`hover:bg-deep-gray-50 cursor-pointer ${
                      index % 2 == 0 ? "bg-white" : "bg-deep-gray-200"
                    }`}
                  >
                    <TableCell>
                      <div className="text-start">{category.name}</div>
                    </TableCell>

                    <TableCell>{category.product_count}</TableCell>
                    <TableCell>
                      <p
                        className={`py-1 rounded ${
                          category.status == "active"
                            ? "text-deep-blue-100"
                            : "text-deep-red-100"
                        }`}
                      >
                        {category.status}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger className="cursor-pointer">
                          ...
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Dynamic Actions"
                          className="z-10 bg-white text-deep-green-200 text-sm"
                        >
                          <DropdownItem
                            color="default"
                            className="py-1 my-1 hover:bg-deep-blue-100 hover:text-white rounded"
                            onClick={() => EditCategory(category)}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            color="default"
                            className="py-1 my-1 hover:bg-deep-blue-100 hover:text-white rounded"
                            onClick={() =>
                              handleOpenModalForDeletingOfItems(index)
                            }
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
      </div>
    </>
  );
}

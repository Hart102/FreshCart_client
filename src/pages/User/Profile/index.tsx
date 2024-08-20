import { useEffect, useState } from "react";
import { UserType } from "@/types/index";
import instance from "@/api";

export default function Profile() {
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await instance.get("/user/");
      if (!data.isError) {
        setUser(data.payload);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      <div
        className="flex flex-col gap-8 text-dark-gray-100 [&_span]:bg-deep-gray-200 
        [&_span]:text-neutral-500 [&_span]:rounded-lg [&_span]:py-3 [&_span]:px-2 [&_span]:capitalize"
      >
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">Personal Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="flex flex-col gap-1">
              <p className="">First name</p>
              <span>
                <p>{user?.firstname}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>Last name</p>
              <span>
                <p>{user?.lastname}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>Email</p>
              <span>
                <p className="lowercase">{user?.email}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>Phone</p>
              <span>
                <p>{user?.addresses[0]?.phone}</p>
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-semibold">Contact Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="flex flex-col gap-1">
              <p>Address Line</p>
              <span>
                <p>{user?.addresses[0]?.address_line}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>City</p>
              <span>
                <p>{user?.addresses[0]?.city}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>State</p>
              <span>
                <p>{user?.addresses[0]?.state}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>Country</p>
              <span>
                <p>{user?.addresses[0]?.country}</p>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p>Postal Code</p>
              <span>
                <p>{user?.addresses[0]?.zipcode}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

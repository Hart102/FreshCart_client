import { Avatar, Badge } from "@nextui-org/react";
import { BiBell, BiMenuAltLeft } from "react-icons/bi";

export default function Header({ onclick }: { onclick: () => void }) {
  return (
    <nav className="px-5 sticky top-0 py-3 z-20 bg-white">
      <div className="container mx-auto flex justify-between md:justify-end items-center">
        <div className="flex justify-end md:hidden">
          <BiMenuAltLeft size={23} onClick={onclick} />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-start">
            <BiBell size={20} />
            <div className="rounded-full bg-red-500 text-white flex items-center justify-center h-[10px] w-[10px] -mt-[4px] -ml-[8px]"></div>
          </div>
          <div>
            <Badge size="sm">
              <Avatar
                isBordered
                radius="full"
                classNames={{ img: "rounded-full" }}
                src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
              />
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}

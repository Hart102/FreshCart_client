import { Image } from "@nextui-org/react";
import LoaderImage from "@/assets/ezgif.com-effects.gif";

export default function Loader() {
  return (
    <div className="flex justify-center items-center w-screen h-[50vh]">
      <Image width={300} src={LoaderImage} />
    </div>
  );
}
// https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif

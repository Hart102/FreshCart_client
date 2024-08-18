import { Image } from "@nextui-org/react";
import LoadingGif from "@/assets/loading.gif";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-3">
      <Image src={LoadingGif} width={70} className="mx-auto" />
      <p>Please wait</p>
    </div>
  );
}

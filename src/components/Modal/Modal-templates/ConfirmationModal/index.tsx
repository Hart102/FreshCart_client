import { Button } from "@nextui-org/react";

export default function ConfirmationModal({
  message,
  onCancle,
  onContinue,
}: {
  message: string;
  onCancle?: () => void;
  onContinue?: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl text-center">Confirm</h2>
        <p className="first-letter:capitalize text-xl">{message}</p>
      </div>
      <div className="flex justify-around pt-5">
        <Button
          onClick={onContinue}
          className="border rounded-lg px-5 py-0 hover:bg-deep-blue-100 hover:text-white"
        >
          Yes
        </Button>
        <Button
          onPress={onCancle}
          className="border rounded-lg px-5 py-0 hover:bg-deep-blue-100 hover:text-white"
        >
          No
        </Button>
      </div>
    </>
  );
}

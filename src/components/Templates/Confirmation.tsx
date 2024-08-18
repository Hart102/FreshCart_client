import { Button } from "@nextui-org/react";
import { closeModal } from "@/redux/modal_actions";
import { useDispatch } from "react-redux";

export default function ConfirmationModal({
  message,
  onContinue,
}: {
  message: string;
  onContinue?: () => void;
}) {
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl text-center">Confirm</h2>
        <p className="first-letter:capitalize">{message}</p>
      </div>
      <div className="flex justify-around pt-5">
        <Button
          onPress={() => dispatch(closeModal())}
          className="border rounded-lg px-5 py-0 bg-transparent hover:border-deep-blue-100"
        >
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          className="border rounded-lg px-5 py-0 bg-transparent hover:border-deep-blue-100"
        >
          Continue
        </Button>
      </div>
    </>
  );
}

import { FaTimes, FaCheckDouble } from "react-icons/fa";

export default function ResponseModal({
  isError,
  message,
}: {
  isError: boolean;
  message: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {!isError ? (
        <FaCheckDouble
          size={60}
          className="text-green-500 border border-green-500 rounded-full p-2 mx-auto"
        />
      ) : (
        <FaTimes
          size={60}
          className="text-red-500 border border-red-500 rounded-full p-2 mx-auto"
        />
      )}
      <p className="text-neutral-5001 first-letter:capitalize text-xl">
        {message}
      </p>
    </div>
  );
}

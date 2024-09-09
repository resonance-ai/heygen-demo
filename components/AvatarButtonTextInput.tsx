import { Input, Spinner, Tooltip, Button } from "@nextui-org/react";
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function AvatarButtonTextInput({
  input,
  onSubmit,
  setInput,
  endContent,
  disabled = false,
  loading = false,
}: StreamingAvatarTextInputProps) {
  function handleSubmit() {
    if (input.trim() === "") {
      return;
    }
    onSubmit();
    setInput("");
  }

  return (

    <Button
      type="submit"
      className="focus:outline-none"
      onClick={handleSubmit}
      // onKeyDown={(e) => {
      //   if (e.key === "Enter") {
      //     handleSubmit();
      //   }
      // }}
      // onValueChange={setInput}
      isDisabled={disabled}
    >
      {input}
    </Button>
    // <Input
    //   endContent={
    //     <div className="flex flex-row items-center h-full">
    //       {endContent}
    //       <Tooltip content="Send message">
    //         {loading ? (
    //           <Spinner
    //             className="text-indigo-300 hover:text-indigo-200"
    //             size="sm"
    //             color="default"
    //           />
    //         ) : (
    //           <button
    //             type="submit"
    //             className="focus:outline-none"
    //             onClick={handleSubmit}
    //           >
    //             <PaperPlaneRight
    //               className={clsx(
    //                 "text-indigo-300 hover:text-indigo-200",
    //                 disabled && "opacity-50"
    //               )}
    //               size={24}
    //             />
    //           </button>
    //         )}
    //       </Tooltip>
    //     </div>
    //   }
    //   label={label}
    //   placeholder={placeholder}
    //   size="sm"
    //   value={input}
    //   onKeyDown={(e) => {
    //     if (e.key === "Enter") {
    //       handleSubmit();
    //     }
    //   }}
    //   onValueChange={setInput}
    //   isDisabled={disabled}
    // />
  );
}

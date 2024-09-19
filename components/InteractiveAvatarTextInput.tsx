import { Input, Spinner, Tooltip } from "@nextui-org/react";
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";

interface StreamingAvatarTextInputProps {
  label: string;
  placeholder: string;
  input: string;
  onSubmit: () => void;
  setInput: (value: string) => void;
  endContent?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export default function InteractiveAvatarTextInput({
  label,
  placeholder,
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

  function printConsole() {
    // console.log('Input clicked with input:', typeof input);
    console.log('Input.tsx:', setInput);

    setInput("");
  }

  return (
    <Input
      endContent={
        <div className="flex flex-row items-center h-full">
          {endContent}
          <Tooltip content="Send message">
            {loading ? (
              <Spinner
                className="text-indigo-300 hover:text-indigo-200"
                size="sm"
                color="default"
              />
            ) : (
              <button
                type="submit"
                className="focus:outline-none"
                // onClick={handleSubmit}
                onClick={printConsole}
              >
                <PaperPlaneRight
                  className={clsx(
                    "text-indigo-300 hover:text-indigo-200",
                    disabled && "opacity-50"
                  )}
                  size={24}
                />
              </button>
            )}
          </Tooltip>
          <div>input : {input}</div>
        </div>
      }
      label={label}
      placeholder={placeholder}
      size="sm"
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          // handleSubmit();
          printConsole();
        }
      }}
      onValueChange={setInput} //텍스트박스를 바꿀때마다 동ㅏ됨, setinput으로 이용해서 버튼 내용을 setinput에 넣기
      isDisabled={disabled}
    />
  );
}

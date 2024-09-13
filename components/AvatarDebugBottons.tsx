import { Input, Spinner, Tooltip, Button } from "@nextui-org/react";
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";

import StreamingAvatar, {AvatarQuality, StreamingEvents} from "@heygen/streaming-avatar";
import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import handleInterrupt from "./InteractiveAvatar";
import endSession from "./InteractiveAvatar";
import avatar from "./InteractiveAvatar";
import data from "./InteractiveAvatar";
import setStream from "./InteractiveAvatar";
import setDebug from "./InteractiveAvatar";

interface AvatarDebugBottonsProps {
    handleInterrupt: Promise<void>,
    endSession: Promise<void>,
}

export default function AvatarDebugBottons({
    

}: AvatarDebugBottonsProps) {

    // async function handleInterrupt() {
    //     if (!avatar.current) {
    //       setDebug("Avatar API not initialized");
    
    //       return;
    //     }
    //     await avatar.current
    //       .interrupt({ sessionId: data?.session_id! })
    //       .catch((e) => {
    //         setDebug(e.message);
    //       });
    //   }
    //   async function endSession() {
    //     if (!avatar.current) {
    //       setDebug("Avatar API not initialized");
    
    //       return;
    //     }
    //     await avatar.current.stopAvatar({
    //       sessionId: data?.session_id!,
    //     });
    //     setStream(undefined);
    //   }

  return (
    <div className="flex flex-col gap-2 absolute bottom-3 right-3">
        <Button
            size="md"
            onClick={handleInterrupt}
            className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
            variant="shadow"
        >
            Interrupt task
        </Button>
        <Button
            size="md"
            onClick={endSession}
            className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
            variant="shadow"
        >
            End session
        </Button>
    </div>
  );
}

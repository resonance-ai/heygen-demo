import { Input, Spinner, Tooltip, Button } from "@nextui-org/react";
import { Airplane, ArrowRight, PaperPlaneRight } from "@phosphor-icons/react";
import clsx from "clsx";
import React from 'react';


interface AvatarDebugConsoleProps {
  debug?: string;
}

const AvatarDebugConsole: React.FC<AvatarDebugConsoleProps> = ({ debug }) => {

  return (
    <p className="font-mono text-right">
        <span className="font-bold">Console:</span>
        <br />
        {debug}
      </p>

  );
}

export default AvatarDebugConsole;

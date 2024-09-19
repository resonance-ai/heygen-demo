import type { StartAvatarResponse } from "@heygen/streaming-avatar";
import StreamingAvatar, {AvatarQuality, StreamingEvents} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { usePrevious } from 'ahooks'
import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";
import AvatarButtonTextInput from "./AvatarButtonTextInput";
import AvatarDebugConsole from "./AvatarDebugConsole";
import AvatarDebugBottons from "./AvatarDebugBottons";
import { AVATARS } from "@/app/lib/constants";
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

export default function InteractiveAvatar() {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [knowledgeId, setKnowledgeId] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [data, setData] = useState<StartAvatarResponse>();
  const [text, setText] = useState<string>("");
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  // useEffect(() => {
  //   console.log('initializing')
  //   if (!isLoadingSession) {
  //     startSession();
  //   }

  // }, [])

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  async function startSession() {
    console.log ("[setAvatarId Before Avatar ID] : ", avatarId);
    // setAvatarId("Anna_public_3_20240108")
    setIsLoadingSession(true);
    console.log ("[setAvatarId After Avatar ID] : ", avatarId);
    const newToken = await fetchAccessToken();
    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    try {
      console.log ("[createStartAvatar Before Avatar ID] : ", avatarId);
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: "Eric_public_pro2_20230608",
        knowledgeId: knowledgeId,
      });
      console.log ("[createStartAvatar After Avatar ID] : ", avatarId);

      setData(res);
      avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
        console.log('Stream ready:', event.detail);
        setStream(event.detail);
      });
    } catch (error) {
      console.error("Error starting avatar session:", error);
    } finally {
      setIsLoadingSession(false);
    }
    console.log ("[End Of startSession Function Avatar ID] : ", avatarId);
  }
  async function handleSpeak(chatMessage: string) {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      // .speak({ text: text, sessionId: data?.session_id! })
      .speak({ text: chatMessage, sessionId: data?.session_id! })
      .catch((e) => {
        setDebug(e.message);
      });
    console.log('[avatar.current.speak] Print text to console:', text);
    console.log ("[Check Avatar ID in avatar.current.speak] : ", avatarId);
    setIsLoadingRepeat(false);
  }
  async function handleInterrupt() {
    console.log ("[Check Avatar ID in handleInterrupt] : ", avatarId);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current
      .interrupt({ sessionId: data?.session_id! })
      .catch((e) => {
        setDebug(e.message);
      });
  }
  async function endSession() {
    console.log ("[Check Avatar ID in endSession] : ", avatarId);
    if (!avatar.current) {
      setDebug("Avatar API not initialized");

      return;
    }
    await avatar.current.stopAvatar({
      sessionId: data?.session_id!,
    });
    setStream(undefined);
  }
  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening({ sessionId: data?.session_id! });
    } else if (previousText && !text) {
      avatar?.current?.stopListening({ sessionId: data?.session_id! });
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
        setDebug("Playing");
        console.log ("[Check Avatar ID in stream] : ", avatarId);
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardBody className="h-[900px] flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-[900px] w-[800px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <track kind="captions" />
              </video>
              
              <div className="absolute bottom-40 bg-opacity-0">           
                <CardFooter className="flex flex-row justify-center gap-3 bg-opacity-0">
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                </CardFooter>
                <CardFooter className="flex flex-row justify-center gap-3 bg-opacity-0">
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                  <AvatarButtonTextInput
                    input={"How are you?"} 
                    onSubmit={() => handleSpeak("How are you?")}
                    setInput={setText}
                    disabled={!stream}
                    loading={isLoadingRepeat}
                  />
                </CardFooter>
              </div>

              {/* <AvatarDebugBottons/> */}

              {/* <div className="flex flex-col gap-2 absolute bottom-3 right-3">
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
              </div> */}



            </div>
          ) : 
          !isLoadingSession ? (
          
          <div className="flex justify-center items-center">
            <Button 
              onClick={startSession}
              // className="bg-gradient-to-tr text-white rounded-lg"
              className="bg-blue-500 text-white px-7 py-8 rounded-lg text-5xl"
              variant="shadow"
            >START!</Button>
          </div>


          //   <div className="h-full justify-center items-center flex flex-col gap-8 w-[500px] self-center">
          //     <div className="flex flex-col gap-2 w-full">
          //       <p className="text-sm font-medium leading-none">
          //         Custom Knowledge ID (optional)
          //       </p>
          //       <Input
          //         value={knowledgeId}
          //         onChange={(e) => setKnowledgeId(e.target.value)}
          //         placeholder="Enter a custom knowledge ID"
          //       />
          //       <p className="text-sm font-medium leading-none">
          //         Custom Avatar ID (optional)
          //       </p>
          //       <Input
          //         value={avatarId}
          //         onChange={(e) => setAvatarId(e.target.value)}
          //         placeholder="Enter a custom avatar ID"
          //       />
          //       <Select
          //         placeholder="Or select one from these example avatars"
          //         size="md"
          //         onChange={(e) => {
          //           setAvatarId(e.target.value);
          //         }}
          //       >
          //         {AVATARS.map((avatar) => (
          //           <SelectItem
          //             key={avatar.avatar_id}
          //             textValue={avatar.avatar_id}
          //           >
          //             {avatar.name}
          //           </SelectItem>
          //         ))}
          //       </Select>
          //     </div>
          //     <Button
          //       size="md"
          //       onClick={startSession}
          //       className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
          //       variant="shadow"
          //     >
          //       Start session
          //     </Button>
          //   </div>
          
          ) : 
          (
            <Spinner size="lg" color="default" />
          )}
        </CardBody>
      </Card>

      {/* <AvatarDebugConsole debug={debug}/> */}
      {/* <p className="font-mono text-right">
        <span className="font-bold">Console:</span>
        <br />
        {debug}
      </p> */}
    </div>
  );
}
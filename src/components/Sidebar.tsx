"use client";

import Link from "next/link";
import React from "react";
import {
  CheckCircle,
  Lock,
  Circle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { SidebarProps } from "@/types/models";
import { Box, Flex, Heading } from "@radix-ui/themes";
import SidebarIcon from "./SidebarIcon";

//moved this logic to SibebarIcon.tsx
// const getStatusIcon = (progress: SidebarProps["sitePages"][0]["progress"]) => {
//   switch (progress) {
//     case "LOCKED":
//       return <Lock className="text-gray-400 mr-2" size={18} />;
//     case "UNSTARTEDREQUIRED":
//     case "UNSTARTEDOPTIONAL":
//       return <Circle className="text-gray-400 mr-2" size={18} />;
//     case "STARTEDREQUIRED":
//     case "STARTEDOPTIONAL":
//       return <PlayCircle className="text-yellow-500 mr-2" size={18} />;
//     case "COMPLETE":
//       return <CheckCircle className="text-green-500 mr-2" size={18} />;
//     default:
//       return <PauseCircle className="text-gray-400 mr-2" size={18} />;
//   }
// };

const Sidebar: React.FC<SidebarProps> = ({
  surveyId,
  sitePages,
  currentPageId,
}) => {
  return (
    <Box
      style={{ backgroundColor: "white" }}
      p={"4"}
      width={"auto"}
      height={"100%"}
    >
      {/* <h2 className="text-xl font-bold mb-4">Progress</h2> */}
      <ul>
        <li>
          <Link
            href={`/dashboard`}
            className="flex flex-col items-center p-2 rounded-lg mb-2 cursor-pointer"
          >
            <Heading className="text-[#082B76]">Home</Heading>
            <SidebarIcon progress={"STARTEDOPTIONAL"} />
          </Link>
        </li>
        {/* <Separator color="blue" size={"4"}/> */}
        <Flex className="border border-[#082B76] w-1/2 mx-auto my-6" />
        {sitePages.map((page) => (
          <li
            key={page.id}
            className={`p-2 rounded-lg cursor-pointer text-[#082B76] transition-colors ${
              currentPageId === String(page.id)
                ? "bg-blue-600 font-semibold text-white"
                : ""
            }`}
          >
            {
              // if locked prevent user from going to that page.
              // Note: when user clicks 'save' or 'save & confirm', user is taken to next section, but that section isnt unlocked until saved
              // Note: basic information or at least 1st pg is locked on start
              page.progress === "LOCKED" ? (
                <Box className=" flex flex-col items-center w-full">
                  {page.title}
                  {/* page.id start count at 1 so have to -2 to get previous, alternative is use index parameter and -1 from it */}
                  <SidebarIcon
                    prevPage={sitePages[page.id - 2]?.title}
                    isLast={page.id == sitePages.length}
                    progress={page.progress}
                  />
                </Box>
              ) : (
                <Link
                  href={`/survey/${surveyId}/page/${page.id}`}
                  className=" flex flex-col items-center w-full"
                >
                  {page.title}
                  <SidebarIcon progress={page.progress} />
                </Link>
              )
            }

            {/* {getStatusIcon(page.progress)} */}
          </li>
        ))}
        {/* testing */}

        {/* <li className="p-2 flex text-black items-center">
          <span>UNSTARTEDREQUIRED</span> <SidebarIcon progress="UNSTARTEDREQUIRED" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>STARTEDREQUIRED</span> <SidebarIcon progress="STARTEDREQUIRED" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>UNSTARTEDOPTIONAL</span> <SidebarIcon progress="UNSTARTEDOPTIONAL" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>STARTEDOPTIONAL</span> <SidebarIcon progress="STARTEDOPTIONAL" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>COMPLETE</span> <SidebarIcon progress="COMPLETE" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>LOCKED</span> <SidebarIcon progress="LOCKED" />
        </li>
        <li className="p-2 flex text-black items-center">
          <span>LOCKED && Last</span> <SidebarIcon isLast={true} progress="LOCKED" />
        </li> */}
      </ul>
    </Box>
  );
};

export default Sidebar;

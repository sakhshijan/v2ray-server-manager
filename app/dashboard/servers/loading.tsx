import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className={"flex-1 space-y-6 flex flex-col w-full max-w-3xl mx-auto"}>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <Skeleton className="h-4 w-[100px] ml-auto" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <Skeleton className="col-span-6 h-32"/>
        <Skeleton className="col-span-6 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
        <Skeleton className="col-span-4 h-32"/>
      </div>
    </div>
  );
};

export default Loading;

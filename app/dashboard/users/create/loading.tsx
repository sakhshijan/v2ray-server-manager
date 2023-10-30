import React from "react";
import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;

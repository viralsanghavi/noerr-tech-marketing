import React from "react";

const CommonContainer = ({children}: any) => {
  return (
    <div className="px-8 xl:px-0 container mx-auto w-full h-full">
      <>{children}</>
    </div>
  );
};

export default CommonContainer;

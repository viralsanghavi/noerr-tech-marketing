import React from "react";

const MainLayout = ({children}) => {
  return (
    <div className="mx-auto px-20 sm:px-8 lg:px-32 max-w-screen-2xl">
      {children}
    </div>
  );
};

export default MainLayout;

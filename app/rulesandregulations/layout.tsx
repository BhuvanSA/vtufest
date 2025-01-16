import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className=" my-10 py-[1rem]">
      {children}
    </div>
  );
};

export default Layout;

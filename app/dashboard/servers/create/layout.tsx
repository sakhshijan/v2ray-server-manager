import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Create new server",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;

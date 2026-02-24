/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSelector } from "react-redux";

const TestPage = () => {
  const currentUser = useSelector((state: any) => state.auth.user);

  console.log({ currentUser });
  return <div>page</div>;
};

export default TestPage;

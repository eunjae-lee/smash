import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export function Home() {
  const history = useHistory();
  useEffect(() => {
    setTimeout(() => {
      history.push("/list");
    }, 2000);
  }, []);
  return (
    <div className="flex justify-center items-center h-screen bg-orange-100">
      <p className="text-5xl text-orange-900">Ready to Smash?!</p>
    </div>
  );
}

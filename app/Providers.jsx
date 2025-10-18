"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Navbar from "@/components/Navbar";


export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {/* Navbar */}
      <header className='sticky top-0 z-10 left-0'>
        <div className="bg-base-100 shadow-sm">
          <Navbar />
        </div>
      </header>
      {children}
    </Provider>
  );
}

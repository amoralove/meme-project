"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper/92 backdrop-blur-sm border-b-3 border-pencil">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link
          href="/"
          className="font-heading text-[1.7rem] font-bold text-forest flex items-center gap-1"
        >
          <span className="text-xl">&#x1f43e;</span> wescue
        </Link>

        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-4 md:gap-7 absolute md:relative top-[72px] md:top-0 left-0 right-0 md:left-auto md:right-auto bg-paper md:bg-transparent border-b-3 md:border-b-0 border-pencil p-5 md:p-0`}
        >
          <Link
            href="/#how-it-works"
            className="text-lg text-pencil hover:text-forest transition-colors"
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/dogs"
            className="text-lg text-pencil hover:text-forest transition-colors"
            onClick={() => setOpen(false)}
          >
            Browse Dogs
          </Link>
          <Link
            href="/#shelters"
            className="text-lg text-pencil hover:text-forest transition-colors"
            onClick={() => setOpen(false)}
          >
            For Shelters
          </Link>
          <Link
            href="/chat"
            className="btn-sketchy btn-primary text-base px-5 py-2"
            onClick={() => setOpen(false)}
          >
            Start Matching!
          </Link>
        </div>

        <button
          className="flex md:hidden flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="block w-[26px] h-[3px] bg-pencil rounded-sm" />
          <span className="block w-[26px] h-[3px] bg-pencil rounded-sm" />
          <span className="block w-[26px] h-[3px] bg-pencil rounded-sm" />
        </button>
      </div>
    </nav>
  );
}

import { bottombarLinks } from "@/constants";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((linkDetails) => {
        const isActive = pathname === linkDetails.route;
        return (
          <Link
            className={` ${
              isActive && "bg-primary-500 rounded-[10px]"
            } flex-center flex-col gap-1 p-3 transition `}
            key={linkDetails.label}
            to={linkDetails.route}
          >
            <img
              src={linkDetails.imgURL}
              alt={linkDetails.label}
              width={20}
              height={20}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{linkDetails.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;

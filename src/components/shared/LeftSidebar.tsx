import { useUserContext } from "@/context/AuthContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const { mutate: signOut } = useSignOutAccountMutation(() =>
    navigate("/sign-in")
  );
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10">
        <div className="flex w-full justify-center">
          <Link
            to="/"
            className="relative mt-5 flex gap-3 items-center justify-center"
          >
            <img
              src="/assets/images/connect-logo.png"
              alt="logo"
              width={100}
              height={36}
              className="absolute z-10 left-4"
            />
            <h2 className="h3-bold md:h2-bold  text-left z-20 w-full font-pacifico">
              Connect
            </h2>
          </Link>
        </div>

        <ul className="flex flex-col gap-3 mt-10">
          {sidebarLinks.map((linkDetails: INavLink) => {
            const isActive = pathname === linkDetails.route;
            return (
              <li
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                key={linkDetails.label}
              >
                <NavLink className="flex gap-4 p-3" to={linkDetails.route}>
                  <img
                    src={linkDetails.imgURL}
                    alt={linkDetails.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {linkDetails.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center">
        <Link
          to={`/profile/${user.id}`}
          className="flex items-center flex-center gap-3"
        >
          <img
            src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
            alt="profile"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.email}</p>
          </div>
        </Link>

        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />{" "}
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;

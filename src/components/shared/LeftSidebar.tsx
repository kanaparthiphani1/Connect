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
        <Link to="/" className="flex gap-3 items-center flex-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

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

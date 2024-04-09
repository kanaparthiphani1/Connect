import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const cookieFallback = localStorage.getItem("cookieFallback");

  const isAuthenticated =
    cookieFallback === "[]" ||
    cookieFallback === null ||
    cookieFallback === undefined
      ? false
      : true;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-image.png"
            alt="logo"
            className="hidden xl:block h-screen w-[50%] object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;

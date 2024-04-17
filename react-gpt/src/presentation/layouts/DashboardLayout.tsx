import { useState } from "react";
import { Outlet } from "react-router-dom";
import { menuRoutes } from "../router/router";
import { SidebarMenuItem } from "../components/";

export const DashboardLayout = () => {
  const [open, setOpen] = useState(true)
  const [token, setToken] = useState("")

  const handleToken = () => {
    setOpen(!open);
    if(!token) return;
    localStorage.setItem('token', token);
    setToken("");
  }

  return (
    <main className="flex flex-row mt-7">
      <nav className="hidden sm:flex flex-col ml-5 w-[370px] min-h-[calc(100vh-3.0rem)] bg-white bg-opacity-10 p-5 rounded-3xl">
        <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent">
          ReactGPT<span className="text-indigo-500">.</span>
        </h1>
        <span className="text-xl">Bienvenido</span>

        {
          open && (
            <div className="flex flex-col">
              <button
                className="text-white bg-blue-500 p-2 rounded-lg mt-5"
                onClick={() => setOpen(false)}
              >
                Add token
              </button>
            </div>
          )
        }

        {/* Modal to insert token */}
        {
          !open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-lg">
                <input
                  type="text"
                  placeholder="Insert token"
                  className="border border-gray-500 p-1 rounded-lg text-black"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                />
                <button
                  className="text-white bg-blue-500 p-2 rounded-lg mt-5 ml-4"
                  onClick={handleToken}
                >
                  Save
                </button>
              </div>
            </div>
          )
        }

        <div className="border-gray-700 border my-3" />

        {/* Opciones del menú */}
        {
          menuRoutes.map(option => (
            <SidebarMenuItem
              key={option.to}
              {...option}
            />
          ))
        }
      </nav>

      <section className="mx-3 sm:mx-20 flex flex-col w-full h-[calc(100vh-50px)]  bg-white bg-opacity-10 p-5 rounded-3xl">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-auto h-full p-1">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
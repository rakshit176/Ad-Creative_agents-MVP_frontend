// @ts-ignore

import { Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType } from "./types/reduxTypes";
import { login, logout } from "./features/user/userSlice";

// Normal imports for Login and Dashboard
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KrutLoader from "./components/KrutLoader";
import toast from "react-hot-toast";

// Lazy load components for other routes
const ProductStudio = lazy(() => import("./pages/ProductStudio"));
const ModelStudio = lazy(() => import("./pages/ModelStudio"));
const AdStudio = lazy(() => import("./pages/AdStudio"));
const Error401 = lazy(() => import("./components/Error401"));
const Error404 = lazy(() => import("./components/Error404"));

function App() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { userData } = useSelector((state: ReduxStateType) => state.user);

  useEffect(() => {
    if (localStorage.getItem("userInfo") && !userData) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      dispatch(login(userInfo));
    }
    //disable below for test purpose --------------------------
    else if (!localStorage.getItem("token") || !localStorage.getItem("userInfo")) {
      dispatch(logout())
      Navigate("/");
    }
    //--------------------------

  }, []);

  return (
    <>
      <Suspense
        fallback={ //loading spinner
          <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            <div className="w-36">
              <KrutLoader />
            </div>
          </div>

        }>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productStudio" element={<ProductStudio />} />
          <Route path="/modelStudio" element={<ModelStudio />} />
          <Route path="/adCreative" element={<AdStudio />} />
          <Route path="/unauthorized" element={<Error401 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

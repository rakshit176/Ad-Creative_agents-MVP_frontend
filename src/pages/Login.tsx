import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo_full from "/images/logo_full.png"
import { useEffect, useState } from "react";
import "../assets/stylesheets/login.css"
import { userLoginAPI } from "../services/APIservice";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/user/userSlice";
import KrutLoaderModal from "../components/KrutLoaderModal";
import { idle, loading } from "../assets/defaultStrings";
import { ReduxStateType } from "../types/reduxTypes";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPswdText, setIsPswdText] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // State to control transitions
  const images = ["/images/login-potrait-1.png", "/images/login-potrait-2.png", "/images/login-potrait-3.png"];
  const background = ["/images/login-background-1.png", "/images/login-background-2.png", "/images/login-background-3.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(idle);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: ReduxStateType) => state.user);


  useEffect(() => {
    const interval = setInterval(() => {
      setNextImageIndex((nextImageIndex + 1) % images.length);
      setTransitioning(true); // Start transition
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setTransitioning(false); // End transition
      }, 1500); // Change image after 2 seconds
    }, 6000); // Switch image every 4 seconds

    return () => clearInterval(interval);
  }, [images, nextImageIndex]);


  const backgroundImageStyle = {
    backgroundColor: 'black',
    backgroundImage: `url(${background[currentImageIndex]})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    // opacity: transitioning ? 0 : 1, 
    transition: "opacity 2s ease-in-out",
  };

  useEffect(() => {
    if (userData) {
      Navigate("/dashboard")
    }
  }, [userData])



  //---------------_ Handle User Login ----------------------------------
  async function handleLogin(e: { preventDefault: () => void; }) {
    e.preventDefault()
    if (!email || !password) toast.error("Please fill in all fields")

    setIsLoading(loading); //loading modal popup
    const response = await userLoginAPI({ email, password });
    // console.log(response)//test

    if (response?.status) {
      // login API call here
      toast.success("Login success");
      dispatch(login(response?.data));
      setTimeout(() => {
        setIsLoading(idle); //loading modal popup
        Navigate("/dashboard");
      }, 1000);
    } else {
      setIsLoading(idle);
    }
  }

  //===============================================================================================================================
  return (
    <div className="flex justify-center items-center min-h-screen" style={backgroundImageStyle}>

      <section className="flex flex-row items-center">

        <div className=' bg-white rounded-xl xl:rounded-r-none mx-auto login-card pt-16'>
          <img src={logo_full} alt="Logo" className="logo mx-auto" />
          <h3 className="my-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ">Welcome Back!</h3>

          <form className="space-y-1" onSubmit={handleLogin}>

            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className="block w-full ps-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" pattern="^(?=.*[@])(?=.*[.]).{5,}$" placeholder="name@email.com" value={email}
              onChange={(input) => setEmail(input.target.value)} />


            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="flex">

              <input id="password" name="password" type={isPswdText ? 'text' : "password"} autoComplete="current-password" required className="block w-full ps-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" placeholder="Password"
                // pattern="^(?=.*[A-Za-z0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-=|]).{6,}$" 
                value={password} onChange={(input) => setPassword(input.target.value)} />

              <span className="material-symbols-outlined text-placeholder absolute my-2 ms-[165px] xl:ms-[300px] opacity-40 cursor-pointer"
                onClick={() => { setPasswordVisible(passwordVisible ? false : true); setIsPswdText(isPswdText ? false : true) }}>
                {passwordVisible ? "visibility_off" : "visibility"}
              </span>
            </div>

            <div className="w-full text-end">
              <p className="text-xs font-normal text-placeholder cursor-pointer my-2">forgot password?</p>
            </div>
            <br />
            <button type="submit" className=" flex w-full justify-center rounded-md bg-violetBg px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violetTxt mt-5">Login</button>

          </form>

        </div>

        <div className="rounded-xl rounded-l-none w-3/5">
          <img src={images[currentImageIndex]} alt="login banner"
            className="w-[605px] h-[489px] hidden xl:block rounded-xl rounded-l-none login-banner"
            style={{ opacity: transitioning ? 0 : 1, transition: "opacity 2s ease-in-out" }} />
        </div>
      </section>

      <Toaster />
      {/* loading spinner */}
      <KrutLoaderModal isLoading={isLoading} />

    </div>
  )
}

export default Login
//===============================================================================================================================

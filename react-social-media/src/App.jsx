import LeftBar from "./components/leftBar/LeftBar";
import NavBar from "./components/navBar/NavBar";
import RightBarNew from "./components/rightBarNew/RightBarNew";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import './style.scss'


// This import is react router dom for navigation to different pages and links that can be linked to 
// the various pages!
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Route,
  Navigate
} from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";

// USE this library as its very good and for instansaces where were need to rerun the fetch api
// For eg: When we post a new post and we want it to instantly display underneath.
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

function App() {

  const {currentUser} = useContext(AuthContext);

  const {darkMode} = useContext(DarkModeContext)
  console.log(darkMode)

  const queryClient = new QueryClient();

  // Using react router dom Outlet to use components since we are going to reuse the left and rightbar
  // and where the outlet is changeable!
  const Layout = () => {
    return(
      <QueryClientProvider client={queryClient}>

        <div className= {`theme-${darkMode? "dark": "light"}`}>
        <NavBar/>
        <div style={{display: 'flex'}}>
            <LeftBar/>
            <div style= {{flex: 6}}>
              <Outlet/>
            </div>
              <RightBarNew/>
            </div>
        </div>
      </QueryClientProvider>
    )
  }

  // To check if user is logged in wrap this with layout so the layout would get rendered
  // if teh check is true.
  const ProtectedRoute = ({children}) => {
    if(!currentUser){
      return <Navigate to = '/login'/>
    }
    return children
  }
  // Using the react router dom to link the pages
  const router = createBrowserRouter([
    {
      path:'/',
      element: <ProtectedRoute><Layout/></ProtectedRoute>,
      children:[
        {
          path:'/',
          element: <Home/>
        },
        {
          path: '/profile/:id',
          element: <Profile/>
        },
      ]
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    }

  ]);

  return(
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

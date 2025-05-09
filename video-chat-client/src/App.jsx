import React from "react";
import VideoChat from "./components/VideoChat";
import { useAuthStore } from "./store/UseAuthStore";
import { useEffect } from "react";
import { Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import LeaderBoard from "./pages/LeaderBoard";
function App() {
   const {authUser, checkAuth, isCheckingAuth } = useAuthStore()
   useEffect(() => {
    checkAuth();
   }, [checkAuth]);
  console.log({authUser});
  if(isCheckingAuth && !authUser)
     return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" /> 
    </div>
  ) 
  return (

    <div>

    <Routes>
      {/* <Route path="/" element={ <Home />}/> */}
      <Route path="/videochat" element={authUser ? <VideoChat /> : <Navigate to="/login" />}/>
      <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />}/>
      {/* <Route path="/dashboard" element={authUser ? <Dashboard/> : <Navigate to="/login" />} /> */}
      <Route path="/login" element={!authUser ?  <LoginPage/> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/lead" element={<LeaderBoard />} />
    </Routes>
       <Toaster  />
  </div>
  
  );
}

export default App;

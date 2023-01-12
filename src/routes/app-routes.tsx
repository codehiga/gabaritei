import { PropsWithChildren, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GabaritoPage, HomePage, Login } from "../components/pages";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children } : PropsWithChildren) => {
  const { loggedIn } = useContext(AuthContext);
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children as JSX.Element;
};

const LogedInRoutes = ({ children } : PropsWithChildren) => {
  const { loggedIn } = useContext(AuthContext);
  console.log(loggedIn)
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }
  return children as JSX.Element;
};

export const AppRoutes = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <LogedInRoutes>
            <Login />
          </LogedInRoutes>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/gabarito/:id" element={
          <ProtectedRoute>
            <GabaritoPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}


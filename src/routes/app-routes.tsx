import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "../components/pages/home-page"

export const AppRoutes = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
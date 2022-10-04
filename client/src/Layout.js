import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScratchProj from "./components/ScratchProj";
import Users from "./components/Users";
import Classes from "./components/Classes";

function Layout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ScratchProj />} />
        <Route path="/users" element={<Users />} />
        <Route path="/classes/:id" element={<Classes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layout;

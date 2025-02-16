import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth, Home, Orders } from "./pages";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <div className="bg-custom-bg text-white h-screen w-screen flex flex-row">
        <Navbar />
        <div className="sm:w-[calc(100%-160px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import { Auth, Home, Orders } from "./pages"

const App = () => {
  return (
    <div className="bg-custom-bg text-white h-screen w-screen">
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/orders" element={<Orders/>} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
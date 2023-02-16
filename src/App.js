import "./App.css";
import Content from "./components/Landing/content";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Formpage from "./pages/Formpage";
import Moments from "./pages/Moments";
import Login from "./pages/Login/Login";
import Signup from "./pages/Register/Register";
import Create from "./pages/Createmoment";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/form" element={<Formpage />} />
            <Route path="/moments" element={<Moments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;

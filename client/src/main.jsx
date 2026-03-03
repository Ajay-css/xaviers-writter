import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { HashRouter, BrowserRouter } from "react-router-dom"
import "katex/dist/katex.min.css";

document.documentElement.classList.add("dark")
document.body.classList.add("font-outfit")

const isElectron = window.location.protocol === "file:";

const Router = isElectron ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
)

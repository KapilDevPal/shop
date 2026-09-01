import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ReturnPolicyPage from "./pages/ReturnPolicyPage.jsx";

/*
  HashRouter is used for GitHub Pages (static hosting) compatibility.
  Routes: /#/ → Home | /#/product/:slug → Product | /#/privacy | /#/contact | /#/refund-policy
*/
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/refund-policy" element={<ReturnPolicyPage />} />
        <Route path="/returns" element={<ReturnPolicyPage />} />
        {/* Catch-all → Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);


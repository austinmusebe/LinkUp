import { Routes, Route } from "react-router-dom";

import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";

import "./App.css";
import Layout from "./components/Layout";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </Layout>
  );
}

export default App;

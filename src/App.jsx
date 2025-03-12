import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../src/routes/Layout";
import Senetors from "./components/senetors/Senetors";
import SaveSenetors from "./components/senetors/SaveSenetors";
import House from "./components/house/House";
import SenetorVote from "./components/vote/senetor/SenetorVote";
import SenetorActivity from "./components/activity/senetor/SenetorActivity";
import HouseActivity from "./components/activity/house/HouseActivity";
import HouseVote from "./components/vote/house/HouseVote";
import Login from "./components/auth/Login";
import PrivateRoute from "../src/routes/PrivateRoute";
import AddVote from "./components/vote/AddVote";
import Term from "./components/term/Term";
import NotFound from "./components/global/NotFound";
import SaveHoues from "./components/house/SaveHoues";
import AddActivity from "./components/activity/AddActivity";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Router basename="/scorecard/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          index
          element={
            token ? <Navigate to="/senator" /> : <Navigate to="/login" />
          }
        />

        <Route
          path="senator"
          element={
            <PrivateRoute>
              <Layout>
                <Senetors />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="add-senator"
          element={
            <PrivateRoute>
              <Layout>
                <SaveSenetors />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="edit-senator/:id"
          element={
            <PrivateRoute>
              <Layout>
                <SaveSenetors />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="house"
          element={
            <PrivateRoute>
              <Layout>
                <House />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="add-house"
          element={
            <PrivateRoute>
              <Layout>
                <SaveHoues />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="edit-house/:id"
          element={
            <PrivateRoute>
              <Layout>
                <SaveHoues />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="senator-vote"
          element={
            <PrivateRoute>
              <Layout>
                <SenetorVote />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="senator-activity"
          element={
            <PrivateRoute>
              <Layout>
                <SenetorActivity />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="house-vote"
          element={
            <PrivateRoute>
              <Layout>
                <HouseVote />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="house-activity"
          element={
            <PrivateRoute>
              <Layout>
                <HouseActivity />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="add-vote"
          element={
            <PrivateRoute>
              <Layout>
                <AddVote />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="edit-vote/:id"
          element={
            <PrivateRoute>
              <Layout>
                <AddVote />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="add-activity"
          element={
            <PrivateRoute>
              <Layout>
                <AddActivity />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="edit-activity/:id"
          element={
            <PrivateRoute>
              <Layout>
                <AddActivity />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="term"
          element={
            <PrivateRoute>
              <Layout>
                <Term />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

        {/* }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;

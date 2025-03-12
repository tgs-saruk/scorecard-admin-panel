import React, { useEffect, useState } from "react";
import Header from "./Header";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import LogoSmall from "../../assets/image/logo-sm.png";
import LogoLight from "../../assets/image/logo-light.png";
import LogoDark from "../../assets/image/logo-dark.png";
import { logout } from "../../redux/slice/loginSlice";
import { useDispatch } from "react-redux";
import { FaHandPaper } from "react-icons/fa";
import { DiTerminal } from "react-icons/di";
// import Icofont from "react-icofont";
import Swal from "sweetalert2";

function Sidebar({ sidebarSize }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
      width: "350px",
      customClass: {
        popup: "small-swal",
        title: "small-title",
        htmlContainer: "small-text",
        icon: "small-icon",
        padding: "small-padding",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout()); // Dispatch the logout action

        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000, // Optional: Auto close after 2 seconds
        });
        navigate("/login");
      }
    });
  };
  return (
    <>
      <div className={`startbar ${sidebarSize} d-print-none`}>
        <div className="brand">
          <NavLink to="/senator" className="logo">
            <span>
              <img src={LogoSmall} alt="logo-small" className="logo-sm" />
            </span>
            <span className="">
              <img
                src={LogoLight}
                alt="logo-large"
                className="logo-lg logo-light"
              />
              <img
                src={LogoDark}
                alt="logo-large"
                className="logo-lg logo-dark"
              />
            </span>
          </NavLink>
        </div>

        <div className="startbar-menu">
          <div
            className={`startbar-${sidebarSize}`}
            id="startbarCollapse"
            data-simplebar
          >
            <div className="d-flex align-items-start flex-column w-100">
              <ul className="navbar-nav mb-auto w-100 navbar-padding">
                {sidebarSize === "default" ? (
                  <li className="menu-label pt-0 mt-0">
                    <small className="label-border">
                      <div className="border_left hidden-xs"></div>
                      <div className="border_right"></div>
                    </small>
                    <span>Main Menu</span>
                  </li>
                ) : null}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#sidebarDashboards"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarDashboards"
                  >
                    <i className="iconoir-home-simple menu-icon"></i>
                    <span>Senate</span>
                  </a>
                  <div className="collapse " id="sidebarDashboards">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/senator"
                        >
                          Senators
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/add-senator"
                        >
                          Add Senator
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#sidebarHouse"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarHouse"
                  >
                    <i className="iconoir-house-rooms menu-icon"></i>
                    <span>House</span>
                  </a>
                  <div className="collapse " id="sidebarHouse">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/house"
                        >
                          Representatives
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/add-house"
                        >
                          Add Representative
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#sidebarVotes"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarVotes"
                  >
                    {/* <Icofont icon="icofont-hand" className="menu-icon" /> */}
                    <span>Votes We Track</span>
                  </a>
                  <div className="collapse " id="sidebarVotes">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/senator-vote"
                        >
                          Senate
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/house-vote"
                        >
                          House
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/add-vote"
                        >
                          Add Vote
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/term"
                        >
                          Manage Term
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#sidebarActivity"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarActivity"
                  >
                    {/* <Icofont icon="direction-sign" className="menu-icon" /> */}
                    <span>Activity We Track</span>
                  </a>
                  <div className="collapse " id="sidebarActivity">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/senator-activity"
                        >
                          Senate
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/house-activity"
                        >
                          House
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/add-activity"
                        >
                          Add Activity
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/term"
                        >
                          Manage Term
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#sidebarTerm"
                    data-bs-toggle="collapse"
                    role="button"
                    aria-expanded="false"
                    aria-controls="sidebarTerm"
                  >
                    <DiTerminal className="menu-icon" />
                    <span>Term</span>
                  </a>
                  <div className="collapse " id="sidebarTerm">
                    <ul className="nav flex-column">
                      <li className="nav-item">
                        <NavLink
                          className={({ isActive }) =>
                            `nav-link ${isActive ? "active-nav-item" : ""}`
                          }
                          to="/term"
                        >
                          Term
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </li> */}

                <li className="menu-label pt-0 mt-0 cursor-pointer">
                  {/* <a href="#" role="button"> */}
                  <span onClick={handleLogout}>
                    <span className="nav-link-logout hover-red">
                      <i className="las la-power-off fs-18 me-1 align-text-bottom"></i>{" "}
                      Logout
                    </span>
                  </span>
                  {/* </a> */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="startbar-overlay d-print-none"></div> */}
    </>
  );
}

export default Sidebar;

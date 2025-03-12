import React from "react";

function Header({toggleSidebar }) {
  // const toggleSidebar = () => {
  //   setIsCollapsed(!isCollapsed);
  // };
  return (
    <div class="topbar d-print-none">
      <div class="container-xxl">
        <nav
          class="topbar-custom d-flex justify-content-between"
          id="topbar-custom"
        >
          <ul class="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <li>
              <button
                class="nav-link mobile-menu-btn nav-icon"
                id="togglemenu"
                onClick={toggleSidebar}
              >
                <i class="iconoir-menu-scale"></i>
              </button>
            </li>
            <li class="mx-3 topbar-welcome-text">
              <h4 class="mb-0 fw-bold text-truncate">
                SBA Scorecard Management System
              </h4>
              {/* <h6 class="mb-0 fw-normal text-muted text-truncate fs-14">
                Here's your overview this week.
              </h6> */}
            </li>
          </ul>

          <ul class="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <li class="dropdown topbar-item" style={{ display: "none" }}>
              <a
                class="nav-link dropdown-toggle arrow-none nav-icon"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <img
                  src="assets/images/users/avatar-1.jpg"
                  alt=""
                  class="thumb-lg rounded-circle"
                />
              </a>
              <div class="dropdown-menu dropdown-menu-end py-0">
                <div class="d-flex align-items-center dropdown-item py-2 bg-secondary-subtle">
                  <div class="flex-shrink-0">
                    <img
                      src="assets/images/users/avatar-1.jpg"
                      alt=""
                      class="thumb-md rounded-circle"
                    />
                  </div>
                  <div class="flex-grow-1 ms-2 text-truncate align-self-center">
                    <h6 class="my-0 fw-medium text-dark fs-13">
                      William Martin
                    </h6>
                    <small class="text-muted mb-0">Front End Developer</small>
                  </div>
                </div>
                <div class="dropdown-divider mt-0"></div>
                <small class="text-muted px-2 pb-1 d-block">Account</small>
                <a class="dropdown-item" href="pages-profile.html">
                  <i class="las la-user fs-18 me-1 align-text-bottom"></i>{" "}
                  Profile
                </a>
                <a class="dropdown-item" href="pages-faq.html">
                  <i class="las la-wallet fs-18 me-1 align-text-bottom"></i>{" "}
                  Earning
                </a>
                <small class="text-muted px-2 py-1 d-block">Settings</small>
                <a class="dropdown-item" href="pages-profile.html">
                  <i class="las la-cog fs-18 me-1 align-text-bottom"></i>Account
                  Settings
                </a>
                <a class="dropdown-item" href="pages-profile.html">
                  <i class="las la-lock fs-18 me-1 align-text-bottom"></i>{" "}
                  Security
                </a>
                <a class="dropdown-item" href="pages-faq.html">
                  <i class="las la-question-circle fs-18 me-1 align-text-bottom"></i>{" "}
                  Help Center
                </a>
                <div class="dropdown-divider mb-0"></div>
                <a class="dropdown-item text-danger" href="auth-login.html">
                  <i class="las la-power-off fs-18 me-1 align-text-bottom"></i>{" "}
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;

import { useState, useEffect } from "react";
import Sidebar from "../components/global/Sidebar";
import Header from "../components/global/Header";

const Layout = ({ children }) => {
  const [sidebarSize, setSidebarSize] = useState("default");

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    setSidebarSize((prevSize) =>
      prevSize === "collapsed" ? "default" : "collapsed"
    );
  };

  useEffect(() => {
    try {
      // Prevent dropdown menus from closing on click
      const dropdownMenus = document.querySelectorAll(".dropdown-menu.stop");
      dropdownMenus.forEach((menu) =>
        menu.addEventListener("click", (e) => e.stopPropagation())
      );
    } catch (e) {}

    try {
      // Initialize Lucide icons
      if (window.lucide) window.lucide.createIcons();
    } catch (e) {}

    try {
      // Handle theme toggle (light/dark mode)
      const themeToggle = document.getElementById("light-dark-mode");
      if (themeToggle) {
        themeToggle.addEventListener("click", () => {
          const currentTheme = document.documentElement.getAttribute("data-bs-theme");
          document.documentElement.setAttribute("data-bs-theme", currentTheme === "light" ? "dark" : "light");
        });
      }
    } catch (e) {}

    try {
      // Sidebar toggle for mobile
      const collapsedToggle = document.querySelector(".mobile-menu-btn");
      const overlay = document.querySelector(".startbar-overlay");

      const changeSidebarSize = () => {
        if (window.innerWidth >= 310 && window.innerWidth <= 1440) {
          setSidebarSize("collapsed")
          document.body.setAttribute("data-sidebar-size", "collapsed");
        } else {
          setSidebarSize("default")
          document.body.setAttribute("data-sidebar-size", "default");
        }
      };

      collapsedToggle?.addEventListener("click", () => {
        const isCollapsed = document.body.getAttribute("data-sidebar-size") === "collapsed";
        document.body.setAttribute("data-sidebar-size", isCollapsed ? "default" : "collapsed");
      });

      overlay?.addEventListener("click", () => {
        document.body.setAttribute("data-sidebar-size", "collapsed");
      });

      window.addEventListener("resize", changeSidebarSize);
      changeSidebarSize();
    } catch (e) {}

    try {
      // Initialize Bootstrap tooltips & popovers
      if (window.bootstrap) {
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach((el) => new bootstrap.Tooltip(el));

        const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
        popoverElements.forEach((el) => new bootstrap.Popover(el));
      }
    } catch (e) {}

    try {
      // Sticky topbar on scroll
      const topbar = document.getElementById("topbar-custom");
      const handleScroll = () => {
        if (topbar) {
          if (window.scrollY >= 50) {
            topbar.classList.add("nav-sticky");
          } else {
            topbar.classList.remove("nav-sticky");
          }
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } catch (e) {}

    try {
      // Vertical menu initialization
      const initVerticalMenu = () => {
        const collapses = document.querySelectorAll(".navbar-nav li .collapse");

        document.querySelectorAll(".navbar-nav li [data-bs-toggle='collapse']").forEach((el) => {
          el.addEventListener("click", (e) => e.preventDefault());
        });

        collapses.forEach((collapse) => {
          collapse.addEventListener("show.bs.collapse", (event) => {
            document.querySelectorAll(".navbar-nav .collapse.show").forEach((el) => {
              if (el !== event.target) new bootstrap.Collapse(el).hide();
            });
          });
        });

        document.querySelectorAll(".navbar-nav a").forEach((link) => {
          const currentUrl = window.location.href.split(/[?#]/)[0];
          if (link.href === currentUrl) {
            link.classList.add("active");
            link.closest(".collapse")?.classList.add("show");
          }
        });
      };

      initVerticalMenu();
    } catch (e) {}
  }, []);

  return (
    <div className={`app-container ${sidebarSize}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar sidebarSize={sidebarSize} />
      <div className="page-wrapper">{children}</div>
    </div>
  );
};

export default Layout;

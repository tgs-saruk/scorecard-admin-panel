import React from "react";
import logo from "../../assets/image/digital-alchemy.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer class="footer text-center text-md-start text-sm-center d-print-none">
      <div class="container-xxl">
        <div class="row">
          <div class="col-12">
            <div class="card mb-0 rounded-bottom-0">
              <div class="card-body">
                {/* <p class="text-muted mb-0">
                  ©<script> document.write(new Date().getFullYear()) </script>
                  2025 Copyright Susan B. Anthony Pro-life America
                  <span class="text-muted d-sm-inline-block float-end design-by">
                    Made by{" "}
                    <a href="https://godigitalalchemy.com/" target="_blank">
                      godigitalalchemy.com
                    </a>
                  </span>
                </p> */}
                <p className="text-muted mb-0">
                  &copy; Copyright Susan B. Anthony Pro-life America{" "}
                  {new Date().getFullYear()}
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to="https://godigitalalchemy.com"
                  >
                    <span className="text-muted d-none d-sm-inline-block float-end">
                      Developed by DA
                      <img
                        src={logo}
                        width={35}
                        height={30}
                        alt="Digital Alchemy Logo"
                        className="ms-1"
                      />
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/loginSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import logo from "../../assets/image/logo-sm.png";
import { useNavigate } from "react-router-dom";
import Loader from "../global/Loader"; // Adjust the path if needed
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email format."
        )
        .required("Email is required."),
      password: Yup.string()
        // .min(6, "Incorrect Password")
        .required("Password is required."),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        setLoginError(null);

        // SweetAlert Success Message
        Swal.fire({
          title: "Success!",
          text: "Login successful",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate("/senator");
        });
      } catch (err) {
        console.error("Login failed:", err);
        setLoginError(err?.message || "Login failed. Please try again.");

        // SweetAlert Error Message
        Swal.fire({
          title: "Error!",
          text: err?.message || "Login failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
    <>
      {loading && <Loader />}
      <div className="container-xxl">
        <div className="row vh-100 d-flex justify-content-center">
          <div className="col-12 align-self-center">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-4 mx-auto">
                  <div className="card">
                    <div className="card-body p-0 bg-theme-blue auth-header-box rounded-top">
                      <div className="text-center p-3">
                        <a href="index.html" className="logo logo-admin">
                          <img
                            src={logo}
                            height="50"
                            alt="logo"
                            className="auth-logo"
                          />
                        </a>
                        <h4 className="mt-3 mb-1 fw-semibold text-white fs-18">
                          SBA Scorecard Management System
                        </h4>
                        <p className="fw-medium text-white mb-0">
                          Sign in to continue.
                        </p>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <form className="my-4" onSubmit={formik.handleSubmit}>
                        <div className="form-group mb-2">
                          <label className="form-label" htmlFor="email">
                            Email
                          </label>
                          <input
                            type="email"
                            className={`form-control ${formik.errors.email || loginError ? "error" : "custom-focus-border"}  `}
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.email && (
                            <p className="text-danger text-end pe-1 fs-6">
                              {formik.errors.email}
                            </p>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                          <input
                            type="password"
                            className={`form-control ${formik.errors.password || loginError ? "error" : "custom-focus-border"}  `}
                            name="password"
                            id="password"
                            placeholder="Enter password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.errors.password && (
                            <p className="text-danger text-end pe-1 fs-6">
                              {formik.errors.password}
                            </p>
                          )}
                        </div>

                        {/* {loginError && (
                          <p className="text-danger pt-2 text-center">
                            {loginError}
                          </p>
                        )} */}

                        <div className="form-group mb-0 row">
                          <div className="col-12">
                            <div className="d-grid mt-3">
                              <button
                                className="btn btn-custom"
                                type="submit"
                                disabled={loading}
                              >
                                Log In
                                <i className="fas fa-sign-in-alt ms-1"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

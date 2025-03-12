import React, { useEffect } from "react";
import Footer from "../../global/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  deleteActivity,
  getAllActivity,
} from "../../../redux/slice/activitySlice";
import Swal from "sweetalert2";

function HouseVote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activities } = useSelector((state) => state.activity);
  console.log("Activities", activities);
  useEffect(() => {
    dispatch(getAllActivity());
  }, [dispatch]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Dispatch the deleteActivity action and wait for it to complete
          await dispatch(deleteActivity(id)).unwrap();
          // Once deleteActivity is successful, dispatch getAllVotes to refresh the list
          await dispatch(getAllActivity()).unwrap();

          Swal.fire("Deleted!", "The activity has been removed.", "success");
        } catch (error) {
          console.error("Error deleting Activity:", error);
          Swal.fire(
            "Error!",
            "Failed to delete activity. Please try again.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="page-content">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header container-top">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title">Activity We Track</h4>
                  </div>
                  <div className="col-auto">
                    <form className="row g-2">
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-custom me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#addBoard"
                          onClick={() => navigate("/add-activity")}
                        >
                          <i className="fa-solid fa-plus me-1"></i>Add Bill
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-blue"
                        >
                          Fetch Bills from Quorum
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="table-responsive">
                  <table
                    className="table datatable three-columns-table"
                    id="datatable_1"
                  >
                    <thead className="table-light">
                      <tr>
                        <th data-type="date" data-format="YYYY/DD/MM">
                          Date
                        </th>
                        <th>Bill</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.length > 0 &&
                        activities
                          .filter((activity) => activity.type === "house")
                          .map((activity) => {
                            return (
                              <tr key={activity._id}>
                                <td>
                                  {moment(activity.date).format("DD/MM/YYYY")}
                                </td>
                                <td>{activity.title}</td>
                                <td>
                                  <Link to={`/edit-activity/${activity._id}`}>
                                    <i className="las la-pen text-secondary fs-24"></i>
                                  </Link>

                                  <i
                                    className="las la-trash-alt text-secondary fs-24"
                                    onClick={() => {
                                      handleDelete(activity._id);
                                    }}
                                  ></i>
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HouseVote;

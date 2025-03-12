import React from "react";
import Footer from "../../global/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteVote, getAllVotes } from "../../../redux/slice/voteSlice";
import moment from "moment/moment";
import Swal from "sweetalert2";

function SenetorVote() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { votes } = useSelector((state) => state.vote);
  console.log("Vote", votes);
  useEffect(() => {
    dispatch(getAllVotes());
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
          // Dispatch the deleteVote action and wait for it to complete
          await dispatch(deleteVote(id)).unwrap();
          // Once deleteVote is successful, dispatch getAllVotes to refresh the list
          await dispatch(getAllVotes()).unwrap();

          Swal.fire("Deleted!", "The vote has been removed.", "success");
        } catch (error) {
          console.error("Error deleting vote:", error);
          Swal.fire(
            "Error!",
            "Failed to delete vote. Please try again.",
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
                    <h4 className="card-title">Votes We Track</h4>
                  </div>
                  <div className="col-auto">
                    <form className="row g-2">
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-custom me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#addBoard"
                          onClick={() => navigate("/add-vote")}
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
                      {votes.length > 0 &&
                        votes
                          .filter((vote) => vote.type === "senate")
                          .map((vote) => {
                            return (
                              <tr key={vote._id}>
                                <td>
                                  {moment(vote.date).format("DD/MM/YYYY")}
                                </td>
                                <td>{vote.title}</td>
                                <td>
                                  <Link to={`/edit-vote/${vote._id}`}>
                                    <i className="las la-pen text-secondary fs-24"></i>
                                  </Link>

                                  <i
                                    className="las la-trash-alt text-secondary fs-24"
                                    onClick={() => {
                                      handleDelete(vote._id);
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

export default SenetorVote;

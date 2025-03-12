import React, { useEffect, useState } from "react";
import Footer from "../global/Footer";
import {
  createTerm,
  deleteTerm,
  getAllTerms,
  updateTerm,
} from "../../redux/slice/termSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

function Term() {
  const dispatch = useDispatch();
  const { terms } = useSelector((state) => state.term);
  const [termList, setTermList] = useState([]);

  useEffect(() => {
    dispatch(getAllTerms());
  }, [dispatch]);

  useEffect(() => {
    if (terms) {
      setTermList(terms);
    }
  }, [terms]);

  const handleInputChange = (index, value) => {
    setTermList((prevTerms) =>
      prevTerms.map((term, i) =>
        i === index ? { ...term, name: value, isEdited: true } : term
      )
    );
  };

  const handleAddTerm = () => {
    setTermList((prevTerms) => [...prevTerms, { name: "", isNew: true }]);
  };

  const handleRemoveTerm = async (id) => {
    // setTermList((prevTerms) => prevTerms.filter((_, i) => i !== index));
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
          if (id) {
            await dispatch(deleteTerm(id)).unwrap();
            await dispatch(getAllTerms()).unwrap();
          }
          Swal.fire("Deleted!", "The term has been removed.", "success");
        } catch (error) {
          console.error("Error deleting term:", error);
          Swal.fire(
            "Error!",
            "Failed to delete term. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleSubmit = async () => {
    try {
      for (const term of termList) {
        if (term.isNew) {
          await dispatch(createTerm({ name: term.name })).unwrap();
        } else if (term.isEdited && term._id) {
          await dispatch(
            updateTerm({ id: term._id, updatedData: { name: term.name } })
          ).unwrap();
        }
      }

      await dispatch(getAllTerms());

      Swal.fire({
        title: "Success!",
        text: "Terms processed successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error processing terms:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while processing terms.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="page-content">
      <div className="container-xxl">
        <div className="row justify-content-end container-top">
          <div className="col-auto mb-3">
            <form className="row g-2">
              <div className="col-auto">
                <button type="button" className="btn btn-primary btn-blue me-1">
                  Fetch Data from Quorum
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-green"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body pt-4 pb-4">
            <h5 className="text-center mb-4">Term's Information</h5>
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-10">
                <label htmlFor="term-name-input" className="form-label fw-bold">
                  Term's Name
                </label>
                {termList.map((term, index) => (
                  <div className="mb-3 row align-items-center" key={index}>
                    <div className="col-10">
                      <input
                        id={`term-name-input-${index}`}
                        className="form-control shadow-sm"
                        type="text"
                        placeholder="Enter term name"
                        value={term.name}
                        // onChange={(e) =>
                        //   handleInputChange(index, e.target.value)
                        // }
                        required
                      />
                    </div>
                    {/* <div className="col-2 text-end">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveTerm(term._id, index);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
              <div className="text-end mt-3">
                <button
                  className="btn btn-primary shadow-sm px-4 me-2"
                  onClick={handleAddTerm}
                >
                  <i className="fa-solid fa-plus me-2"></i> Add Term
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Term;

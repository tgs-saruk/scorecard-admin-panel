import React, { useEffect, useRef, useState } from "react";
import Footer from "../global/Footer";
import Avatar from "../../assets/image/users/avatar-1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/api/API";
import { getAllTerms } from "../../redux/slice/termSlice";
import { getAllVotes } from "../../redux/slice/voteSlice";
import { getAllActivity } from "../../redux/slice/activitySlice";
import { states, rating, score } from "../global/Common";
import {
  createHouse,
  getHouseById,
  updateHouse,
} from "../../redux/slice/houseSlice";
import {
  createHouseData,
  deleteHouseData,
  getHouseDataByHouseId,
  updateHouseData,
} from "../../redux/slice/houseTermSlice";
// import ReactQuill from "react-quill";
import Swal from "sweetalert2";

function SaveHoues() {
  const location = useLocation().pathname;
  const houseId = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { house } = useSelector((state) => state.house);
  const { currentHouse } = useSelector((state) => state.houseData);
  const { terms } = useSelector((state) => state.term);
  console.log("currentHouse", currentHouse);

  const { votes } = useSelector((state) => state.vote);
  const { activities } = useSelector((state) => state.activity);
  const [updateTermId, setUpdateTermId] = useState(null);
  console.log("updateTermId", updateTermId);

  useEffect(() => {
    if (houseId) {
      dispatch(getHouseById(houseId));
      dispatch(getHouseDataByHouseId(houseId));
    }
  }, [houseId, dispatch]);

  useEffect(() => {
    dispatch(getAllTerms());
    dispatch(getAllVotes());
    dispatch(getAllActivity());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    party: "",
    status: "active",
  });

  useEffect(() => {
    if (house) {
      setFormData((prev) => ({
        ...prev,
        name: house?.name || prev.name,
        district: house?.district || prev.district,
        party: house?.party || prev.party,
        status: house?.status || prev.status,
      }));
    }
  }, [house]);

  const [term, setTerm] = useState([]);
  console.log("term", term);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const addedTermIds = useRef(new Set());

  useEffect(() => {
    if (Array.isArray(currentHouse) && currentHouse.length > 0) {
      setTerm((prev) => {
        const newTerms = currentHouse.filter((cs) => {
          if (!addedTermIds.current.has(cs.termId)) {
            addedTermIds.current.add(cs.termId); // Track added termId
            return true;
          }
          return false;
        });

        return newTerms.length > 0 ? [...prev, ...newTerms] : prev; // Only update if there's something new
      });
    }
  }, [currentHouse, houseId]);

  useEffect(() => {
    if (house?.photo) {
      setPreview(`${API_URL}/uploads/photos/house/${house.photo}`);
    } else if (photo) {
      setPreview(URL.createObjectURL(photo));
    }
  }, [house, photo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file); // Store the uploaded file
    if (file) {
      // Generate a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleChange = (id, index, field, value) => {
    setTerm((prev) => {
      const updatedTerms = [...prev];

      // Toggle the `currentTerm` value
      if (field === "currentTerm") {
        updatedTerms[index] = {
          ...updatedTerms[index],
          [field]: !value, // Flip the boolean value
        };
      } else {
        // Update other fields (if needed)
        updatedTerms[index] = {
          ...updatedTerms[index],
          [field]: value,
        };
      }

      return updatedTerms;
    });

    // Track the updated term ID (if necessary)
    setUpdateTermId(id);

    // Debugging log for verification
    console.log("Updated term state:", term);
  };

  const handleFieldChange = (id, termIndex, section, index, field, value) => {
    setTerm((prev) =>
      prev.map((term, i) =>
        i === termIndex
          ? {
              ...term,
              [section]: term[section].map((item, j) =>
                j === index ? { ...item, [field]: value } : item
              ),
            }
          : term
      )
    );
    setUpdateTermId(id);
  };

  const addBox = (formIndex, section) => {
    console.log("section", section);

    setTerm((prev) =>
      prev.map((t, i) =>
        i === formIndex
          ? section === "votesScore"
            ? {
                ...t,
                [section]: [...t[section], { voteId: "", score: "" }],
              }
            : section === "activitiesScore" && {
                ...t,
                [section]: [...t[section], { activityId: "", score: "" }],
              }
          : t
      )
    );
  };

  const removeBox = (formIndex, index, section) => {
    const updatedTerm = [...term];
    updatedTerm[formIndex][section].splice(index, 1);
    setTerm(updatedTerm);
  };

  const addTerm = () => {
    setTerm([
      ...term,
      {
        houseId: houseId,
        termId: "",
        currentTerm: false,
        summary: "",
        rating: "",
        votesScore: [{ voteId: "", score: "" }],
        activitiesScore: [{ activityId: "", score: "" }],
      },
    ]);
  };

  const removeTerm = (id, index) => {
    const updatedTerm = [...term];
    updatedTerm.splice(index, 1);
    setTerm(updatedTerm);
    if (id) {
      dispatch(deleteHouseData(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create form data for house
      const data = new FormData();
      data.append("name", formData.name);
      data.append("district", formData.district);
      data.append("party", formData.party);
      data.append("status", formData.status);
      if (photo) {
        data.append("photo", photo);
      }

      // Debug: Log FormData content
      console.log("FormData values:");
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      // Step 2: Check if updating or creating a house
      if (house?._id) {
        console.log("Updating house:", house._id);
        await dispatch(updateHouse({ id: house._id, formData: data })).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Representative updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.log("Creating new house");
        await dispatch(createHouse(data)).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Representative created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      // Step 3: Handle terms update or creation
      console.log("Terms to process:", term);
      for (const t of term) {
        if (t?._id) {
          if (t._id === updateTermId) {
            console.log("Updating term:", t);
            await dispatch(updateHouseData({ id: t._id, data: t })).unwrap();
            Swal.fire({
              title: "Success!",
              text: "Representative's term updated successfully!",
              icon: "success",
              confirmButtonText: "OK",
            });
          }
        } else {
          console.log("Creating term:", t);
          await dispatch(createHouseData(t)).unwrap();
          Swal.fire({
            title: "Success!",
            text: "Representative's term created successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      }

      // Step 4: Success message
    } catch (error) {
      // Debug: Log the error
      console.error("Error creating/updating house or terms:", error);
      alert("Error creating/updating house or terms!");
    }
  };

  useEffect(() => {
    if (location === "/add-house") {
      setFormData({
        name: "",
        district: "",
        party: "",
        status: "active",
      });
      setPhoto(null);
      setPreview(null);
      setTerm([]);
    }
  }, [location]);

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
                  type="button" // Change to type="button" since it's not inside a form
                  onClick={handleSubmit} // Trigger the form submission logic
                  className="btn btn-primary btn-green"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title">Representative's Information</h4>
                  </div>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3 row">
                      <div className="col-lg-6">
                        <div className="row mb-3 mb-lg-0">
                          <label
                            for="example-text-input"
                            className="col-lg-3 col-sm-2 col-form-label text-md-end"
                          >
                            Representative's Name
                          </label>
                          <div className="col-lg-9 col-sm-10">
                            <input
                              className="form-control"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <label
                            className="col-sm-2 col-form-label text-md-end"
                            for="inputGroupFile01"
                          >
                            Status
                          </label>
                          <div className="col-sm-10 d-flex align-items-center">
                            <div className="true-false-btn d-inline-flex align-items-center">
                              <input
                                type="radio"
                                className="btn-check"
                                name="status"
                                id="active"
                                value="active"
                                checked={formData.status === "active"}
                                onChange={handleInputChange}
                              />
                              <input
                                type="radio"
                                className="btn-check"
                                name="status"
                                id="former"
                                value="former"
                                checked={formData.status === "former"}
                                onChange={handleInputChange}
                              />
                              <label className="btn btn-sm" htmlFor="active">
                                Active
                              </label>
                              <label className="btn btn-sm" htmlFor="former">
                                Former
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 row">
                      <div className="col-lg-6">
                        <div className="mb-3 mb-lg-0 row">
                          <label className="col-lg-3 col-sm-2 col-form-label text-md-end">
                            District{" "}
                          </label>
                          <div className="col-lg-9 col-sm-10">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              name="district"
                              value={formData.district}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="" disabled>
                                Select District{" "}
                              </option>
                              {states.map((s) => (
                                <option value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <label className="col-sm-2 col-form-label text-md-end">
                            Party
                          </label>
                          <div className="col-sm-10">
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              name="party"
                              value={formData.party}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="" disabled>
                                Open this select menu
                              </option>
                              <option value="republican">Republican</option>
                              <option value="democrat">Democratic</option>
                              <option value="independent">Independent</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 row">
                      <div className="col-lg-6">
                        <div className="mb-3 mb-lg-0 row">
                          <label className="col-lg-3 col-sm-2 col-form-label text-md-end">
                            Representative's Photo{" "}
                          </label>
                          <div className="col-lg-9 col-sm-10">
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                      {preview && (
                        <div className="col-lg-6">
                          <div className="row align-content-center">
                            <label className="col-sm-2 col-form-label text-md-end">
                              Preview
                            </label>

                            <div className="col-sm-10">
                              <div className="row">
                                <div className="col-sm-2">
                                  <img
                                    src={preview ? preview : Avatar}
                                    alt="avatar"
                                  />
                                </div>
                                <div className="col-sm-10 d-flex flex-wrap align-content-center">
                                  <label className="col-form-label">
                                    <strong>{formData.name}</strong>
                                    {`'s Profile
                                    Image`}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-0">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title">
                      Representative's Term Information
                    </h4>
                  </div>

                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-custom"
                      data-target="addTermModule"
                      onClick={addTerm}
                    >
                      <i className="fa-solid fa-plus me-1"></i>Add Term
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {term.length > 0 &&
              term.map((term, index) => (
                <div className="repeatable-module mb-3">
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="col-auto">
                            <div className="text-end mb-3">
                              <i
                                class="las la-trash-alt text-danger fs-20"
                                onClick={() => removeTerm(term?._id, index)}
                              ></i>
                            </div>
                          </div>
                          {/* Term Selection */}
                          <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-md-end">
                              Term
                            </label>
                            <div className="col-sm-10">
                              <select
                                className="form-select"
                                name="termId"
                                value={
                                  typeof term.termId === "object"
                                    ? term.termId._id
                                    : term.termId
                                }
                                onChange={(e) =>
                                  handleChange(
                                    term?._id,
                                    index,
                                    "termId",
                                    e.target.value
                                  )
                                }
                              >
                                <option defaultValue>
                                  Open this select menu
                                </option>
                                {terms.map((term) => (
                                  <option value={term._id}>{term.name}</option>
                                ))}
                                {/* <option value="2">Two</option>
                            <option value="3">Three</option> */}
                              </select>
                            </div>
                          </div>

                          {/* Current Term Toggle */}
                          <div className="mb-3 row">
                            <label
                              className="col-sm-2 col-form-label text-md-end"
                              for="inputGroupFile01"
                            >
                              Current Term
                            </label>
                            <div className="col-sm-10 d-flex align-items-center">
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`currentTerm-${index}`} // Unique ID for each checkbox
                                  name="currentTerm"
                                  checked={term.currentTerm} // Use state value to control checked status
                                  onChange={() =>
                                    handleChange(
                                      term._id,
                                      index,
                                      "currentTerm",
                                      term.currentTerm
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* Term Summary Editor */}
                          <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-md-end">
                              Term Summary
                            </label>
                          </div>

                          {/* SBA Rating */}
                          <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-md-end">
                              SBA Rating
                            </label>
                            <div className="col-sm-10">
                              <select
                                className="form-select"
                                name="rating"
                                value={term.rating}
                                onChange={(e) =>
                                  handleChange(
                                    term?._id,
                                    index,
                                    "rating",
                                    e.target.value
                                  )
                                }
                              >
                                <option defaultValue>
                                  Open this select menu
                                </option>
                                {rating.map((r) => (
                                  <option value={r}>{r}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Scored Votes */}
                          <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-md-end">
                              Scored Votes
                            </label>
                            <div className="col-sm-10">
                              {term.votesScore?.map((vote, voteIndex) => (
                                <div className="row mb-3" key={voteIndex}>
                                  <div className="col-md-6">
                                    <select
                                      className="form-select"
                                      name="votesScore"
                                      value={
                                        typeof vote.voteId === "object"
                                          ? vote.voteId._id
                                          : vote.voteId
                                      }
                                      onChange={(e) =>
                                        handleFieldChange(
                                          term?._id,
                                          index,
                                          "votesScore",
                                          voteIndex,
                                          "voteId",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option defaultValue>Select Bills</option>
                                      {votes.map((v) => (
                                        <option value={v._id}>{v.title}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-md-5">
                                    <select
                                      className="form-select"
                                      name="votesScore"
                                      value={vote.score}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          term?._id,
                                          index,
                                          "votesScore",
                                          voteIndex,
                                          "score",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option defaultValue>Select Score</option>
                                      {score.map((v) => (
                                        <option value={v}>{v}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="col-sm-1 mt-1">
                                    <i
                                      class="las la-trash-alt text-danger fs-20"
                                      onClick={() =>
                                        removeBox(
                                          index,
                                          voteIndex,
                                          "votesScore"
                                        )
                                      }
                                    ></i>
                                  </div>
                                </div>
                              ))}
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => addBox(index, "votesScore")}
                                >
                                  <i className="fa-solid fa-plus me-1"></i> Add
                                  Votes
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Tracked Activity */}
                          <div className="mb-3 row">
                            <label className="col-sm-2 col-form-label text-md-end">
                              Tracked Activity
                            </label>
                            <div className="col-sm-10">
                              {term.activitiesScore?.map(
                                (activity, activityIndex) => (
                                  <div className="row mb-3" key={activityIndex}>
                                    <div className="col-md-6">
                                      <select
                                        className="form-select"
                                        name="activitiesScore"
                                        value={
                                          typeof activity.activityId ===
                                          "object"
                                            ? activity.activityId._id
                                            : activity.activityId
                                        }
                                        onChange={(e) =>
                                          handleFieldChange(
                                            term?._id,
                                            index,
                                            "activitiesScore",
                                            activityIndex,
                                            "activityId",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option defaultValue>
                                          Select Bills
                                        </option>
                                        {activities.map((a) => (
                                          <option value={a._id}>
                                            {a.title}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="col-md-5">
                                      <select
                                        className="form-select"
                                        name="activitiesScore"
                                        value={activity.score}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            term?._id,
                                            index,
                                            "activitiesScore",
                                            activityIndex,
                                            "score",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option defaultValue>
                                          Select Score
                                        </option>
                                        {score.map((a) => (
                                          <option value={a}>{a}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="col-sm-1 mt-1">
                                      <i
                                        class="las la-trash-alt text-danger fs-20"
                                        onClick={() =>
                                          removeBox(
                                            index,
                                            activityIndex,
                                            "activitiesScore"
                                          )
                                        }
                                      ></i>
                                    </div>
                                  </div>
                                )
                              )}
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    addBox(index, "activitiesScore")
                                  }
                                >
                                  <i className="fa-solid fa-plus me-1"></i> Add
                                  Activity
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SaveHoues;

import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Footer from "../global/Footer";
import Avatar from "../../assets/image/add-profile-picture.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  createSenator,
  getSenatorById,
  updateSenator,
} from "../../redux/slice/senetorSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/api/API";
import {
  createSenatorData,
  deleteSenatorData,
  getSenatorDataById,
  getSenatorDataBySenetorId,
  updateSenatorData,
} from "../../redux/slice/senetorTermSlice";
import { getAllTerms } from "../../redux/slice/termSlice";
import { getAllVotes } from "../../redux/slice/voteSlice";
import { getAllActivity } from "../../redux/slice/activitySlice";
import { states, rating, score } from "../global/Common";
import Loader from "../global/Loader";

function SaveSenetors() {
  const location = useLocation().pathname;
  const [senateId, setSenateId] = useState("");
  // console.log("senateId", senateId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, senator } = useSelector((state) => state.senator);
  console.log("senator", senator);

  const { currentSenator } = useSelector((state) => state.senatorData);
  const { terms } = useSelector((state) => state.term);
  
  console.log("currentSenator", currentSenator);

  const { votes } = useSelector((state) => state.vote);
  const senatorVotes = votes.filter((v) => v.type === "senate");
  const { activities } = useSelector((state) => state.activity);
  const senatorActivities = activities.filter((a) => a.type === "senate");
  const [updateTermId, setUpdateTermId] = useState(null);
  const [formData, setFormData] = useState({
    name: "Sen.",
    state: "",
    party: "",
    status: "active",
  });
  // console.log("updateTermId", updateTermId);

  const [term, setTerm] = useState([]);
  // console.log("term", term);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  console.log("preview", preview);

  const addedTermIds = useRef(new Set());
  // console.log("location", location);

  useEffect(() => {
    if (location === "/add-senator") {
      setSenateId("");
      setUpdateTermId(null);
      setFormData({
        name: "Sen. ",
        state: "",
        party: "",
        status: "active",
      });
      setPhoto(null);
      setPreview(null);
      setTerm([]);
      addedTermIds.current.clear(); // Clear tracked term IDs
    }
  }, [location]);

  const id = useParams().id;
  console.log(id);
  useEffect(() => {
    // if (senator?._id) {
    //   setSenateId(senator?._id);
    // }
    if (id) {
      setSenateId(id);
    }
  }, [id, senator]);

  useEffect(() => {
    if (id) {
      dispatch(getSenatorById(id));
      dispatch(getSenatorDataBySenetorId(id));
    }
  }, [id]);

  useEffect(() => {
    dispatch(getAllTerms());
    dispatch(getAllVotes());
    dispatch(getAllActivity());
  }, []);

  useEffect(() => {
    if (id) {
      setFormData((prev) => ({
        ...prev,
        name: senator?.name || prev.name,
        state: senator?.state || prev.state,
        party: senator?.party || prev.party,
        status: senator?.status || prev.status,
      }));
    }
  }, [id, senator]);

  useEffect(() => {
    if (id && Array.isArray(currentSenator) && currentSenator.length > 0) {
      setTerm((prev) => {
        const newTerms = currentSenator.filter((cs) => {
          if (!addedTermIds.current.has(cs.termId)) {
            addedTermIds.current.add(cs.termId); // Track added termId
            return true;
          }
          return false;
        });

        return newTerms.length > 0 ? [...prev, ...newTerms] : prev; // Only update if there's something new
      });
    }
  }, [currentSenator, id]);

  useEffect(() => {
    if (id && senator?.photo) {
      setPreview(`${API_URL}/uploads/photos/senator/${senator?.photo}`);
    }
  }, [id, senator]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file", file);

    setPhoto(file); // Store the uploaded file
    if (file) {
      // Generate a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      console.log("previewUrl", previewUrl);

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
    // console.log("Updated term state:", term);
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
        senateId: senateId || senator?._id,
        termId: "",
        currentTerm: false,
        summary: "",
        rating: "",
        votesScore: [{ voteId: "", score: "" }],
        activitiesScore: [{ activityId: "", score: "" }],
      },
    ]);
    Swal.fire({
      title: "Success!",
      text: "Senator's term Added successfully!",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      width: "350px",
      customClass: {
        popup: "small-swal",
        title: "small-title",
        htmlContainer: "small-text",
        icon: "small-icon",
        padding: "small-padding",
      },
    });
  };

  const removeTerm = (id, index) => {
    const updatedTerm = [...term];
    updatedTerm.splice(index, 1);
    setTerm(updatedTerm);
    if (id) {
      dispatch(deleteSenatorData(id));
    }
  };

  const handleEditorChange = (content, editor) => {
    handleChange(term?._id, index, "summary", content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create form data for senator
      const data = new FormData();
      data.append("name", formData.name);
      data.append("state", formData.state);
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

      // Step 2: Check if updating or creating a senator
      if (senator?._id) {
        // console.log("Updating senator:", senator._id);
        await dispatch(
          updateSenator({ id: senator._id, formData: data })
        ).unwrap();

        Swal.fire({
          title: "Success!",
          text: "Senator updated successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          width: "350px",
          customClass: {
            popup: "small-swal",
            title: "small-title",
            htmlContainer: "small-text",
            icon: "small-icon",
            padding: "small-padding",
          },
        });
      } else {
        console.log("Creating new senator");
        const res = await dispatch(createSenator(data)).unwrap();
        console.log("res", res);
        if (res?._id) {
          setSenateId(res?._id);
        }

        Swal.fire({
          title: "Success!",
          text: "Senator created successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          width: "350px",
          customClass: {
            popup: "small-swal",
            title: "small-title",
            htmlContainer: "small-text",
            icon: "small-icon",
            padding: "small-padding",
          },
        });
      }

      // Step 3: Handle terms update or creation
      console.log("Terms to process:", term);
      for (const t of term) {
        if (t?._id) {
          if (t._id === updateTermId) {
            console.log("Updating term:", t);
            await dispatch(updateSenatorData({ id: t._id, data: t })).unwrap();

            Swal.fire({
              title: "Success!",
              text: "Senator's term updated successfully!",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
              width: "350px",
              customClass: {
                popup: "small-swal",
                title: "small-title",
                htmlContainer: "small-text",
                icon: "small-icon",
                padding: "small-padding",
              },
            });
          }
        } else {
          console.log("Creating term:", t);
          await dispatch(createSenatorData(t)).unwrap();

          Swal.fire({
            title: "Success!",
            text: "Senator's term created successfully!",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            width: "350px",
            customClass: {
              popup: "small-swal",
              title: "small-title",
              htmlContainer: "small-text",
              icon: "small-icon",
              padding: "small-padding",
            },
          });
        }
      }
    } catch (error) {
      console.error("Error creating/updating senator or terms:", error);

      Swal.fire({
        title: "Error!",
        text: "Error creating/updating senator or terms!",
        icon: "error",
        confirmButtonText: "OK",
        width: "350px",
        customClass: {
          popup: "small-swal",
          title: "small-title",
          htmlContainer: "small-text",
          icon: "small-icon",
          padding: "small-padding",
        },
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="page-content">
        <div className="container-xxl pb-3">
          <div className="row justify-content-end container-top">
            <div className="col-auto mb-3">
              <form className="row g-2">
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-blue me-1"
                  >
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
                      <h4 className="card-title">Senator's Information</h4>
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
                              Senator’s Name
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
                              State{" "}
                            </label>
                            <div className="col-lg-9 col-sm-10">
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="" disabled>
                                  Select State{" "}
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
                                <option value="democrat">Democrat</option>
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
                              Senator’s Photo
                            </label>
                            <div className="col-lg-9 col-sm-10 d-flex align-items-center">
                              {/* File Input */}
                              <input
                                type="file"
                                className="form-control d-none"
                                id="fileInput"
                                onChange={handleFileChange}
                              />

                              {/* Clickable Preview */}
                              <div
                                className="d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                              >
                                <img
                                  src={preview || Avatar}
                                  alt="avatar"
                                  style={{
                                    width: preview ? "80px" : "100px",
                                    height: preview ? "80px" : "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-0 term-body">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-title">Senator's Term Information</h4>
                    </div>

                    <div className="col-auto">
                      <button
                        type="button"
                        className="btn btn-custom"
                        data-target="addTermModule"
                        onClick={addTerm}
                        disabled={!senateId}
                      >
                        <i className="fa-solid fa-plus me-1"></i>Add Term
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 p-1 bg-white">
                {term.length > 0 &&
                  term.map((term, index) => (
                    <div
                    className="card mb-3 "
                    style={{
                      backgroundColor: "#f0f4fa",
                      borderRadius: 5,
                      // boxShadow: "0px 0px 2px 0px #e0e0e0",
                    }}
                    key={index}
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="col-auto">
                            <div className="text-end mb-3">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  removeTerm(term?._id, index);
                                  Swal.fire({
                                    title: "Deleted!",
                                    text: "The senator's term has been removed.",
                                    icon: "success",
                                    showConfirmButton: false,
                                    timer: 2000,
                                    width: "350px",
                                    customClass: {
                                      popup: "small-swal",
                                      title: "small-title",
                                      htmlContainer: "small-text",
                                      icon: "small-icon",
                                      padding: "small-padding",
                                    },
                                  });
                                }}
                              >
                                Delete This Term
                              </button>
                            </div>
                          </div>
                          {/* Term Selection */}
                          <div className="mb-3 ms-1 row justify-center align-items-center">
                            <div className="col-lg-6">
                              <div className="row">
                                <label className="col-sm-3 col-form-label text-md-end">
                                  Term
                                </label>
                                <div className="col-sm-9">
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
                                      <option value={term._id}>
                                        {term.name}
                                      </option>
                                    ))}
                                    {/* <option value="2">Two</option>
                            <option value="3">Three</option> */}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* SBA Rating */}
                            <div className="col-lg-6">
                              <div className="row">
                                <label className="col-sm-3 col-form-label text-md-end">
                                  SBA Rating
                                </label>
                                <div className="col-sm-9">
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
                            </div>
                          </div>

                          {/* Term Summary Editor */}
                          <div className="mb-5 row justify-center ">
                            <div className="col-lg-10">
                              <div className="row">
                                <label className="col-sm-2 col-form-label text-md-end">
                                  Term Summary
                                </label>
                                <div className="col-sm-10">
                                  <Editor
                                    apiKey="your-tinymce-api-key"
                                    value={term.summary}
                                    init={{
                                      height: 300,
                                      menubar: false,
                                      plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount",
                                      ],
                                      toolbar:
                                        "undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help",
                                    }}
                                    onEditorChange={handleEditorChange}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Current Term Toggle */}
                            <div className="col-lg-2">
                              <div className=" row">
                                <label
                                  className="col-sm-8 col-form-label text-md-end"
                                  for="inputGroupFile01"
                                >
                                  Current Term
                                </label>
                                <div className="col-sm-4 d-flex align-items-center">
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
                            </div>
                          </div>

                          {/* Scored Votes */}
                          <div className="mb-3 row justify-center align-items-center padding-vote">
                            <div className="col-lg-12">
                              <div className="row">
                                <label className="col-sm-1 px-0 col-form-label text-md-start">
                                  Scored Vote
                                </label>
                                <div className="col-sm-11">
                                  {term.votesScore?.map((vote, voteIndex) => (
                                    <div className="row mb-3" key={voteIndex}>
                                      <div className="col-md-6">
                                        <select
                                          className="form-select"
                                          name="votesScore"
                                          value={
                                            typeof vote.voteId === "object"
                                              ? vote.voteId?._id
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
                                          <option defaultValue>
                                            Select Bills
                                          </option>
                                          {senatorVotes.map((v) => (
                                            <option value={v._id}>
                                              {v.title}
                                            </option>
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
                                          <option defaultValue>
                                            Select Score
                                          </option>
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
                                      onClick={() =>
                                        addBox(index, "votesScore")
                                      }
                                    >
                                      <i className="fa-solid fa-plus me-1"></i>{" "}
                                      Add Vote
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tracked Activity */}
                          <div className="mb-3 row justify-center align-items-center padding-vote">
                            <div className="col-lg-12">
                              <div className="row">
                                <label className="col-sm-1 col-form-label px-0 align-middle text-md-start">
                                  Tracked Activity
                                </label>
                                <div className="col-sm-11">
                                  {term.activitiesScore?.map(
                                    (activity, activityIndex) => (
                                      <div
                                        className="row mb-3"
                                        key={activityIndex}
                                      >
                                        <div className="col-md-6">
                                          <select
                                            className="form-select"
                                            name="activitiesScore"
                                            value={
                                              typeof activity.activityId ===
                                              "object"
                                                ? activity.activityId?._id
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
                                            {senatorActivities.map((a) => (
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
                                      <i className="fa-solid fa-plus me-1"></i>{" "}
                                      Add Activity
                                    </button>
                                  </div>
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
        </div>
        <Footer />
      </div>
    </>
  );
}

export default SaveSenetors;

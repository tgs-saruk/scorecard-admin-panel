// import React, { useEffect, useState } from "react";
// import Footer from "../global/Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllTerms } from "../../redux/slice/termSlice";
// import { Link, useParams } from "react-router-dom";
// import moment from "moment";
// import { API_URL } from "../../redux/api/API";
// import {
//   createActivity,
//   getActivityById,
//   updateActivity,
// } from "../../redux/slice/activitySlice";
// // import ReactQuill from "react-quill";
// import Swal from "sweetalert2";

// function AddActivity() {
//   const activityId = useParams().id;
//   console.log("activityId", activityId);
//   const dispatch = useDispatch();
//   const { activity } = useSelector((state) => state.activity);
//   const { terms } = useSelector((state) => state.term);
//   const [formData, setFormData] = useState({
//     type: activity?.type || "",
//     title: activity?.title || "",
//     shortDesc: activity?.shortDesc || "",
//     longDesc: activity?.longDesc || "",
//     rollCall: activity?.rollCall || "",
//     date: moment(activity?.date).format("YYYY-MM-DD") || "",
//     congress: activity?.congress || "",
//     termId: activity?.termId?._id || "",
//     readMore: activity?.readMore || null,
//   });
//   console.log("formData", formData);

//   console.log("activity", activity);

//   useEffect(() => {
//     if (activityId) {
//       dispatch(getActivityById(activityId));
//     }
//     dispatch(getAllTerms());
//   }, [activityId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: files[0], // Assigning the first selected file
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });

//     try {
//       if (activityId) {
//         // If activityId exists, dispatch the updateVote action
//         await dispatch(
//           updateActivity({ id: activityId, updatedData: data })
//         ).unwrap();
//         Swal.fire({
//           title: "Success!",
//           text: "Activity updated successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       } else {
//         // If no activityId, dispatch the createVote action
//         await dispatch(createActivity(data)).unwrap();
//         Swal.fire({
//           title: "Success!",
//           text: "Activity created successfully!",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <div class="page-content">
//       <div class="container-xxl">
//         <div class="row justify-content-end container-top">
//           <div class="col-auto mb-3">
//             <form class="row g-2">
//               <div class="col-auto">
//                 <button type="button" class="btn btn-primary btn-blue me-1">
//                   Fetch Data from Quorum
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   class="btn btn-primary btn-green"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div class="row justify-content-center">
//           <div class="col-12">
//             <div class="card">
//               <div class="card-header container-top">
//                 <div class="row align-items-center">
//                   <div class="col">
//                     <h4 class="card-title">Bill’s Information</h4>
//                   </div>
//                 </div>
//               </div>
//               <div class="card-body pt-0">
//                 <div class="row">
//                   <div class="col-lg-12">
//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="type"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Type{" "}
//                       </label>
//                       <div class="col-sm-10">
//                         <select
//                           class="form-select"
//                           aria-label="Default select example"
//                           name="type"
//                           value={formData.type}
//                           onChange={handleChange}
//                           id="type"
//                         >
//                           <option value="" disabled>
//                             Select bill type
//                           </option>
//                           <option value="senate">Senate</option>
//                           <option value="house">House</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="example-text-input"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Title
//                       </label>
//                       <div class="col-sm-10">
//                         <input
//                           class="form-control"
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleChange}
//                           id="example-text-input"
//                           placeholder="Enter the bill title"
//                         />
//                       </div>
//                     </div>

//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="shortDesc"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Short Description{" "}
//                       </label>
                      
//                     </div>

//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="longDesc"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Long Description
//                       </label>
//                       <div class="col-sm-10 editor--bottom-spacer">
//                         <ReactQuill
//                           theme="snow"
//                           name="longDesc"
//                           value={formData.longDesc}
//                           onChange={handleChange}
//                           id="longDesc"
//                           placeholder="Provide a detailed description of the bill"
//                         />
//                       </div>
//                     </div>

//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="date"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Date{" "}
//                       </label>
//                       <div class="col-sm-10">
//                         <input
//                           class="form-control"
//                           type="date"
//                           name="date"
//                           value={formData.date}
//                           onChange={handleChange}
//                         />
//                       </div>
//                     </div>

//                     <div class="mb-3 row">
//                       <label
//                         htmlFor="congress"
//                         class="col-sm-2 col-form-label text-md-end"
//                       >
//                         Congress
//                       </label>
//                       <div class="col-sm-10">
//                         <input
//                           class="form-control"
//                           type="text"
//                           id="congress"
//                           name="congress"
//                           value={formData.congress}
//                           onChange={handleChange}
//                           placeholder="Enter the congress number"
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-3 row">
//                       <label
//                         htmlFor="termId"
//                         className="col-sm-2 col-form-label text-md-end"
//                       >
//                         Term
//                       </label>
//                       <div className="col-sm-10">
//                         <select
//                           className="form-select"
//                           aria-label="Select term"
//                           name="termId"
//                           value={formData.termId}
//                           onChange={handleChange}
//                           id="termId"
//                         >
//                           <option value="" disabled>
//                             Select term
//                           </option>
//                           {terms.map((term) => (
//                             <option value={term._id}>{term.name}</option>
//                           ))}
//                           {/* Add other options as needed */}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="mb-3 row">
//                       <label
//                         htmlFor="rollCall"
//                         className="col-sm-2 col-form-label text-md-end"
//                       >
//                         Roll Call
//                       </label>
//                       <div className="col-sm-10">
//                         <div className="input-group">
//                           <span className="input-group-text" id="rollCallAddon">
//                             URL
//                           </span>
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="rollCall"
//                             name="rollCall"
//                             aria-describedby="rollCallAddon"
//                             value={formData.rollCall}
//                             onChange={handleChange}
//                             placeholder="Enter the roll call URL"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mb-3 row">
//                       <label
//                         htmlFor="readMore"
//                         className="col-sm-2 col-form-label text-md-end"
//                       >
//                         Read More
//                       </label>
//                       <div className="col-sm-10">
//                         <input
//                           type="file"
//                           className="form-control"
//                           id="readMore"
//                           name="readMore"
//                           onChange={handleFileChange}
//                         />
//                       </div>
//                     </div>
//                     {activityId && formData.readMore && (
//                       <div className="mb-3 row">
//                         <label className="col-sm-2 col-form-label text-md-end">
//                           Preview Read More
//                         </label>
//                         <div className="col-sm-10">
//                           <Link
//                             className="form-control"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             to={`${API_URL}${formData.readMore}`}
//                           >
//                             <u className="text-blue">{`${formData.readMore}`}</u>
//                           </Link>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default AddActivity;


import React, { useEffect, useState } from "react";
import Footer from "../global/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllTerms } from "../../redux/slice/termSlice";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { API_URL } from "../../redux/api/API";
import {
  createActivity,
  getActivityById,
  updateActivity,
} from "../../redux/slice/activitySlice";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";

function AddActivity() {
  const activityId = useParams().id;
  console.log("activityId", activityId);
  const dispatch = useDispatch();
  const { activity } = useSelector((state) => state.activity);
  const { terms } = useSelector((state) => state.term);
  const [formData, setFormData] = useState({
    type: activity?.type || "",
    title: activity?.title || "",
    shortDesc: activity?.shortDesc || "",
    longDesc: activity?.longDesc || "",
    rollCall: activity?.rollCall || "",
    date: moment(activity?.date).format("YYYY-MM-DD") || "",
    congress: activity?.congress || "",
    termId: activity?.termId?._id || "",
    readMore: activity?.readMore || null,
  });
  console.log("formData", formData);

  console.log("activity", activity);

  useEffect(() => {
    if (activityId) {
      dispatch(getActivityById(activityId));
    }
    dispatch(getAllTerms());
  }, [activityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({
      ...prevData,
      longDesc: content,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Assigning the first selected file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      if (activityId) {
        // If activityId exists, dispatch the updateVote action
        await dispatch(
          updateActivity({ id: activityId, updatedData: data })
        ).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Activity updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        // If no activityId, dispatch the createVote action
        await dispatch(createActivity(data)).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Activity created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div class="page-content">
      <div class="container-xxl">
        <div class="row justify-content-end container-top">
          <div class="col-auto mb-3">
            <form class="row g-2">
              <div class="col-auto">
                <button type="button" class="btn btn-primary btn-blue me-1">
                  Fetch Data from Quorum
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  class="btn btn-primary btn-green"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-12">
            <div class="card">
              <div class="card-header container-top">
                <div class="row align-items-center">
                  <div class="col">
                    <h4 class="card-title">Bill’s Information</h4>
                  </div>
                </div>
              </div>
              <div class="card-body pt-0">
                <div class="row">
                  <div class="col-lg-12">
                    <div class="mb-3 row">
                      <label
                        htmlFor="type"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Type{" "}
                      </label>
                      <div class="col-sm-10">
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          id="type"
                        >
                          <option value="" disabled>
                            Select bill type
                          </option>
                          <option value="senate">Senate</option>
                          <option value="house">House</option>
                        </select>
                      </div>
                    </div>

                    <div class="mb-3 row">
                      <label
                        htmlFor="example-text-input"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Title
                      </label>
                      <div class="col-sm-10">
                        <input
                          class="form-control"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          id="example-text-input"
                          placeholder="Enter the bill title"
                        />
                      </div>
                    </div>

                    <div class="mb-3 row">
                      <label
                        htmlFor="shortDesc"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Short Description{" "}
                      </label>
                      
                    </div>

                    <div class="mb-3 row">
                      <label
                        htmlFor="longDesc"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Long Description
                      </label>
                      <div class="col-sm-10 editor--bottom-spacer">
                        <Editor
                          apiKey="YOUR_TINYMCE_API_KEY"
                          initialValue={formData.longDesc}
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              'advlist autolink lists link image charmap print preview anchor',
                              'searchreplace visualblocks code fullscreen',
                              'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar:
                              'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | help'
                          }}
                          onEditorChange={handleEditorChange}
                        />
                      </div>
                    </div>

                    <div class="mb-3 row">
                      <label
                        htmlFor="date"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Date{" "}
                      </label>
                      <div class="col-sm-10">
                        <input
                          class="form-control"
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div class="mb-3 row">
                      <label
                        htmlFor="congress"
                        class="col-sm-2 col-form-label text-md-end"
                      >
                        Congress
                      </label>
                      <div class="col-sm-10">
                        <input
                          class="form-control"
                          type="text"
                          id="congress"
                          name="congress"
                          value={formData.congress}
                          onChange={handleChange}
                          placeholder="Enter the congress number"
                        />
                      </div>
                    </div>

                    <div className="mb-3 row">
                      <label
                        htmlFor="termId"
                        className="col-sm-2 col-form-label text-md-end"
                      >
                        Term
                      </label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          aria-label="Select term"
                          name="termId"
                          value={formData.termId}
                          onChange={handleChange}
                          id="termId"
                        >
                          <option value="" disabled>
                            Select term
                          </option>
                          {terms.map((term) => (
                            <option value={term._id}>{term.name}</option>
                          ))}
                          {/* Add other options as needed */}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3 row">
                      <label
                        htmlFor="rollCall"
                        className="col-sm-2 col-form-label text-md-end"
                      >
                        Roll Call
                      </label>
                      <div className="col-sm-10">
                        <div className="input-group">
                          <span className="input-group-text" id="rollCallAddon">
                            URL
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="rollCall"
                            name="rollCall"
                            aria-describedby="rollCallAddon"
                            value={formData.rollCall}
                            onChange={handleChange}
                            placeholder="Enter the roll call URL"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label
                        htmlFor="readMore"
                        className="col-sm-2 col-form-label text-md-end"
                      >
                        Read More
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="file"
                          className="form-control"
                          id="readMore"
                          name="readMore"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    {activityId && formData.readMore && (
                      <div className="mb-3 row">
                        <label className="col-sm-2 col-form-label text-md-end">
                          Preview Read More
                        </label>
                        <div className="col-sm-10">
                          <Link
                            className="form-control"
                            target="_blank"
                            rel="noopener noreferrer"
                            to={`${API_URL}${formData.readMore}`}
                          >
                            <u className="text-blue">{`${formData.readMore}`}</u>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
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

export default AddActivity;
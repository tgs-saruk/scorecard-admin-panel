import React, { useEffect, useState } from "react";
import Footer from "../global/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteSenator, getAllSenators } from "../../redux/slice/senetorSlice";
import user from "../../assets/image/users/user.avif";
import { API_URL } from "../../redux/api/API";
import { getAllSenatorData } from "../../redux/slice/senetorTermSlice";
import Swal from "sweetalert2";
import Loader from "../global/Loader";
import axios from "axios"; // Import axios for making API calls
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon from Material UI
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon from Material UI

function Senators() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, senators = [] } = useSelector((state) => state.senator); // Ensure senators is always an array
  const { senatorData } = useSelector((state) => state.senatorData);
  // console.log(senatorData);

  const [row, setRow] = useState(senators);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllSenators());
    dispatch(getAllSenatorData());
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
          await dispatch(deleteSenator(id)).unwrap();
          await dispatch(getAllSenators()).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The senator has been removed.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Error deleting senator:", error);
          Swal.fire(
            "Error!",
            "Failed to delete senator. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-senator/${id}`);
  };

  // Function to fetch senators from Quorum
  const fetchSenatorsFromQuorum = async () => {
    try {
      const response = await axios.post("http://localhost:4000/fetch-quorum/store-data");
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Senators fetched from Quorum successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
        dispatch(getAllSenators()); // Refresh the list of senators
      } else {
        throw new Error("Failed to fetch senators from Quorum");
      }
    } catch (error) {
      console.error("Error fetching senators from Quorum:", error);
      Swal.fire(
        "Error!",
        "Failed to fetch senators from Quorum. Please try again.",
        "error"
      );
    }
  };

  // Calculate pagination
  const indexOfLastSenator = currentPage * entriesPerPage;
  const indexOfFirstSenator = indexOfLastSenator - entriesPerPage;
  const currentSenators = senators.slice(
    indexOfFirstSenator,
    indexOfLastSenator
  );

  const totalPages = Math.ceil(senators.length / entriesPerPage);

  // Change page safely
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle entries per page change
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  useEffect(() => {
    // console.log("Senators list:", senators);
    if (search) {
      setRow(
        senators.filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setRow(senators.slice(indexOfFirstSenator, indexOfLastSenator));
    }
  }, [senators, search, currentPage, entriesPerPage]);

  useEffect(() => {
    let filteredSenators = senators.map((senator) => {
      const matchingSenatorData = senatorData.filter(
        (data) => data.senateId === senator._id
      );

      // If multiple matching records exist, find the one with `currentTerm === true`
      const senatorRating =
        matchingSenatorData.length > 1
          ? matchingSenatorData.find((h) => h.currentTerm === true)?.rating
          : matchingSenatorData[0]?.rating;

      return {
        ...senator,
        rating: senatorRating,
      };
    });

    // console.log(filteredSenators);

    // Apply search filtering
    if (search) {
      filteredSenators = filteredSenators.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      filteredSenators = [...filteredSenators].sort((a, b) => {
        const valueA = a[sortField] ?? "";
        const valueB = b[sortField] ?? "";

        if (typeof valueA === "string") {
          return sortOrder === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        }
      });
    }

    // Apply pagination
    setRow(filteredSenators.slice(indexOfFirstSenator, indexOfLastSenator));
  }, [
    senators,
    senatorData,
    search,
    sortField,
    sortOrder,
    currentPage,
    entriesPerPage,
  ]);

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const columns = [
    { field: 'name', headerName: 'Senator', width: 200 },
    { field: 'state', headerName: 'State', width: 130 },
    { field: 'party', headerName: 'Party', width: 130 },
    { field: 'rating', headerName: 'Rating', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <EditIcon
            className="text-secondary fs-24 cursor-pointer hover-blue"
            onClick={() => handleEdit(params.row._id)}
          />
          <DeleteIcon
            className="text-secondary fs-24 cursor-pointer hover-red"
            onClick={() => handleDelete(params.row._id)}
          />
        </>
      ),
    },
  ];

  const rows = row.map((senator, index) => ({
    id: index + 1,
    _id: senator._id,
    name: senator.name,
    state: senator.state,
    party: senator.party.charAt(0).toUpperCase() + senator.party.slice(1).toLowerCase(),
    rating: senator.rating || "N/A",
  }));

  return (
    <>
      {loading && <Loader />}
      <div className="page-content">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header container-top">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-title">All Senators</h4>
                    </div>
                    <div className="col-auto">
                      <form className="row g-2">
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-custom me-1"
                            onClick={() => navigate("/add-senator")}
                          >
                            <i className="fa-solid fa-plus me-1"></i> Add
                            Senator
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-blue ml-2"
                            onClick={fetchSenatorsFromQuorum}
                          >
                            Fetch Senators from Quorum
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="card-body pt-0">
                  <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSizeOptions={[5, 10]}
                      sx={{ border: 0 }}
                    />
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Senators;

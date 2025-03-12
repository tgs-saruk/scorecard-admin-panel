import React, { useEffect, useState } from "react";
import Footer from "../global/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import user from "../../assets/image/users/user.avif";
import { API_URL } from "../../redux/api/API";
import { deleteHouse, getAllHouses } from "../../redux/slice/houseSlice";
import { getAllHouseData } from "../../redux/slice/houseTermSlice";
import Swal from "sweetalert2";
import Loader from "../global/Loader";
import axios from "axios"; // Import axios for making API calls
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';  
import DeleteIcon from '@mui/icons-material/Delete';  
function House() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, houses = [] } = useSelector((state) => state.house); // Ensure houses is always an array
  const { houseData } = useSelector((state) => state.houseData);
  const [row, setRow] = useState(houses);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllHouses());
    dispatch(getAllHouseData());
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
          await dispatch(deleteHouse(id)).unwrap();
          await dispatch(getAllHouses()).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The representative has been removed.",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          console.error("Error deleting representative:", error);
          Swal.fire(
            "Error!",
            "Failed to delete representative. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit-house/${id}`);
  };

  // Calculate pagination
  const indexOfLastHouse = currentPage * entriesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - entriesPerPage;
  const currentHouses = houses.slice(indexOfFirstHouse, indexOfLastHouse);

  const totalPages = Math.ceil(houses.length / entriesPerPage);

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
    if (search) {
      setRow(
        houses.filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setRow(houses.slice(indexOfFirstHouse, indexOfLastHouse));
    }
  }, [houses, search, currentPage, entriesPerPage]);

  useEffect(() => {
    let filteredHouses = houses.map((house) => {
      const matchingHouseData = houseData.filter(
        (data) => data.houseId === house._id
      );

      // If multiple matching records exist, find the one with `currentTerm === true`
      const houseRating =
        matchingHouseData.length > 1
          ? matchingHouseData.find((h) => h.currentTerm === true)?.rating
          : matchingHouseData[0]?.rating;

      return {
        ...house,
        rating: houseRating,
      };
    });

    // Apply search filtering
    if (search) {
      filteredHouses = filteredHouses.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      filteredHouses = [...filteredHouses].sort((a, b) => {
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
    setRow(filteredHouses.slice(indexOfFirstHouse, indexOfLastHouse));
  }, [
    houses,
    houseData,
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
    { field: 'name', headerName: 'Representative', width: 200 },
    { field: 'district', headerName: 'District', width: 130 },
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

  const rows = row.map((house, index) => ({
    id: index + 1,
    _id: house._id,
    name: house.name,
    district: house.district,
    party: house.party.charAt(0).toUpperCase() + house.party.slice(1).toLowerCase(),
    rating: house.rating || "N/A",
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
                      <h4 className="card-title">All Representatives</h4>
                    </div>
                    <div className="col-auto">
                      <form className="row g-2">
                        <div className="col-auto">
                          <button
                            type="button"
                            className="btn btn-custom me-1"
                            onClick={() => navigate("/add-house")}
                          >
                            <i className="fa-solid fa-plus me-1"></i> Add
                            Representative
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-blue ml-2"
                          >
                            Fetch Representatives from Quorum
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

export default House;

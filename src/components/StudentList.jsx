import React, { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [editData, setEditData] = useState(null);

  const [marksData, setMarksData] = useState({
    student_id: "",
    subject: "",
    score: "",
  });

  // FETCH STUDENTS + MARKS
  const fetchData = async () => {
    const res = await API.get(
      `/students?page=${page}&limit=5&search=${search}`
    );

    const studentsWithMarks = await Promise.all(
      res.data.data.map(async (student) => {
        const marksRes = await API.get(
          `/students/${student.id}/marks`
        );
        return {
          ...student,
          marks: marksRes.data,
        };
      })
    );

    setStudents(studentsWithMarks);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  // DELETE
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/students/${id}`);
        Swal.fire("Deleted!", "Student removed", "success");
        fetchData();
      }
    });
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      await API.put(`/students/${editData.id}`, editData);

      Swal.fire("Updated!", "Student updated successfully", "success");
      setEditData(null);
      fetchData();
    } catch (err) {
      Swal.fire("Error!", "Update failed", "error");
    }
  };

  // ADD MARKS
  const handleAddMarks = async () => {
    try {
      await API.post("/students/marks", marksData);

      Swal.fire("Success!", "Marks added!", "success");
      setMarksData({
        student_id: "",
        subject: "",
        score: "",
      });
      fetchData(); 
    } catch (err) {
      Swal.fire("Error!", "Failed to add marks", "error");
    }
  };

  return (
    <div className="container mt-4">
      {/* TOTAL COUNT ADDED */}
      <h3>All Students ({total})</h3>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>

            {/* MARKS COLUMN */}
            <th>Marks</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>

              {/* SHOW MARKS */}
              <td>
                {s.marks && s.marks.length > 0 ? (
                  s.marks.map((m) => (
                    <div key={m.id}>
                      <b>{m.subject}</b>: {m.score}
                    </div>
                  ))
                ) : (
                  <span className="text-muted">No Marks</span>
                )}
              </td>

              <td>
                {/* EDIT */}
                <button
                  className="btn btn-primary me-2"
                  onClick={() => setEditData(s)}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>

                {/* ADD MARKS */}
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    setMarksData({
                      student_id: s.id,
                      subject: "",
                      score: "",
                    })
                  }
                >
                  Add Marks
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          className="btn btn-secondary"
          onClick={() => setPage(page + 1)}
          disabled={students.length === 0}
        >
          Next
        </button>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Edit Student</h5>

              <input
                className="form-control mb-2"
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
                value={editData.email}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    email: e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
                value={editData.age}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    age: e.target.value,
                  })
                }
              />

              <button
                className="btn btn-success me-2"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setEditData(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARKS MODAL */}
      {marksData.student_id && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Add Marks</h5>

              <input
                className="form-control mb-2"
                placeholder="Subject"
                value={marksData.subject}
                onChange={(e) =>
                  setMarksData({
                    ...marksData,
                    subject: e.target.value,
                  })
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Score"
                type="number"
                value={marksData.score}
                onChange={(e) =>
                  setMarksData({
                    ...marksData,
                    score: e.target.value,
                  })
                }
              />

              <button
                className="btn btn-success"
                onClick={handleAddMarks}
              >
                Submit
              </button>

              <button
                className="btn btn-secondary ms-2"
                onClick={() =>
                  setMarksData({
                    student_id: "",
                    subject: "",
                    score: "",
                  })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
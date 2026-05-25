import React, { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

const StudentForm = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.age) {
      Swal.fire("Error!", "All fields are required", "error");
      return;
    }

    try {
      await API.post("/students", form);

      Swal.fire("Success!", "Student Added!", "success");

      // Reset form
      setForm({
        name: "",
        email: "",
        age: "",
      });

      refresh();
    } catch (err) {
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  return (
    <div className="container mt-3">
      <h5>Add New Student</h5>

      <form onSubmit={handleSubmit} className="p-3 border rounded">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <button className="btn btn-success w-100">Submit</button>
      </form>
    </div>
  );
};

export default StudentForm;
import React from "react";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <StudentForm refresh={()=>window.location.reload()} />
      <StudentList />
    </div>
  );
}

export default App;
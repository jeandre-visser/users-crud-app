import "./App.css";
import Navbar from "./components/navbar/navbar.component";
import UsersTableComponent from "./components/users-table/users-table.component";

function App() {
  return (
    <div className="main_container">
      <Navbar />
      <UsersTableComponent />
    </div>
  );
}

export default App;

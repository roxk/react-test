import "./App.css";
import { Route, Routes } from "react-router";
import { UserListScreen } from "./presentation/screens/UserListScreen";
import { UserDetailScreen } from "./presentation/screens/UserDetailScreen";

function App() {
  return (
    <Routes>
      <Route path="user/{id}" element={<UserDetailScreen />} />
      <Route path="user" element={<UserListScreen />} />
    </Routes>
  );
}

export default App;

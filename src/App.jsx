import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import { UserContextProvider } from "./context/UserContext";
import { SnackbarProvider } from 'notistack';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <UserContextProvider>
      <BrowserRouter>
      
        <Routes>
          <Route path="/login" element={<SignIn />} />
          {/* <Route path="/inscripciones" element={<Home form="true" />} /> */}
          <Route path="/" element={<Home route=""/>} />
          <Route path="/by-date" element={<Home route="by-date"/>} />
          <Route path="/add-employee" element={<Home route="add-employee"/>} />
          <Route path="/patients-table" element={<Home route="patients-table"/>} />
          <Route path="/employees-table" element={<Home route="employees-table"/>} />
          <Route path="/add-patient" element={<Home route="add-patient"/>} />
          <Route path="/vaccinations-table" element={<Home route="vaccinations-table"/>} />
          <Route path="/to-expire-table" element={<Home route="to-expire-table"/>} />
        </Routes>
    
      </BrowserRouter>
    </UserContextProvider>
    </SnackbarProvider >
  );
}

export default App;

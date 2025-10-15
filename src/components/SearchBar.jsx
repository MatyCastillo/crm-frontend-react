import React, { useState, useRef } from "react";
import { TextField, InputAdornment, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";

const formatDNI = (value) => {
  const cleanedValue = value.replace(/\D/g, ""); // Remover todo excepto números
  if (cleanedValue.length > 10) return cleanedValue.slice(0, 8);
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const SearchBar = ({ onSearch }) => {
  const searchInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    const rawValue = event.target.value;
    // Eliminar puntos al ingresar
    const valueWithoutDots = rawValue.replace(/\./g, "");
    // Eliminar ceros al principio al setear el estado
    const formattedValue = valueWithoutDots.replace(/^0+/, "");
    setSearchQuery(formatDNI(formattedValue));
  };

  const handlePaste = async () => {
    try {
      let clipboardText = await navigator.clipboard.readText();
      clipboardText = clipboardText
        .replace(/\./g, "")
        .replace(/^0+/, "")
        .replace(/\s+/g, "");
      if (/^\d+$/.test(clipboardText)) {
        setSearchQuery(clipboardText);
        searchInputRef.current.focus();
      }
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    // onSearch(searchQuery); // Llama a la función onSearch con una cadena vacía
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Pasar el DNI sin puntos y sin ceros al principio
    onSearch(searchQuery.replace(/\./g, ""));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", alignItems: "center" }}
    >
      <TextField
        inputRef={searchInputRef}
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        placeholder="Buscar DNI..."
        size="small"
        helperText="Ingresar DNI sin puntos ni espacios, luego enter. Por ejemplo: 1123123"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Pegar desde portapapeles">
                <IconButton onClick={handlePaste}>
                  <ContentPasteGoIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={searchQuery ? handleClear : handleSubmit}
                edge="end"
              >
                {searchQuery ? (
                  <Tooltip title="Borrar todo">
                    <ClearIcon sx={{ color: "#258786" }} />
                  </Tooltip>
                ) : (
                  <Tooltip title="Buscar">
                    <SearchIcon sx={{ color: "#258786" }} />
                  </Tooltip>
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        style={{ marginRight: 8 }}
      />
    </form>
  );
};

export default SearchBar;

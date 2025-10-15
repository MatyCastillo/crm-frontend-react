import { Avatar, Button, Grid, IconButton, Tooltip } from "@mui/material";
import CancelIcon from "@mui/icons-material/CancelTwoTone";
import noImg from "../img/no-photo.png";

import React, { useState } from "react";

const ImageForm = (props) => {
  const [imgData, setImgData] = useState({ preview: noImg });
  const handleDniTitFPreview = (e) => {
    setImgData({
      preview: URL.createObjectURL(e.target.files[0]),
      img: e.target.files[0],
      img_nombre: e.target.name,
      prov_id: document.getElementById("nAsos").value,
    });
    console.log(document.getElementById("nAsos").value);
  };
  return (
    <Grid>
      {/*<img id="dniFront" src={imgPreview} style={{width: 56, height: 56}}/>*/}
      <IconButton
        aria-label="clearImg"
        color="error"
        onClick={() => setImgData({ preview: noImg })}
        sx={{ zIndex: "tooltip" }}
      >
        <Tooltip title="Eliminar imagen">
          <CancelIcon />
        </Tooltip>
      </IconButton>
      <Avatar
        variant="rounded"
        id="dniTitF"
        alt="no-photo"
        src={imgData.preview}
        sx={{ width: 100, height: 100, m: 2, mt: -4 }}
        style={{
          border: "0.1px solid  #E7441060",
        }}
      ></Avatar>
      <Button
        sx={{
          m: 2,
          mt: -1,
          maxWidth: "100px",
          textAlign: "center",
        }}
        component="label"
        variant="outlined"
      >
        {props.title}
        <input
          hidden
          id="dniTitF"
          name="dniTitF"
          accept="image/*"
          multiple
          type="file"
          onChange={handleDniTitFPreview}
        />
      </Button>
    </Grid>
  );
};

export default ImageForm;

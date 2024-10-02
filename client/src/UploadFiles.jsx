import React, { Component } from "react";
import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Avatar,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import api from "./api";
import { DOWNLOAD_API, GET_ALL_FILES, UPLOAD_API } from "./constants";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: undefined,
      fileInfos: [],
      message: "",
      isError: false,
    };
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  async downloadFile(file) {
    try {
      const response = await api.get(`${DOWNLOAD_API}${file.id}`, {
        responseType: "blob",
      });

      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.file_name);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.log("Error downloading file", err);
    }
  }

  async upload() {
    const currentFile = this.state.selectedFiles[0];
    const formData = new FormData();
    formData.append("file", currentFile);

    try {
      const response = await api.post(UPLOAD_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.data) {
        this.setState({
          message: response.data.message,
          selectedFiles: undefined, // Clear the selected file
        });
        document.getElementById("btn-upload").value = ""; // Reset file input field

        // Fetch the updated list of files after upload
        await this.componentDidMount();
      }
    } catch (error) {
      console.log("Error uploading file", error);
      this.setState({
        message: "Could not upload the file!",
        isError: true,
      });
    }
  }

  async componentDidMount() {
    try {
      const response = await api.get(GET_ALL_FILES);
      if (response && response.data) {
        this.setState({
          fileInfos: response.data,
        });
      }
    } catch (err) {
      console.log("Error fetching files", err);
    }
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  render() {
    const { selectedFiles, fileInfos } = this.state;

    return (
      <div className="upload-container">
        <p className="file-name-css">
          {selectedFiles && selectedFiles.length > 0
            ? selectedFiles[0].name
            : null}
        </p>
        <label htmlFor="btn-upload">
          <input
            id="btn-upload"
            name="btn-upload"
            style={{ display: "none" }}
            type="file"
            onChange={this.selectFile}
          />
          <Button className="btn-choose" variant="outlined" component="span">
            Choose Files
          </Button>
        </label>
        <span>&nbsp;&nbsp;</span>
        <Button
          className="btn-upload"
          color="primary"
          variant="contained"
          component="span"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </Button>

        <Box
          sx={{
            maxHeight: 500, // Set the max height for the scroll
            overflowY: "auto", // Enable vertical scroll
            marginTop: 2,
            border: "2px solid #007bff",
          }}
        >
          <ul className="list-group">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <Box key={index}>
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="download"
                        onClick={() => this.downloadFile(file)}
                      >
                        <DownloadIcon key={index} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${file.file_name}`} />
                  </ListItem>
                </Box>
              ))}
          </ul>
        </Box>
      </div>
    );
  }
}

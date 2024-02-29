import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";


const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) { 
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: process.env.REACT_APP_API_KEY,
              pinata_secret_api_key: process.env.REACT_APP_API_KEY_PINATA,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(resFile.data); // Log response data for debugging
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        await contract.methods.add(account, ImgHash).send({ from: account });
        console.log(account + " " + ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (error) {
        console.error("Error uploading image to Pinata:", error);
        alert("Unable to upload image to Pinata");
      }
    } else {
      alert("No image selected");
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          multiple
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;

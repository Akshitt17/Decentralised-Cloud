import React, { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [address, setAddress] = useState("");
  const pinataGatewayURL = "https://emerald-impressed-parrotfish-500.mypinata.cloud/ipfs/";

  const getData = async () => {
    try {
        let dataArray;
        const otherAddress = document.querySelector(".address").value;
        try
        {if (otherAddress) {
          dataArray = await contract.methods.display(address).call({ from: account });
        } else {
          dataArray = await contract.methods.display(account).call({ from: account });
        }
    }
    catch (error){
        console.error("Access:", error);
        alert("you Dont Have Access")
    }
  
      if (dataArray.length > 0) {
        const images = [];
        for (let i = 0; i < dataArray.length; i++) {
          const item = dataArray[i];
          const response = await fetch(`${pinataGatewayURL}${item.substring(7)}`, {
            method: 'GET',
          });
  
          if (response.ok) {
            // If the image is still available, add it to the images array
            images.push(
              <a href={`${pinataGatewayURL}${item.substring(7)}`} key={i} target="_blank" rel="noreferrer">
                <img
                  src={`${pinataGatewayURL}${item.substring(7)}`}
                  alt={`Image ${i}`}
                  className="image-list"
                />
              </a>
            );
          } else {
            // If the image is not available, remove it from the display
            console.log(`Image ${i} not pinned on Pinata, removing from display.`);
          }
        }
        
        setData(images);
      } else {
        alert("No image to display");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      alert("Error retrieving data");
    }
  };
  

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input type="text" placeholder="Enter Address" className="address" value={address} onChange={handleAddressChange} />
      <button className="button" onClick={getData}>
        Get Data
      </button>
    </>
  );
};

export default Display;

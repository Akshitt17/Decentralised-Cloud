import { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract, account }) => {
  const [selectedAddress, setSelectedAddress] = useState("");
  
  const sharing = async () => {
    const address = selectedAddress;
    await contract.methods.allow(address).send({ from: account });
    setModalOpen(false);
  };

  const denyAccess = async () => {
    const address = selectedAddress;
    await contract.methods.disallow(address).send({ from: account });
    setModalOpen(false);
  };

  useEffect(() => {
    const accessList = async () => {
      const accessList = await contract.methods.shareAccess().call({ from: account });
      let select = document.querySelector("#selectNumber");
      select.innerHTML = ""; // Clear previous options
  
      // Add default option
      let defaultOption = document.createElement("option");
      defaultOption.textContent = "People With Access";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      select.appendChild(defaultOption);
  
      // Iterate over the accessList and create options
      for (let i = 0; i < accessList.length; i++) {
        let access = accessList[i];
        let e1 = document.createElement("option");
        e1.textContent = `${access.user} - ${access.access ? 'Allowed' : 'Not Allowed'}`;
        e1.value = access.user;
        select.appendChild(e1);
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
              onChange={(e) => setSelectedAddress(e.target.value)}
            ></input>
          </div>
          <form id="myForm">
            <select id="selectNumber" onChange={(e) => setSelectedAddress(e.target.value)}>
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={sharing}>Share</button>
            <button onClick={denyAccess}>Deny Access</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

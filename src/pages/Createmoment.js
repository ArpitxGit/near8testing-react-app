import React, { useState, useEffect } from "react";
import _get from "lodash/get";
import _castArray from "lodash/castArray";
import { GiCancel } from "react-icons/gi";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import styles from "./createmoment.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ICON_STYLE = { color: "white", height: "100%", width: "100%" };

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "black",
  borderRadius: "10px",
  width: "80%",
  height: "80%",
  border: "2px solid #FFFFFF",
  fontSize: 18,
  wordBreak: "break-all",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  overflow: "auto",
};

function Createmoment() {
  const navigate = useNavigate();
  const [moments, setMoments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentMoment, setCurrentMoment] = useState(null);
  const [currentMomentId, setCurrentMomentId] = useState(null);

  const handleClose = () => {
    setCurrentMoment(null);
    setOpen(false);
  };

  // const {long,lat,time,name}=useLocation();
  // console.log(name,lat,time,name);
  //axios code required to bring string from backend
  // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const getfn = async () => {
      const xyz = await axios.get(`/userstr/str`, {
        headers: {
          "Content-Type": "*/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
        },
      });
      //console.log(xyz.data);
      setMoments(xyz.data);
      setIsLoading(false);
      document.getElementById("createBtn").scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    };
    getfn();
  }, []);

  const onModalLinkCLick = (moment) =>
    navigate("/form", { state: { moments: _castArray(moment) } });

  const submithandler = async (e) => {
    e.preventDefault();
    navigate("/form");
  };

  const handleMomentClick = async (moment) => {
    const { hasImage, cid, momentId } = moment || {};
    setOpen(true);

    const response = hasImage
      ? await axios.get(`https://${cid}.ipfs.nftstorage.link/metadata.json`)
      : await axios.get(`https://${cid}.ipfs.nftstorage.link`);
    const data = _get(response, "data");
    setCurrentMoment(data);
    setCurrentMomentId(momentId);
  };
  // const res2 = await axios.get(`https://${cid}.ipfs.nftstorage.link`);

  // console.log("👉 | submitHandler | res2", res2);

  const getValue = (key, value) => {
    switch (key) {
      case "linkedMoments":
        return (
          <div>
            {Object.keys(value).map((_key, i) => (
              <React.Fragment key={i}>
                <div className="value">{value[_key].name}</div>
              </React.Fragment>
            ))}
          </div>
        );

      default:
        return <div>{value}</div>;
    }
  };

  const momentDescription = () => {
    const description = JSON.parse(currentMoment?.description) || {};
    return (
      <div>
        {Object.entries(description).map(([key, value]) => (
          <div className={styles.modalValueDiv} key={key}>
            <div>{key} :</div>
            <div>{getValue(key, value)}</div>
          </div>
        ))}
      </div>
    );
  };

  return isLoading ? (
    <div className={styles.loader}>...Loading</div>
  ) : (
    <div className={styles.container}>
      {/* map the string here  */}

      {moments.map((moment) => {
        return (
          <div>
            <div
              key={moment._id}
              onClick={() => handleMomentClick(moment)}
              className={styles.momentItem}
            >
              {moment.userstring}
            </div>
          </div>
        );
      })}
      <Link to={"/form"}>
        <Button id={"createBtn"} className={styles.bt}>
          Create Moment
        </Button>
      </Link>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ ...style }}>
          {currentMoment ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  className={styles.bt}
                  onClick={() => onModalLinkCLick(currentMoment)}
                >
                  Link Moment
                </Button>
                <Box sx={{ cursor: "pointer", width: "40px", padding: "5px" }}>
                  <GiCancel style={ICON_STYLE} onClick={handleClose} />
                </Box>
              </Box>
              <Box sx={{ pt: 4 }}>
                <p>Moment ID: {currentMomentId}</p>
                {momentDescription()}
                {currentMoment?.image && (
                  <Box sx={{ width: "50%", margin: "auto" }}>
                    <img
                      src={`https://nftstorage.link/ipfs/${
                        currentMoment.image.split("//")[1]
                      }`}
                      alt="No Data"
                      className={styles.image}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <div className={styles.loader} style={{ height: "100%" }}>
              ...Loading
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Createmoment;

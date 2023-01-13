import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CupertinoPaneContainer from "../components/Landing/CupertinoPaneContainer";

import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { useNavigate, useLocation } from "react-router-dom";
import { NFTStorage } from "https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js";

import { FaRegCalendarAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { CiLocationOn } from "react-icons/ci";
import { connect, useSelector } from "react-redux";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";
import AsyncSelect from "react-select/async";
import _debounce from "lodash/debounce";
import _map from "lodash/map";
import _property from "lodash/property";
import _size from "lodash/size";

import "../pages/Formpage.css";
import logo from "../assets/logo.gif";

import { ethers } from "ethers";
import contractAbi from "../assets/contractabi.json";

import axios from "axios";
import PropTypes from "prop-types";

const ICON_STYLE = { color: "white" };

const dateOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const client = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_TOKEN,
});

const getDataFromResponse = _property("data.data");

function Formpage({ isMetaMaskConnected, metaMaskAddress }) {
  const navigate = useNavigate();
  const location = useLocation();
  const linkedMoments = _get(location, "state.moments", []);

  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);

  //console.log(linkedMoments);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [heading, setHeading] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [time, setTime] = useState("");
  const [rpy, setRpy] = useState("");
  const [height, setHeight] = useState("");
  const [rawDate, setRawDate] = useState("");
  const [rawTime, setRawTime] = useState("");
  const [file, setFile] = useState(null);
  const [geoAddress, setGeoAddress] = useState(null);

  const nameHandler = (e) => {
    setName(e.target.value);
  };
  const descHandler = (e) => {
    setDesc(e.target.value);
  };
  const heightHandler = (e) => {
    setHeight(e.target.value);
  };
  const rpyHandler = (e) => {
    setRpy(e.target.value);
  };
  const headingHandler = (e) => {
    setHeading(e.target.value);
  };

  const linkHandler = (e) => {
    setLink(e.target.value);
  };

  const cordHandler = (e) => {
    setCoordinate(e.target.value);
    setGeoAddress(null);
  };

  const currentCoordHandler = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported!");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const {
            coords: { latitude, longitude },
          } = pos || {};
          setCoordinate(`${latitude},${longitude}`);
          setGeoAddress(null);
        },
        () => {
          console.error("Unable to retrieve your location!");
        }
      );
    }
  };

  const dateHandler = (value) => {
    if (value) {
      setDate(value.toLocaleString("en-US", dateOptions).replaceAll("/", "."));
      setRawDate(value);
    }
  };

  const timeHandler = (value) => {
    if (value) {
      setTime(value.replace(":", ""));
      setRawTime(value);
    }
  };
  const fileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const geoAddressHandler = (option) => {
    const { value } = option;
    setCoordinate(value);
    setGeoAddress(option);
  };

  // if (sessionStorage.getItem("walletid")) {
  //   console.log("connected");
  // } else {
  //   console.log("not connected");
  // }
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const convertToDecimal = (bignumber) => {
    return ethers.utils.formatUnits(bignumber, 18);
  };

  const getHashString = () => {
    const coord = coordinate.split(",");
    const lat = coord[0];
    const long = coord[1];

    const newstr =
      "#" +
      lat +
      "," +
      long +
      "<" +
      date +
      "<" +
      time +
      "<" +
      (_isEmpty(heading) ? "0" : heading) +
      "<" +
      (_isEmpty(height) ? "0" : height) +
      "<" +
      (_isEmpty(rpy) ? "xxxxxx" : rpy);

    return newstr;
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!sessionStorage.getItem("walletid") && !isMetaMaskConnected) {
        alert("Connect your Wallet first");
      } else {
        window.alert(
          "You need to pay for the Gas fees of the trasaction, Later when we are live on mainnet users need to pay 1 MATIC + gas fees to create a moment. If you don't have MATIC testnet token, get some here https://faucet.polygon.technology/"
        );
        setIsSubmitInProgress(true);
        //await new Promise((r) => setTimeout(r, 5000));

        const jsonobj = {
          name: _isEmpty(name) ? "unnamed moment" : name,
          desc: _isEmpty(desc) ? "undescribed moment" : desc,
          heading: _isEmpty(heading) ? "0" : heading,
          link: _isEmpty(link) ? "NA" : link,
          coordinate: coordinate,
          time: time,
          date: date,
          height: _isEmpty(height) ? "0" : height,
          rpy: _isEmpty(rpy) ? "xxxxxx" : rpy,
          linkedMoments,
        };

        // call client.store, passing in the image & metadata
        const hasImage = !!file;
        const cid = hasImage
          ? await client
              .store({
                image: file,
                name: getHashString(),
                description: JSON.stringify(jsonobj),
              })
              .then((res) => res.ipnft)
          : await client.storeBlob(
              new Blob([
                JSON.stringify({
                  name: getHashString(),
                  description: JSON.stringify(jsonobj),
                }),
              ])
            );
        console.log(
          "---------------------------",
          cid,
          JSON.stringify(jsonobj)
        );

        await mintMoment({
          hasImage,
          name,
          coordinate,
          date,
          time,
          heading,
          height,
          rpy,
          cid,
        });

        setName("");
        setDesc("");
        setHeading("");
        setLink("");
        setCoordinate("");
        setTime("");
        setDate("");
        setRawTime("");
        setRawDate("");
        setHeight("");
        setRpy("");
        setFile(null);
        setIsSubmitInProgress(false);
      }
    } catch (err) {
      console.log(err);
      setIsSubmitInProgress(false);
    }
  };

  async function mintMoment({
    hasImage,
    name,
    coordinate,
    date,
    time,
    heading,
    height,
    rpy,
    cid,
  }) {
    try {
      console.log("Minting moment...");

      // const QUICKNODE_HTTP_ENDPOINT =
      //   "https://long-quick-log.matic-testnet.discover.quiknode.pro/a5aa95ffcb6a3688d8e9ec815aa6a55373c4d18d/";
      // const provider = new ethers.providers.JsonRpcProvider(
      //   QUICKNODE_HTTP_ENDPOINT
      // );

      //taking the provider from window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //sending request to get access of current logged address
      const accounts = await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();

      //declaring smart contract addressj
      //const contractAddress = "0xd9e033b50Ace0df931d04374cE24d8ab02A24518";
      const contractAddress = "0x6AF1F2B400c1433f3A5469CbA4122b3Ab3c4eec1";
      //creating an instance of smart contract
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      // const tx = await contractInstance.createMoment(accounts[0], cid, {
      //   value: ethers.utils.parseEther("1.0"),
      // });
      const tx = await contractInstance.createMoment(
        name,
        coordinate,
        date,
        time,
        heading,
        height,
        rpy,
        cid
      );
      const tokenName = await contractInstance.name();
      const tokenSymbol = await contractInstance.symbol();
      console.log(tokenName);
      console.log(tokenSymbol);

      //listening to CreatedMoment event
      contractInstance.on("CreatedMoment", async (sender, newMomentId) => {
        const newstr = getHashString();

        // update UI or store newMomentId in state
        console.log(sender, newMomentId);

        //posting hash to backend to show on UI
        const res = await axios.post(`${BACKEND_URL}/userstr/str`, {
          newstr,
          hasImage,
          cid,
          momentId: newMomentId?.toNumber(),
        });
        console.log(res);
        window.alert("NFT Minted Successfully!");
        navigate("/create");
      });

      let reciept = (await tx).wait();
      if (reciept) {
        console.log(
          "Transaction is successful!!!" + "\n" + "Transaction Hash:",
          (await tx).hash +
            "\n" +
            "Block Number: " +
            (await reciept).blockNumber +
            "\n" +
            "Navigate to https://mumbai.polygonscan.com/tx/" +
            (await tx).hash,
          "to see your transaction"
        );
      } else {
        console.log("Error submitting transaction");
      }
    } catch (e) {
      console.log("Error Caught in Catch Statement: ", e);
    }
  }

  const loadOptions = (inputValue, callback) => {
    if (_size(inputValue) < 4) return;
    const params = {
      access_key: process.env.REACT_APP_GEO_ACCESS_KEY,
      query: inputValue,
    };

    console.log("API Call with query", inputValue);
    axios
      .get("https://api.positionstack.com/v1/forward", { params })
      .then(getDataFromResponse)
      .then((response) => {
        const options = _map(response, ({ label, latitude, longitude }) => ({
          value: `${latitude},${longitude}`,
          label,
        }));
        callback(options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const debouncedLoadOptions = _debounce(loadOptions, 1000);

  const imgclick = (e) => {
    navigate("/");
  };
  //console.log(sessionStorage.getItem("walletid"));

  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSwipe = (index) => {
    if (index === step - 1) prevStep();
    if (index === step + 1) nextStep();
  };

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    heading: "",
    link: "",
    coordinate: "",
    time: "",
    date: "",
    rawDate: "",
    rawTime: "",
    rpy: "",
    height: "",
  });

  const OPTIONS = { dragFree: true };
  const SLIDE_COUNT = 3;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const [paneVisible, setPaneVisible] = useState(0);
  const initCallback = () => {
    console.log("initCallback");
    setPaneVisible((prev) => ++prev);
  };

  return (
    <>
      {isSubmitInProgress ? (
        <div className="submitLoading">Loading...</div>
      ) : (
        <div className="form--container theme-dark">
          <div className="topnav">
            <img onClick={imgclick} src={logo} alt="logo" height="100vh" />
            <div className="xyz">
              <div className="h8">Wallet ID</div>
              {sessionStorage.getItem("walletid") ? (
                <div className="h8">{sessionStorage.getItem("walletid")}</div>
              ) : (
                <div className="h8">Not connected</div>
              )}
            </div>
          </div>
          <h2>Create a Moment</h2>
          <form className="contactform">
            <p>
              <input
                value={name}
                onChange={nameHandler}
                placeholder="Name"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <input
                value={desc}
                onChange={descHandler}
                placeholder="Description"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <input
                value={link}
                onChange={linkHandler}
                placeholder="Link"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <div className="coordinateDiv contactformInput">
                <AsyncSelect
                  value={geoAddress}
                  onChange={geoAddressHandler}
                  loadOptions={debouncedLoadOptions}
                  className="asyncSelect"
                  classNamePrefix="asyncSelect"
                />
                <button onClick={currentCoordHandler} className="mybtn">
                  <CiLocationOn style={ICON_STYLE} />
                </button>
              </div>
            </p>
            <p>
              <input
                disabled
                value={coordinate}
                onChange={cordHandler}
                placeholder="Co-ordinates(longitude,latitude)"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <input
                value={heading}
                onChange={headingHandler}
                placeholder="Heading"
                className="contactformInput"
              ></input>
            </p>
            {/* <p><Button>Fetch</Button></p> */}
            <p>
              <DatePicker
                onChange={dateHandler}
                value={rawDate}
                format="MM.dd.yyyy"
                className="contactformInput calendarClassName"
                clearIcon={<GiCancel style={ICON_STYLE} />}
                calendarIcon={<FaRegCalendarAlt style={ICON_STYLE} />}
              />
            </p>
            <p>
              <TimePicker
                value={rawTime}
                onChange={timeHandler}
                disableClock
                className="contactformInput"
                clearIcon={<GiCancel style={ICON_STYLE} />}
              />
            </p>
            <p>
              <input
                value={height}
                onChange={heightHandler}
                placeholder="Height (Floor/Absolute)"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <input
                value={rpy}
                onChange={rpyHandler}
                placeholder="Roll,Pitch,Yaw"
                className="contactformInput"
              ></input>
            </p>
            <p>
              <input
                type="file"
                onChange={fileChange}
                placeholder="Roll,Pitch,Yaw"
                className="contactformInput"
              ></input>
            </p>
            <button onClick={submitHandler} className="mybtn">
              Mint Moment
            </button>
          </form>

          <CupertinoPaneContainer
            refreshToken={"token"}
            parentClass="loginPage"
            className="loginForm"
            initCallback={initCallback}
          >
            <EmblaCarousel
              slides={SLIDES}
              options={OPTIONS}
              containerVisible={paneVisible}
            />
          </CupertinoPaneContainer>
        </div>
      )}
    </>
  );
}

const EmblaCarousel = (props) => {
  const { formData, handleChange, nextStep, prevStep, containerVisible } =
    props;
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi, setScrollProgress]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  useEffect(() => {
    console.log("emblaApi", emblaApi);
    if (containerVisible && emblaApi) {
      console.log("emblaApiReInit");
      emblaApi.reInit();
    }
  }, [containerVisible, emblaApi]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={containerVisible ? emblaRef : null}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <span>{index + 1}</span>
              </div>

              {index === 0 && (
                <Step1
                  formData={formData}
                  handleChange={handleChange}
                  nextStep={nextStep}
                />
              )}
              {index === 1 && (
                <Step2
                  formData={formData}
                  handleChange={handleChange}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {index === 2 && <Step3 formData={formData} prevStep={prevStep} />}
            </div>
          ))}
        </div>
      </div>
      <div className="embla__progress">
        <div
          className="embla__progress__bar"
          style={{ transform: `translateX(${scrollProgress}%)` }}
        />
      </div>
    </div>
  );
};

const Step1 = (props) => {
  const { formData, handleChange, nextStep, prevStep } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Name"
            className="contactformInput"
          ></input>
        </p>
      </div>
    </>
  );
};
const Step2 = (props) => {
  const { formData, handleChange, nextStep, prevStep } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Co-ordinates(longitude,latitude)"
            className="contactformInput"
          ></input>
        </p>
      </div>
    </>
  );
};
const Step3 = (props) => {
  const { formData, handleChange, nextStep, prevStep } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <DatePicker
            onChange={handleChange}
            format="MM.dd.yyyy"
            className="contactformInput calendarClassName"
            clearIcon={<GiCancel style={ICON_STYLE} />}
            calendarIcon={<FaRegCalendarAlt style={ICON_STYLE} />}
          />
        </p>
        <p>
          <TimePicker
            onChange={handleChange}
            disableClock
            className="contactformInput"
            clearIcon={<GiCancel style={ICON_STYLE} />}
          />
        </p>
      </div>
    </>
  );
};

Formpage.propTypes = {
  isMetaMaskConnected: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isMetaMaskConnected: state.metamask.isMetaMaskConnected,
  metaMaskAddress: state.metamask.metaMaskAddress,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Formpage);

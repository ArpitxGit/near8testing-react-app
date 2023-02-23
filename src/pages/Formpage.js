import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  DotButton,
  PrevButton,
  NextButton,
} from "../components/Landing/EmblaCarouselDotsButtons";
import CupertinoPaneContainer from "../components/Landing/CupertinoPaneContainer";

import _isEmpty from "lodash/isEmpty";
import _get from "lodash/get";
import { useNavigate, useLocation } from "react-router-dom";
import { NFTStorage } from "nft.storage";

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

  const cordHandler = (cordHandleEvent) => {
    setCoordinate(cordHandleEvent.target.value);
    console.log("cordHandleEvent.target.value", cordHandleEvent.target.value);
    setGeoAddress(null);
  };

  const currentCoordHandler = (coordEvent) => {
    console.log("coordEvent", coordEvent);
    // coordEvent.preventDefault();
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported!");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("pos", pos);
          const {
            coords: { latitude, longitude },
          } = pos || {};
          formData.coordinate = `${latitude},${longitude}`;
          setCoordinate(`${latitude},${longitude}`);
          console.log("${latitude},${longitude}", `${latitude},${longitude}`);
          setGeoAddress(null);
        },
        () => {
          console.error("Unable to retrieve your location!");
        }
      );
    }
  };

  const dateHandler = (value) => {
    console.log("date value", value);
    if (value) {
      setDate(value.toLocaleString("en-US", dateOptions).replaceAll("/", "."));
      console.log(
        "setDate",
        value.toLocaleString("en-US", dateOptions).replaceAll("/", ".")
      );
      setRawDate(value);
    }
  };

  const timeHandler = (value) => {
    console.log("time value", value);
    if (value) {
      setTime(value.replace(":", ""));
      console.log("setTime", value.replace(":", ""));
      setRawTime(value);
    }
  };

  const setDateTime = (event) => {
    var date = new Date(event.target.value);

    // Use the getMonth(), getDate(), and getFullYear() methods to construct the formatted string
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var year = date.getFullYear().toString();
    var formattedDate = month + "." + day + "." + year;

    // Use the getHours() and getMinutes() methods to get the time
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Add leading zeroes if necessary
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    // Concatenate the hours and minutes to get the desired format
    var time = hours + "" + minutes;

    formData["date"] = formattedDate;
    formData["time"] = time;
    setDate(formattedDate);
    console.log("formattedDate", formattedDate);
    setTime(time);
    console.log("time", time);
  };

  const fileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const geoAddressHandler = (option) => {
    console.log("option", option);
    const { value } = option;
    setCoordinate(value);
    setGeoAddress(option);
    formData.coordinate = `${value}`;
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
        console.log("jsonobj", jsonobj);

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

  const submitHandlerDrawer = async (e) => {
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
          name: _isEmpty(formData["name"])
            ? "unnamed moment"
            : formData["name"],
          desc: _isEmpty(formData["desc"])
            ? "undescribed moment"
            : formData["desc"],
          heading: _isEmpty(formData["heading"]) ? "0" : formData["heading"],
          link: _isEmpty(formData["link"]) ? "NA" : formData["link"],
          coordinate: formData["coordinate"],
          time: formData["time"],
          date: formData["date"],
          height: _isEmpty(formData["height"]) ? "0" : formData["height"],
          rpy: _isEmpty(formData["rpy"]) ? "xxxxxx" : formData["rpy"],
          linkedMoments,
        };
        console.log("jsonobj", jsonobj);

        // call client.store, passing in the image & metadata
        const hasImage = !!file;
        const cid = hasImage
          ? await client
              .store({
                image: formData["file"],
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
          name: formData["name"],
          coordinate: formData["coordinate"],
          date: formData["date"],
          time: formData["time"],
          heading: formData["heading"],
          height: formData["height"],
          rpy: formData["rpy"],
          cid,
        });

        setFormData({
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
          file: null,
        });

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
    // console.log("event", event);
    const { name, value } = event.target;
    // console.log("name, value", name, value);
    setFormData((formData) => ({ ...formData, [name]: value }));
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
    file: null,
  });

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  const OPTIONS = { dragFree: true };
  const SLIDE_COUNT = 9;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const [paneVisible, setPaneVisible] = useState(0);
  const initCallback = () => {
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
            <EmblaCarouselNav
              slides={SLIDES}
              options={OPTIONS}
              containerVisible={paneVisible}
              handleChange={handleChange}
              formData={formData}
              setFormData={setFormData}
              submitHandlerDrawer={submitHandlerDrawer}
              setFile={setFile}
              setDateTime={setDateTime}
              cordHandler={cordHandler}
              geoAddress={geoAddress}
              geoAddressHandler={geoAddressHandler}
              debouncedLoadOptions={debouncedLoadOptions}
              currentCoordHandler={currentCoordHandler}
            />
          </CupertinoPaneContainer>
        </div>
      )}
    </>
  );
}

const EmblaCarouselNav = (props) => {
  const {
    formData,
    handleChange,
    nextStep,
    prevStep,
    containerVisible,
    setFormData,
    geoAddress,
    geoAddressHandler,
    debouncedLoadOptions,
    currentCoordHandler,
    submitHandlerDrawer,
    setFile,
    setDateTime,
    cordHandler,
  } = props;
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  useEffect(() => {
    if (containerVisible && emblaApi) {
      emblaApi.reInit();
    }
  }, [containerVisible, emblaApi]);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  return (
    <>
      <button onClick={submitHandlerDrawer} className="mybtn">
        Mint Moment
      </button>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
      <div className="embla contactform">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((index) => (
              <div className="embla__slide" key={index}>
                {index === 0 && (
                  <Step1
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                  />
                )}
                {index === 1 && (
                  <Step5
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={handleChange}
                  />
                )}
                {index === 2 && (
                  <Step4
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={handleChange}
                  />
                )}
                {index === 3 && (
                  <Step2
                    geoAddress={geoAddress}
                    geoAddressHandler={geoAddressHandler}
                    debouncedLoadOptions={debouncedLoadOptions}
                    currentCoordHandler={currentCoordHandler}
                    formData={formData}
                    handleChange={cordHandler}
                  />
                )}
                {index === 4 && (
                  <Step6
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={handleChange}
                  />
                )}
                {index === 5 && (
                  <Step3
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={setDateTime}
                  />
                )}
                {index === 6 && (
                  <Step7
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={handleChange}
                  />
                )}
                {index === 7 && (
                  <Step8
                    formData={formData}
                    prevStep={prevStep}
                    handleChange={handleChange}
                  />
                )}
                {index === 8 && (
                  <Step9
                    formData={formData}
                    setFormData={setFormData}
                    handleChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>
    </>
  );
};

const Step1 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Name"
            className="contactformInput"
            name="name"
          ></input>
        </p>
      </div>
    </>
  );
};
const Step2 = (props) => {
  const {
    geoAddress,
    geoAddressHandler,
    debouncedLoadOptions,
    currentCoordHandler,
    handleChange,
    formData,
  } = props;
  return (
    <>
      <div className="embla__slide__img">
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
            onChange={handleChange}
            value={formData["coordinate"]}
            placeholder="Co-ordinates(longitude,latitude)"
            className="contactformInput"
            name={"coordinates"}
          ></input>
        </p>
      </div>
    </>
  );
};
const Step3 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          {/* <DatePicker
            onChange={handleChange}
            format="MM.dd.yyyy"
            className="contactformInput calendarClassName"
            clearIcon={<GiCancel style={ICON_STYLE} />}
            calendarIcon={<FaRegCalendarAlt style={ICON_STYLE} />}
            name="date"
          /> */}
          <input
            className="bg-black text-white text-2xl"
            type="datetime-local"
            id="date"
            name="date"
            onChange={handleChange}
          ></input>
        </p>
        <p>
          {/* <TimePicker
            onChange={handleChange}
            disableClock
            className="contactformInput"
            clearIcon={<GiCancel style={ICON_STYLE} />}
          /> */}
          {/* <input
            className="bg-black text-white text-2xl"
            type="time"
            id="time"
            name="time"
            min="00:00"
            max="24:00"
            onChange={handleChange}
          ></input> */}
        </p>
      </div>
    </>
  );
};

const Step4 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Link"
            className="contactformInput"
            name={"link"}
          ></input>
        </p>
      </div>
    </>
  );
};

const Step5 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Description"
            className="contactformInput"
            name={"desc"}
          ></input>
        </p>
      </div>
    </>
  );
};

const Step6 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Heading"
            className="contactformInput"
            name={"heading"}
          ></input>
        </p>
      </div>
    </>
  );
};

const Step7 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Height (Floor/Absolute)"
            className="contactformInput"
            name={"height"}
          ></input>
        </p>
      </div>
    </>
  );
};

const Step8 = (props) => {
  const { handleChange } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            onChange={handleChange}
            placeholder="Roll/Pitch/Yaw"
            className="contactformInput"
            name={"rpy"}
          ></input>
        </p>
      </div>
    </>
  );
};

const Step9 = (props) => {
  const { setFormData } = props;
  return (
    <>
      <div className="embla__slide__img">
        <p>
          <input
            type="file"
            onChange={(event) => {
              const file = event.target.files[0];
              setFormData((formData) => ({ ...formData, file }));
            }}
            className="contactformInput"
          ></input>
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

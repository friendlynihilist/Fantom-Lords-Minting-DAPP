import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import ListApp from "./listApp";
import { Container, Row, Col, FormCheck, InputGroup, FormControl } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import questionCard from './assets/question_mark.png';
import crystalBall from './assets/crystalball.png';
import tune from './assets/fantomLords.mp3';
import nftkey from './assets/nftkey.svg';
import MusicCard from './player';

library.add(faUser);
library.add(faDiscord);
library.add(faTwitter);

import Background from "./assets/scroll_bg_test.png";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";


const iconStyle = {
  // fontFamily: 'sans-serif',
  // textAlign: 'center',

  color: '#f5f5f5',
  filter: 'drop-shadow(2px 4px #6b33ee)'
};

const disabledButton = {
    cursor: 'not-allowed',
    pointerEvents: 'none'
}

const displayNone = {
  display: 'none'
}

// fontawesome.library.add(faCheckSquare, faCoffee);

let actualDate = new Date();
let mintDate = new Date('2021-11-25T23:30:00Z');
let actualYear = actualDate.getFullYear();

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border: 1px solid black;
  background-color: var(--secondary);
  font-family: "VCROSDMONO", monospace;
  font-size: 2rem;
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImgBak = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const HeaderTitle = styled.span`
text-shadow: 2px 4px #6b33ee;
text-align: center;
font-size: 4rem;
color: var(--primary-text);
font-family: 'Alagard', monospace;
font-weight: bold;
color: "var(--accent-text)";
  @media (min-width: 900px) {
    font-size: 5rem;
    text-shadow: 2px 6px #6b33ee;
  }
  @media (min-width: 1000px) {
    font-size: 8.5rem;
    text-shadow: 2px 8px #6b33ee;
  }
  transition: width 0.5s;
`;

export const DivTitle = styled.span`
text-align: center;
font-size: 1.6rem;
color: var(--primary);
font-family: 'Alagard', monospace;
font-weight: bold;
color: "var(--accent-text)";
  @media (min-width: 900px) {
    font-size: 2rem;
  }
  @media (min-width: 1000px) {
    font-size: 2.5rem;
  }
  transition: width 0.5s;
`;

export const StyledViewer = styled.img`
  width: 250px;
  @media (min-width: 900px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 60%;
  }
  @media (min-width: 1200px) {
    width: 50%;
  }
  transition: width 0.5s;
`;

export const StyledImg = styled.img`
  width: 350px;
  @media (min-width: 900px) {
    width: 550px;
  }
  @media (min-width: 1000px) {
    width: 800px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Summoning your Fantom Lord...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Something interfered with the evocation. Try again later. ¯\\_(ツ)_/¯");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Congratulations, your summoning was a success!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const startTrack = () => {
    let audioRef = new Audio(tune);
    audioRef.play();
  }

  async function awaitInsideForLoop(owner) {
    let lordsArray = [];
    for (let i = 0; i < 3333; i++) {
        let result = await getOwnerOf(owner)
        if (result === true) {
          lordsArray.push(i);
        }
    }
    console.log(lordsArray);
}

  const getOwnerOf = (owner) => {
    let ownerAddress = blockchain.smartContract.methods.ownerOf(i).call();
    if (String(ownerAddress) === String(owner)) {
      return true;
    } else {
      return false;
    }
  }
  

  // const playPause = () => {
  //   const [playing, setPlaying] = useState(false);
  //   const audioRef = useRef(new Audio(tune));

  //   // const play = ()

  //   if (!isPlaying) {
  //     console.log('play');
  //     isPlaying = true;
  //       audioRef.play();
  //   } else {
  //     console.log('pause');
  //       audioRef.pause();
  //   }
  // }

  const fetchRarity = (id) => {
    console.log(id);
    if (typeof id != null) {
      // Simple GET request using fetch
      fetch(`https://ipfs.io/ipfs/QmWEMQjjimkoAPFz913hGHPf9EtxH2hZKi6STydq7q2Hx1/${id}.json`)
          .then(response => response.json())
          .then(data => document.getElementById('hero-name').innerHTML = data.name);
    } else {
      document.getElementById('hero-name').innerHTML = 'Pondering...'
    }
}

  
  const [fetchID, setData]=useState(null);
  const [printID, setPrint]=useState(false);
  const getRarityData = (evt) => {
    setData(evt.target.value);
    setPrint(false);
    // fetchText(evt.target.value);
  }

  const viewImage = (id) => {
    let numId = Number(id);
    if (numId <= data.totalSupply && numId != 1 && numId != 2 && numId != 3) {
      return `https://ipfs.io/ipfs/QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/${numId}.png`
    }
    if (numId === 1 || numId === 2 || numId === 3) {
      return `https://ipfs.io/ipfs/QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/${numId}.gif`
    }
  }

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  });

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      {/* <MusicCard></MusicCard> */}
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <HeaderTitle>
              Fantom Lords
            </HeaderTitle>
            
{/* 
            <s.respContainer>
              
            <AudioPlayer
              customAdditionalControls={[]}
              customVolumeControls={[]}
              showJumpControls={false}
              layout="horizontal-reverse"
              autoPlay
              src={tune}
              // other props here
            />
              
            </s.respContainer> */}

            
        {/* <StyledLogo alt={"logo"} src={"/config/images/logo.png"} /> */}
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={1}
            jc={"center"}
            ai={"center"}
            style={{
              // backgroundColor: "var(--accent)",
              // padding: 24,
              // borderRadius: 24,
              // border: "4px dashed var(--secondary)",
              // boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <StyledImg
              alt={"The Great Summoning"}
              src={"/config/images/ritual_template_rect.png"}
              
              // style={{ transform: "scaleX(-1)" }}
            />
            {/* BUTTON HERE */}

            {/* BUTTON HERE */}
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {/* {data.totalSupply} / {CONFIG.MAX_SUPPLY} */}
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            {/* <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall /> */}
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The Great Summoning has ended.
                </s.TextTitle>
                <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          getOwnerOf('0x4a03721C829Ae3d448bF37Cac21527cbE75fc4Cb');
                        }}
                        // style={disabledButton}
                      >
                        {claimingNft ? "BUSY" : "SUMMON NOW"}
                        {/* {claimingNft ? "BUSY" : "NOT YET TIME"} */}
                      </StyledButton>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find vagrant Fantom Lords at:
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={"https://nftkey.app/collections/fantomlords/"}>
                  NFTKey
                </StyledLink>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  or
                </s.TextDescription>
                <StyledLink target={"_blank"} href={"https://paintswap.finance/marketplace/collections/0xfee8077c909d956e9036c2d2999723931cefe548"}>
                  PaintSwap
                </StyledLink>
              </>
            ) : (
              <>
                
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {/* Excluding gas fees. */}
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                  
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        startTrack();
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      ATTUNE
                    </StyledButton>
                    
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      You're summoning {mintAmount} Fantom Lord(s) for {mintAmount * 20} FTM (+ gas fees).
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          fontSize: "30px"
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                          // console.log(blockchain.account);
                        }}
                        // style={disabledButton}
                      >
                        {claimingNft ? "BUSY" : "SUMMON NOW"}
                        {/* {claimingNft ? "BUSY" : "NOT YET TIME"} */}
                      </StyledButton>
                     
                     
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

        {/* SECTION */}
        <s.respContainer jc={"center"} ai={"center"} 
        style={{ 
          // width: "90%", 
          backgroundColor: "#dea562",
          border: "9px solid #bd754a",
          textAlign: "left",
          paddingTop: 30,
          paddingLeft: 30,
          paddingRight: 30,
          paddingBottom: 30
          // height: "100%", 
          // backgroundImage: `url(${Background})`, 
          // backgroundRepeat: "no-repeat", 
          // backgroundSize: "cover", 
          // backgroundPosition: "center"
          }}
          >
            <s.SpacerMedium />
          <DivTitle>
            Summon a Fantom Lord...
          </DivTitle>
          <s.SpacerMedium />
          
          <ResponsiveWrapper flex={1}>
        <s.Container flex={1} jc={"start"} ai={"center"} style={{ padding: 10}}>

          <StyledImg
              alt={"Fantom Lords preview"}
              src={"/config/images/previewsite.gif"}     
              style={{ width: "100%"}}
            />

            </s.Container>

            <s.Container flex={2} jc={"start"} ai={"center"} style={{ padding: 10}}>
          <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
              paddingBottom: 20,
              borderBottom: "9px solid rgb(189, 117, 74)"
            }}
          > 
          <span style={{fontWeight: 'bold'}}>Fantom Lords are an epic collection of 3333 randomly generated lordly NFTs on the Fantom blockchain.</span>
          <br/>
          Fantom Lords are powerful multidimensional travelers with their own agendas of gallant quests, treacheries, warfare and galas. 
          Once conjured, they (usually) swear allegiance to their summoner and master (that will be <span style={{fontStyle: 'italic'}}>you</span>).
          Anyhow, whether you want it or not, they will take by storm the Fantomverse.
          </s.TextDescription>
          <s.SpacerMedium />
          {/* <s.SpacerSmall /> */}
          

          </s.Container>
          </ResponsiveWrapper>
          <s.SpacerMedium />
          <s.SpacerMedium />
          <DivTitle>
            Attributes
          </DivTitle>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}

          Each Fantom Lord is magically <span style={{fontWeight: 'bold'}}>generated from over 70+ possible traits</span>, including Classes, Ancestries, Weapons, Armors, Relics and more. They also have different rarity, and rumors say that even a few Legendaries are among them...
          <br/>
          Moreover, Lords metadata are hosted on IPFS, a permanent decentralised data storage, and validated on the Blockchain as ERC-721 tokens on the Fantom blockchain.
          </s.TextDescription>
          <s.SpacerMedium />
          <s.TextDescription
          style={{
            textAlign: "left",
            color: "var(--primary)",
          }}>
          But, most of all, Fantom Lords are <span style={{fontWeight: 'bold'}}>an ode to the "days of high adventure"</span> of old-school roleplaying games, taking inspiration from Golden Age of fantasy memorabilia!
          </s.TextDescription>

          <s.SpacerLarge />
        

          {/* LORE */}

          <DivTitle>Ponder the Orb</DivTitle>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary)",
              width: '70%',
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
          <span style={{fontStyle: 'italic'}}>And you shall see your Lord's fate...</span>
          </s.TextDescription>
          <s.SpacerMedium />

          {
              printID && (Number(fetchID) <= data.totalSupply) ? 
              <StyledViewer src={viewImage(fetchID)} style={{border: "5px solid black"}}></StyledViewer> : <StyledViewer src={crystalBall}></StyledViewer>
            }
            {/* {
              printID && (Number(fetchID) <= data.totalSupply) ? '' : <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary)",
              }}>
              This Fantom Lord has not been summoned yet!</s.TextDescription>
            } */}
            {
              printID && fetchID && (Number(fetchID) <= data.totalSupply) ? <DivTitle style={{paddingTop: 15}} id='hero-name'>Fantom Lord # {fetchID}</DivTitle> : ''
            }
            {data.totalSupply != 0 ? 
            <InputGroup className="mb-3" style={{width: '50%', paddingTop: 20}}>
                        <FormControl
                        placeholder="Fantom Lord ID"
                        aria-label="Fantom Lord Checker"
                        onChange={getRarityData}
                        ></FormControl>
            </InputGroup> 
            : <span style={{width: '50%', paddingTop: 30, fontStyle: 'italic', textAlign: 'center'}}>You must attune before venturing forth...</span>}
            {data.totalSupply != 0 ? 
            <StyledButton onClick={() => setPrint(true)}>
              Ponder
            </StyledButton> 
            : '' }


          <s.SpacerLarge />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary)",
              width: '70%',
              paddingBottom: 20,
              borderBottom: "9px solid rgb(189, 117, 74)"
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
          <span style={{fontWeight: 'bold'}}>Or browse Fantom Lords' rarity and rankings at <a href="https://nftkey.app/collections/fantomlords/" target={"_blank"}>NFTKEY</a></span>
          </s.TextDescription>
          <s.SpacerLarge />

          {/* END LORE */}

          <s.SpacerLarge />
          <DivTitle>
            Prophecy &amp; Roadmap
          </DivTitle>
          <s.SpacerMedium />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary)",
              width: '70%',
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
          <span style={{fontStyle: 'italic'}}>About the future of the Fantom Lords, as foretold by the ancient Cryptic Scrolls...</span>
          </s.TextDescription>
          <s.SpacerMedium />
          <ResponsiveWrapper flex={1} style={{ backgroundColor: 'rgb(189, 117, 74)'}}>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ padding: 10}}>
        <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}

          <span style={{fontWeight: 'bold'}}>PHASE 1</span>
          <br/>
          <span style={{fontWeight: 'bold'}}>Sell-out</span> of all Fantom Lords in order to safeguard resellers on secondary market.
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ padding: 10}}>
        <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}

          <span style={{fontWeight: 'bold'}}>PHASE 2</span>
          <br/>
          Creation of <span style={{fontWeight: 'bold'}}>The Vault*</span> with the funds from the community wallet and DAO planning.
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ padding: 10 }}>
        <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}

          <span style={{fontWeight: 'bold'}}>PHASE 3</span>
          <br/>
          <span style={{fontWeight: 'bold'}}>Rarity viewer</span> with info about Class, Level and attributes on this website.
          </s.TextDescription>
        </s.Container>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ padding: 10 }}>
        <s.TextDescription
            style={{
              textAlign: "left",
              color: "var(--primary)",
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}

          <span style={{fontWeight: 'bold'}}>PHASE 4</span>
          <br/>
          Release details about <span style={{fontWeight: 'bold'}}>GameFi</span> and start holders exclusive epic events.
          </s.TextDescription>
        </s.Container>
        </ResponsiveWrapper>
        <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary)",
              width: '90%',
            }}
          > 
          {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
          <span style={{fontStyle: 'italic'}}> <span style={{fontWeight: 'bold'}}>*</span> 10% of minting revenue plus 1/3 of royalties will form The Vault community wallet. More info soon...</span>
          <s.SpacerSmall />
          <span style={{fontStyle: 'italic'}}> <span style={{fontWeight: 'bold'}}></span> 3333 Fantom Lords; 63 to be airdropped to Fantom Specters hodlers; 57 reserved for giveaways/auctions/staff; 3213 available at 20 FTM available at launch.</span>
          </s.TextDescription>
          <s.SpacerSmall />
        </s.respContainer>
        {/* END SECTION */}


        {/* RARITY CHECKER */}
        <ResponsiveWrapper flex={1} style={{ padding: 40, width: '28%' }}>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ paddingBottom: 20 }}>
        <a href={"https://discord.gg/R8HvcKAdhB"}
            target={"_blank"}
            style={iconStyle}
            >
            <FontAwesomeIcon icon={["fab", "discord"]} size="3x" style={{ cursor: 'pointer' }}/>
            </a>
        </s.Container>
        <s.Container flex={1} jc={"center"} ai={"center"} style={{ paddingBottom: 20 }}>
        <a href={"https://twitter.com/ENRINFT"}
            target={"_blank"}
            style={iconStyle}
            >
            <FontAwesomeIcon icon={["fab", "twitter"]} size="3x" style={{ cursor: 'pointer' }}/>
            </a>
        </s.Container>
        </ResponsiveWrapper>
        <s.SpacerXSmall />
        <ResponsiveWrapper flex={1} style={{ paddingBottom: 10, width: '100%' }}>
        <s.Container flex={1} jc={"center"} ai={"center"}>
        <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
                textTransform: "uppercase"
              }}
            >
              Enri's Fantom Lords © {actualYear}
            </s.TextDescription>
            <s.SpacerXSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",

              }}
            >
              developed &amp; designed by 🧙 for 🧙 with ❤️
              <br/>
              tune by <a href="#" style={{color: "red"}}>stray</a>
            </s.TextDescription>
        </s.Container>
        </ResponsiveWrapper>
        {/* END RARITY CHECKER */}
      </s.Container>
    </s.Screen>
  );
}

export default App;

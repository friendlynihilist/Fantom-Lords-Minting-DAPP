import React, { useEffect, useState, useRef } from 'react';
import { useInterval } from 'usehooks-ts';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import pslogo from '../assets/ps-icon.png';
import nklogo from '../assets/nftkey-icon.png';
import { StyledLogo } from './Stronghold';

export const wiggle = keyframes`
  @-webkit-keyframes wiggle {
    0% {-webkit-transform: rotate(10deg);}
    25% {-webkit-transform: rotate(-10deg);}
    50% {-webkit-transform: rotate(20deg);}
    75% {-webkit-transform: rotate(-5deg);}
    100% {-webkit-transform: rotate(0deg);}
  }

  @-ms-keyframes wiggle {
    0% {-ms-transform: rotate(1deg);}
    25% {-ms-transform: rotate(-1deg);}
    50% {-ms-transform: rotate(1.5deg);}
    75% {-ms-transform: rotate(-5deg);}
    100% {-ms-transform: rotate(0deg);}
  }

  @keyframes wiggle {
    0% {transform: rotate(10deg);}
    25% {transform: rotate(-10deg);}
    50% {transform: rotate(20deg);}
    75% {transform: rotate(-5deg);}
    100% {transform: rotate(0deg);}
  }
`;

export const DivMiniBonk = styled.div`
  width: 100px;
  height: 100px;
  position: absolute;
`;

export const DivTitle = styled.span`
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 1.6rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 2rem;
  }
  @media (min-width: 1000px) {
    font-size: 2.5rem;
  }
  transition: width 0.5s;
`;

export const StyledButton = styled.button`
  padding: 10px;
  border: 1px solid black;
  background-color: var(--secondary);
  font-family: 'VCROSDMONO', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--secondary-text);
  width: auto;
  cursor: pointer;
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

const iconStyle = {
  // fontFamily: 'sans-serif',
  // textAlign: 'center',

  color: '#f5f5f5',
  filter: 'drop-shadow(2px 4px #6b33ee)',
};

function Navigation() {
  const location = useLocation()
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [miniBonkLeft, setMiniBonkLeft] = useState("-100px");
  const [miniBonkTop, setMiniBonkTop] = useState("50vh");
  const [miniBonkID, setMiniBonkID] = useState(0);
  const [miniBonkDelay, setMiniBonkDelay] = useState(null);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
    SHOW_BACKGROUND: false,
  });
  const TOKENS_ARRAY = [];
  const [lords, setLords] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  function start_and_end(str) {
    if (str.length > 10) {
      return str.substr(0, 5) + '...' + str.substr(str.length-4, str.length);
    }
    return str;
  }

  useEffect(() => {
    setMiniBonkID(getRandomInt(100,400));
  }, []);

  useEffect(() => {
    setMiniBonkDelay(getRandomInt(3000, 10000));
  }, []);


  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);


  useInterval(
    () => {
      return;
      const newPos = [
        ["-50vw", "-50vh"],
        ["50vw", "50vh"],
        ["70vw", "25vh"],
        ["150vw", "25vh"],
        ["-150vw", "250vh"],
      ];
      const _newPos = newPos[Math.floor(Math.random()*4)];
      console.log("...BONK!...");
      console.log({_newPos})
      setMiniBonkLeft(_newPos[0]);
      setMiniBonkTop(_newPos[1]);
      setMiniBonkDelay(getRandomInt(500, 3000));
    },
    miniBonkDelay,
  )

  return (
    <Navbar
      expand="lg"
      sticky="top"
      variant="dark"
      style={{
        padding: 34,
        // color: 'white !important',
        backgroundColor: 'var(--primary-dark)',
      }}
    >
      { 
        true || (location.pathname == "/bonk" || location.pathname == "/dungeon") ?
        null : 
        <>
          <DivMiniBonk
            className={"rotating"}
            style={{ 
              left: miniBonkLeft,
              top: miniBonkTop,
              backgroundImage: `url('/config/images/miniBonk/${miniBonkID}.png')`, backgroundSize: "cover",
              transition: "left 3s linear, top 3s linear"
              }}
            onClick={ (e) => window.location.href = "/bonk"}>
          </DivMiniBonk>
        </>
      }
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <DivTitle>Fantom Lords</DivTitle>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-start"
        >
          <Nav>
            <Button variant="link">
              <a
                href={'https://t.co/yn3obeavQ1'}
                target={'_blank'}
                style={iconStyle}
              >
                <FontAwesomeIcon
                  icon={['fab', 'discord']}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Button>
            <Button variant="link">
              <a
                href={'https://twitter.com/ENRINFT'}
                target={'_blank'}
                style={iconStyle}
              >
                <FontAwesomeIcon
                  icon={['fab', 'twitter']}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Button>
            <Button variant="link">
              <a
                href={'https://fantom-lords.gitbook.io/fantomlords/welcome/greetings-summoners'}
                target={'_blank'}
                style={iconStyle}
              >
                <FontAwesomeIcon
                  icon={faBook}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                />
              </a>
            </Button>
            <Button variant="link">
              <a
                href={'https://nftkey.app/collections/fantomlords/'}
                target={'_blank'}
                style={iconStyle}
              >
                <StyledLogo style={{width: '30px'}} src={nklogo} alt="" />
              </a>
            </Button>
            <Button variant="link">
              <a
                href={'https://paintswap.finance/marketplace/collections/0xfee8077c909d956e9036c2d2999723931cefe548'}
                target={'_blank'}
                style={iconStyle}
              >
                <StyledLogo style={{width: '30px'}} src={pslogo} alt="" />
              </a>
            </Button>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
          style={{
            fontSize: '1.2rem',
            // color: 'white !important',
            // backgroundColor: 'var(--primary-dark)',
          }}
        >
          <Nav>
            {/* <NavLink className="nav-link" to="/">
              Home
              <span className="sr-only">(current)</span>
            </NavLink> */}
            {/* <NavLink className="nav-link" to="/army">
              Army
            </NavLink> */}
            {
              location.pathname == "/bonk" ? <>
                <NavLink className="nav-link" to="/bonk">
                  Bonk
                </NavLink>
              </> : <></>
            }
            <NavLink className="nav-link" to="/lore">
              Lore
            </NavLink>
            <NavLink className="nav-link" to="/stronghold">
              Stronghold
            </NavLink>
            <NavLink className="nav-link" to="/ashsmith">
              Ashsmith
            </NavLink>
            <NavLink className="nav-link" to="/pyre">
              Pyre
            </NavLink>
            <NavLink className="nav-link" to="/dungeon">
              Dungeon
            </NavLink>
            <NavLink className="nav-link" to="/elden-linktree">
              Linktree
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Navbar>
          <Nav>
            {blockchain.account === '' ||
              (blockchain.smartContract === null && (
                <>
                  <s.SpacerSmall />
                  <StyledButton
                    onClick={(e) => {
                      // startTrack();
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    ATTUNE
                  </StyledButton>
               </>
              ))}
            {blockchain.account &&
              (blockchain.smartContract && (
                <>
                  <s.SpacerSmall />
                  <StyledButton
                    onClick={(e) => {
                      // startTrack();
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                  >
                    {start_and_end(blockchain.account)}
                  </StyledButton>
               </>
              ))}
          </Nav>
        </Navbar>
      </Container>
    </Navbar>
    //     <div className="navigation">
    //     <nav className="navbar navbar-expand navbar-dark"  style={{ padding: 34, backgroundColor: 'var(--primary-dark)' }}>
    //         <div className="container">
    //             <NavLink className="navbar-brand" to="/">
    //                 <DivTitle>Fantom Lords</DivTitle>
    //             </NavLink>
    //             <div>
    //                 <ul className="navbar-nav ml-auto">
    //                     <li className="nav-item">
    // <NavLink className="nav-link" to="/">
    //     Home
    //     <span className="sr-only">(current)</span>
    // </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/army">
    //                             Army
    //                         </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/stronghold">
    //                             Stronghold
    //                         </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/lore">
    //                             Lore
    //                         </NavLink>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </nav>
    // </div>
  );
}

export default Navigation;

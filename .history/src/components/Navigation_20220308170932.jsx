import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const iconStyle = {
  // fontFamily: 'sans-serif',
  // textAlign: 'center',

  color: '#f5f5f5',
  filter: 'drop-shadow(2px 4px #6b33ee)',
};

function Navigation() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
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
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

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
      <Container>
        <Navbar.Brand href="/">
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
            <NavLink className="nav-link" to="/army">
              Army
            </NavLink>
            <NavLink className="nav-link" to="/lore">
              Lore
            </NavLink>
            <NavLink className="nav-link" to="/stronghold">
              The Stronghold
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse>
          <Nav>
            {blockchain.account === '' ||
              (blockchain.smartContract === null && (
                <s.Container ai={'center'} jc={'center'}>
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
                </s.Container>
              ))}
            {blockchain.account &&
              (blockchain.smartContract && (
                <s.Container ai={'center'} jc={'center'}>
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
                </s.Container>
              ))}
          </Nav>
        </Navbar.Collapse>
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

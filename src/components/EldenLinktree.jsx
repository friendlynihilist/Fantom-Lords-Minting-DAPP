import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TypeWriterEffect from 'react-typewriter-effect';

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
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 3rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 4rem;
    text-shadow: 2px 6px var(--secondary);
  }
  @media (min-width: 1000px) {
    font-size: 5.5rem;
    text-shadow: 2px 2px var(--secondary);
  }
  transition: width 0.5s;
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

function EldenLinktree() {
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
      return str.substr(0, 5) + '...' + str.substr(str.length - 4, str.length);
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
    <s.Screen>
      {/* <MusicCard></MusicCard> */}
      <s.Container
        flex={1}
        ai={'center'}
        style={{ padding: 24, backgroundColor: 'var(--primary)' }}
        image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
      >
        {/* <HeaderTitle></HeaderTitle>
            <s.SpacerSmall /> */}
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={'center'} ai={'center'}>
            <s.SpacerLarge />

            <HeaderTitle>
              <TypeWriterEffect
                // textStyle={{ fontFamily: 'Red Hat Display' }}
                startDelay={100}
                cursorColor="white"
                hideCursorAfterText="true"
                text="The Elden Linktree..."
                typeSpeed={100}
                // scrollArea={myAppRef}
              />
            </HeaderTitle>
            <s.SpacerLarge />
            <HeaderTitle>

            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://fantomlords.com/" target="_blank">OUR WEBSITE AND ANCESTRAL HOME</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://fantomlords.com/dungeon" target="_blank">PLAY OUR DUNGEON CRAWLER GAME</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://twitter.com/ENRINFT" target="_blank">TWITTER</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://discord.gg/etpsxPrWpP" target="_blank">DISCORD</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://t.me/EnriNFT" target="_blank">TELEGRAM</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://www.instagram.com/fantom_lords/" target="_blank">INSTAGRAM</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://spooky.fi/#/swap?outputCurrency=0xe5586582e1a60e302a53e73e4fadccaf868b459a" target="_blank">TRADE OUR XRLC TOKEN</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://ftmscan.com/token/0xE5586582E1a60E302a53e73E4FaDccAF868b459a" target="_blank">XRLC- contract address 0xE5586582E1a60E302a53e73E4FaDccAF868b459a</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ fontSize: "0.4em", color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                Collections: 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/fantom-lords" target="_blank">FANTOM LORDS (PAINTSWAP)</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://nftkey.app/collections/fantomlords/" target="_blank">FANTOM LORDS (NFTKEY)</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/the-artifacts-of-ascension" target="_blank">THE ARTIFACTS OF ASCENSION</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/ascended-fantom-lords" target="_blank">ASCENDED FANTOM LORDS (PAINTSWAP)</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://nftkey.app/collections/ascendedfantomlords" target="_blank">ASCENDED FANTOM LORDS (NFTKYEY)</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/fantom-specters" target="_blank">FANTOM SPECTRES (PAINTSWAP)</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/fantom-specters" target="_blank">CREEPTOGHOULS</a> 
            </s.respContainer>
            <s.SpacerLarge />
            <s.respContainer jc={'center'} ai={'center'} style={{ backgroundColor: '#00000061', color: 'white', textAlign: 'center', paddingTop: 30, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, width: "100%" }}>
                <a style={{ fontSize: "0.4em", textDecoration: "none", color: "white" }} href="https://paintswap.finance/marketplace/fantom/collections/the-fantom-bonkers" target="_blank">BONKERS </a> 
            </s.respContainer>
            















            </HeaderTitle>
            <s.SpacerLarge />
          </s.Container>

          <s.SpacerLarge />
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

        {/* END SECTION */}
      </s.Container>
    </s.Screen>
  );
}

export default EldenLinktree;

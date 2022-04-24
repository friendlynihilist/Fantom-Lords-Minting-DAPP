import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import Web3 from 'web3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TypeWriterEffect from 'react-typewriter-effect';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

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
    text-shadow: 2px 8px var(--secondary);
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

function Stronghold() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDoingTransaction, setIsDoingTransaction] = useState(false);
  const [isDisplaySection, setIsDisplaySection] = useState('pool');


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

  const [poolsInfo, setPools] = useState(null);
  const [ownedInfo, setOwned] = useState(null);
  const [stakedInfo, setStaked] = useState(null);
  const [approvalInfo, setApproval] = useState(false);

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

  const testEventsListening = async () => {
    blockchain.smartContract.events
      .allEvents()
      .on('data', async function (event) {
        console.log(event.returnValues);
        // Do something here
      })
      .on('error', console.error);
  };

  const updateDisplaySection = async (_pid) => {
    setIsDisplaySection(_pid);
  }

  function AlertDismissible() {
    const [show, setShow] = useState(true);
  
    return (
      <>
        <Alert show={show} style={{position: 'fixed', top: '10px', left: '10px', width: '18rem', zIndex: '9999', borderRadius: '10px'}}>
          {/* <Alert.Heading>{feedback}</Alert.Heading> */}
          <p>
          {feedback}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)}>
              Close
            </Button>
          </div>
        </Alert>
  
        {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
      </>
    );
  }

  const testWithdraw = async (_pid, _tokenIds) => {
    setFeedback(`You're calling back your NFT from the quest...`);
    setIsDoingTransaction(true);
    await blockchain.smartContract.methods
      .withdraw(_pid, _tokenIds)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFT is back home!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testDeposit = async (_pid, _tokenIds) => {
    setFeedback(`You're sending your NFT to a quest...`);
    setIsDoingTransaction(true);
    await blockchain.smartContract.methods
      .deposit(_pid, _tokenIds)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFT is departed for a quest!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testHarvest = async (_pid) => {
    await blockchain.smartContract.methods
      .harvest(_pid)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Sorry, something went wrong please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`You've harvested!`);
        dispatch(fetchData(blockchain.account));
      });
  };

  const testSetApprovalForAll = async (_pid) => {
    const poolInfo = await blockchain.smartContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
      .poolInfo(_pid)
      .call();

    const abiResponse = await fetch('/config/abi_ftl1.json', { //abi_ftl1.json
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const poolAbi = await abiResponse.json();
    const nftAddress = poolInfo.nftToken.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const poolContract = new web3.eth.Contract(poolAbi, nftAddress);

    await poolContract.methods
      .setApprovalForAll(CONFIG.CONTRACT_ADDRESS.toLowerCase(), true)
      .send({ from: blockchain.account.toLowerCase() });
    setApproval(true);
  };

  const testHarvestAll = async () => { 
    // TO DO!
  };

  const testPoolInfo = async () => {
    setIsChecking(true);
    const poolLength = await blockchain.smartContract.methods //how many pools have been set
      .poolLength()
      .call();
    let idsArray = [];
    let poolArray = [];
    if (poolLength) {
      for (let index = 0; index < poolLength; index++) {
        idsArray.push(index); // 0, 1
      }
    }

    await Promise.all(
      idsArray.map(async (_pid) => {
        const address = blockchain.account.toLowerCase();
        const poolInfo = await blockchain.smartContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
          .poolInfo(_pid)
          .call();
        const userInfo = await blockchain.smartContract.methods // return amount (amount of owned nfts from the pool); rewardDebt
          .userInfo(_pid, address)
          .call();
        const pendingXrlc = await blockchain.smartContract.methods // pending loot
          .pendingXrlc(_pid, address)
          .call();
        const stakedNfts = userInfo.amount; // the amount of staked nft in that pool
        let stakedNftsIndex = []; // will store all the nfts index of the collection contract (only the staked ones)
        if (stakedNfts) {
          const amountArray = Array.apply(null, { length: stakedNfts }).map(
            Number.call,
            Number
          ); // create an array with the number of staked nfts. e.g. if stakedNfts = 3 => amountArray = [0,1,2]
          await Promise.all(
            amountArray.map(async (_tid) => {
              const nftIndex = await blockchain.smartContract.methods // return the nft index of the collection contract (bc it can differ from the index of the staking platform)
                .tokenOfOwnerByIndex(_pid, address, _tid)
                .call();
              stakedNftsIndex.push(nftIndex);
            })
          );
        }

        // NFTS VIEWER FUNCTION //
        const abiResponse = await fetch('/config/abi_ftl1.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const poolAbi = await abiResponse.json();
        const nftAddress = poolInfo.nftToken.toLowerCase(); // take the nft collection address

        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const poolContract = new web3.eth.Contract(poolAbi, nftAddress);
        const poolName = await poolContract.methods.name().call();
        const balanceOf = await poolContract.methods.balanceOf(address).call(); // total collection nfts owned by user (and not staked in staking platform)

        let ownedNftsInfo = [];

        // find if this nft contract has been approved
        const isApproved = await poolContract.methods
          .isApprovedForAll(
            address.toLowerCase(),
            CONFIG.CONTRACT_ADDRESS.toLowerCase()
          )
          .call();
        let poolApproval = isApproved;
        // setApproval(isApproved);
        console.log(isApproved);
        //

        // make a fetch to the first token of the collection in order to gather the image for the pool
        const firstTokenUri = await poolContract.methods.tokenURI(0).call();
        const responseFT = await fetch(
          firstTokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
        );
        const jsonifyRespFT = await responseFT.json();
        const poolImageUri = jsonifyRespFT.image.replace(
          'ipfs://',
          'https://ipfs.io/ipfs/'
        );

        if (balanceOf) {
          // if user owns not staked nfts
          const notStakedNfts = parseInt(balanceOf); // number of not staked nfts
          const totalAmountArray = Array.apply(null, {
            length: notStakedNfts,
          }).map(Number.call, Number); // create an array from the number of notStakedNfts
          await Promise.all(
            totalAmountArray.map(async (_tid) => {
              const poolNftIndex = await poolContract.methods
                .tokenOfOwnerByIndex(address, _tid) // return the id of every nfts that is not staked yet
                .call();

              // TO DO: creating an object with staked and unstaked nfts from the collection

              const tokenUri = await poolContract.methods
                .tokenURI(poolNftIndex)
                .call();
              console.log(tokenUri);
              const response = await fetch(
                tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
              );
              let jsonifyResp = await response.json();
              jsonifyResp.tokenId = poolNftIndex;
              ownedNftsInfo.push(jsonifyResp);
            })
          );
        }

        let stakedNftsInfo = [];

        if (stakedNftsIndex) {
          await Promise.all(
            stakedNftsIndex.map(async (_tid) => {
              const tokenUri = await poolContract.methods.tokenURI(_tid).call();
              const response = await fetch(
                tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
              );
              let jsonifyResp = await response.json();
              jsonifyResp.tokenId = _tid;
              stakedNftsInfo.push(jsonifyResp);
            })
          );
        }

        // // //

        const poolStruct = {
          poolId: _pid,
          poolName: poolName,
          poolApproval: poolApproval,
          poolAddress: poolInfo.nftToken,
          poolPoints: poolInfo.allocPoint,
          poolImage: poolImageUri,
          pendingXrlc: pendingXrlc,
          rewardDebt: userInfo.rewardDebt,
          stakedNfts: {
            balance: stakedNfts,
            info: stakedNftsInfo,
          },
          ownedNfts: {
            balance: balanceOf,
            info: ownedNftsInfo,
          },
        };

        poolArray.push(poolStruct);
      })
    );

    // setStaked(poolArray.stakedNfts.info);
    // setOwned(poolArray.ownedNfts.info);
    // setIsDisplaySection('pool');
    setIsChecking(false);
    setPools(poolArray);
    console.log(poolArray);
  };

  const [isActive, setActive] = useState('false');

  const handleToggle = () => {
    setActive(!isActive);
  };

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
            <StyledImg
              alt={'The Great Summoning'}
              src={'/config/images/ritual_template_rect.png'}
              style={{ imageRendering: 'pixelated' }}
            />
            <HeaderTitle>
            <s.SpacerLarge />
              <TypeWriterEffect
                // textStyle={{ fontFamily: 'Red Hat Display' }}
                startDelay={100}
                cursorColor="white"
                hideCursorAfterText="true"
                text="Under construction..."
                typeSpeed={100}
                // scrollArea={myAppRef}
              />
            </HeaderTitle>

            <s.SpacerLarge />
          </s.Container>

          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />

        {/* SECTION */}
        {/* END SECTION */}
      </s.Container>
    </s.Screen>
  );
}

export default Stronghold;

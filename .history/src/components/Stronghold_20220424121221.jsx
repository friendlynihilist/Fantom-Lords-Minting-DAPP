import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
} from 'react-bootstrap';
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
  };

  function AlertDismissible() {
    const [show, setShow] = useState(true);

    return (
      <>
        <Alert
          show={show}
          style={{
            backgroundColor: 'var(--primary-dark)',
            color: 'white',
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            width: '18rem',
            zIndex: '9999',
            borderRadius: '10px',
            // transition: 'opacity 2s ease-in'
            // border: '1px solid white'
          }}
        >
          {/* <Alert.Heading>{feedback}</Alert.Heading> */}
          <p>{feedback}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <StyledButton style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}} onClick={() => setShow(false)}>Close</StyledButton>
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
    console.log(poolArray);
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
    setFeedback(`You're collecting your loot...`);
    setIsDoingTransaction(true);
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
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testSetApprovalForAll = async (_pid) => {
    setFeedback(`You're approving this collection...`);
    setIsDoingTransaction(true);
    const poolInfo = await blockchain.smartContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
      .poolInfo(_pid)
      .call();

    const abiResponse = await fetch('/config/abi_ftl.json', {
      //abi_ftl1.json
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
    testPoolInfo();
    setIsDoingTransaction(false);
  };

  const testDepositAll = async (_pid, _tokenIds) => {
    setFeedback(`You're sending all your NFT to a quest...`);
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
        setFeedback(`Your NFTs are departed for a quest!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
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

    // 
    // 
    // WARNING: REMOVE CREEPTOGHOULS!
    // 
    // 

    // idsArray.splice(2, 1);

    // 
    // 
    // WARNING: REMOVE CREEPTOGHOULS!
    // 
    // 

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
        const abiResponse = await fetch('/config/abi_ftl.json', {
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
        //

        // make a fetch to the first token of the collection in order to gather the image for the pool
        let firstTokenId = _pid == 0 ? 1 : 0;
        const firstTokenUri = await poolContract.methods
          .tokenURI(firstTokenId)
          .call();
        const responseFT = await fetch(
          firstTokenUri.replace('ipfs://', 'http://infura-ipfs.io/ipfs/')
        );
        const jsonifyRespFT = await responseFT.json();

        let URIprefix = jsonifyRespFT.image.startsWith('https://ipfs.io/ipfs/')
          ? 'https://ipfs.io/ipfs/'
          : 'ipfs://';

        const poolImageUri = jsonifyRespFT.image.replace(
          URIprefix,
          'http://infura-ipfs.io/ipfs/'
        );

        if (balanceOf) {
          if (_pid !== 1 && _pid !== 2) {
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
                const response = await fetch(
                  tokenUri.replace('ipfs://', 'http://infura-ipfs.io/ipfs/')
                );
                let jsonifyResp = await response.json();
                jsonifyResp.tokenId = poolNftIndex;
                ownedNftsInfo.push(jsonifyResp);
              })
            );
          } else if (_pid == 1 || _pid == 2) {
            if (_pid == 1) {
              let tokenIdsArray = [];
              for (let index = 0; index < 63; index++) {
                tokenIdsArray.push(index);
              }
              await Promise.all(
                tokenIdsArray.map(async (_tindex) => {
                  const ownerAddress = await poolContract.methods
                    .ownerOf(_tindex)
                    .call();
                  if (ownerAddress.toLowerCase() === address.toLowerCase()) {
                    const tokenUri = await poolContract.methods
                      .tokenURI(_tindex)
                      .call();
                    const response = await fetch(
                      tokenUri.replace('https://gateway.pinata.cloud/ipfs/', 'http://infura-ipfs.io/ipfs/')
                    );
                    let jsonifyResp = await response.json();
                    jsonifyResp.tokenId = _tindex;
                    ownedNftsInfo.push(jsonifyResp);
                  }
                })
              );
            } else if (_pid == 2) {
              let tokenIdsArray = [];
              for (let index = 0; index < 94; index++) {
                tokenIdsArray.push(index);
              }
              await Promise.all(
                tokenIdsArray.map(async (_tindex) => {
                  const ownerAddress = await poolContract.methods
                    .ownerOf(_tindex)
                    .call();
                  if (ownerAddress.toLowerCase() === address.toLowerCase()) {
                    const tokenUri = await poolContract.methods
                      .tokenURI(_tindex)
                      .call();
                    const response = await fetch(
                      tokenUri.replace('ipfs://', 'http://infura-ipfs.io/ipfs/')
                    );
                    let jsonifyResp = await response.json();
                    jsonifyResp.tokenId = _tindex;
                    ownedNftsInfo.push(jsonifyResp);
                  }
                })
              );
            }
          }
        }

        let stakedNftsInfo = [];

        if (stakedNftsIndex) {
          await Promise.all(
            stakedNftsIndex.map(async (_tid) => {
              const tokenUri = await poolContract.methods.tokenURI(_tid).call();
              const response = await fetch(
                tokenUri.replace('ipfs://', 'http://infura-ipfs.io/ipfs/')
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
      <s.Container
        flex={1}
        ai={'center'}
        style={{ padding: 24, backgroundColor: 'var(--primary)' }}
        image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
      >
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={'center'}
            ai={'center'}
            style={{
              // backgroundColor: 'var(--accent)',
              padding: 24,
              borderRadius: 24,
              // border: "4px dashed var(--secondary)",
              // boxShadow: '0px 5px 11px 2px rgba(0,0,0,0.7)',
            }}
          >
            {/* <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle> */}

            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={'_blank'} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                {blockchain.account === '' ||
                blockchain.smartContract === null ? (
                  <s.Container ai={'center'} jc={'center'}>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== '' ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    {!poolsInfo ? (
                      <>
                        <s.Container ai={'center'} jc={'center'} fd={'row'}>
                          {!isChecking && (
                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                testEventsListening();
                                testPoolInfo();
                              }}
                            >
                              CHECK
                            </StyledButton>
                          )}
                          {isChecking && (
                            <Spinner
                              animation="border"
                              variant="primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          )}
                        </s.Container>
                      </>
                    ) : (
                      <>
                        {isDoingTransaction && <AlertDismissible />}
                        <Nav variant="pills" defaultActiveKey="#">
                          <Nav.Item>
                            <StyledButton
                              style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                updateDisplaySection('pool');
                              }}
                            >
                              Available Pools
                            </StyledButton>
                          </Nav.Item>

                          {poolsInfo.map((pool, idx) => (
                            <Nav.Item
                            // className={isActive ? 'visible' : 'invisible'}
                            >
                              <StyledButton
                              style={{ fontSize: '1.2rem', marginLeft: '15px', fontWeight: 'normal', width: 'auto'}}
                                eventKey={`link-${idx}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateDisplaySection(pool.poolId.toString());
                                }}
                              >
                                {pool.poolName.toString() === 'FantomSpecters' ? 'Fantom Specters' : pool.poolName}
                              </StyledButton>
                            </Nav.Item>
                          ))}
                        </Nav>

                        <s.SpacerLarge />

                        <Row xs={1} sm={2} className="g-4">
                          {poolsInfo.map(
                            (
                              pool,
                              idx // TODO: da cambiare con l'array vero e proprio del poolLength
                            ) => (
                              <Col lg={true}>
                                <Card
                                  className="text-center"
                                  id={idx.toString()}
                                  style={{
                                    width: 'auto',
                                    height: '100%',
                                    borderRadius: '10px', backgroundColor: 'var(--primary-dark)', color: '#fff',
                                    display:
                                      isDisplaySection === 'pool'
                                        ? 'block'
                                        : 'none',
                                  }}
                                >
                                  <Card.Img
                                    variant="top"
                                    style={{ height: '18rem' }}
                                    src={pool.poolImage}
                                  />
                                  <Card.Body>
                                    <Card.Title 
                                    style={{borderBottom: '1px solid #fff', paddingBottom: '5px'}}
                                    className="text-start">
                                      {pool.poolName.toString() === 'FantomSpecters' ? 'Fantom Specters' : pool.poolName}
                                    </Card.Title>
                                    <Row xs="auto">
                                      <Col>
                                        <Card.Text>
                                          owned:{' '}
                                          {parseInt(pool.ownedNfts.balance) +
                                            parseInt(pool.stakedNfts.balance)}
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text>
                                          staked: {pool.stakedNfts.balance}
                                        </Card.Text>
                                      </Col>
                                    </Row>
                                    <s.SpacerSmall />
                                    <div
                                      style={{
                                        border: '1px solid var(--secondary)',
                                        borderRadius: '10px',
                                        padding: '10px',
                                      }}
                                    >
                                      <Row xs="auto">
                                        <Col>
                                          <Card.Text>
                                            {pool.pendingLoot ? pool.pendingLoot / 1e18 : 0} XRLC
                                          </Card.Text>
                                        </Col>
                                        {/* <Col>
                                          <small className="text-muted">
                                            $12.54
                                          </small>
                                        </Col> */}
                                      </Row>
                                      <Row xs="auto">
                                        <Col>
                                          <Card.Text>earned</Card.Text>
                                        </Col>
                                      </Row>
                                    </div>
                                    <s.SpacerSmall />
                                    {!pool.poolApproval ? (
                                      <StyledButton
                                        style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          testSetApprovalForAll(pool.poolId);
                                          testPoolInfo();
                                        }}
                                      >
                                        Approve
                                      </StyledButton>
                                    ) : (
                                      <StyledButton
                                        style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          testHarvest(pool.poolId);
                                        }}
                                      >
                                        Harvest
                                      </StyledButton>
                                    )}
                                  </Card.Body>
                                </Card>
                              </Col>
                            )
                          )}
                        </Row>

                        <Row xs={1} md={2} lg={5} className="g-4">
                          {poolsInfo.map((pool, idx) =>
                            pool.stakedNfts.info.map((id) => (
                              <Col
                                lg={true}
                                style={{
                                  display:
                                    isDisplaySection === pool.poolId.toString()
                                      ? 'block'
                                      : 'none',
                                }}
                              >
                                <Card
                                  className="text-center"
                                  id={idx.toString()}
                                  style={{ width: 'auto', height: '100%', borderRadius: '10px', backgroundColor: 'var(--primary-dark)', color: '#fff'}}
                                >
                                  <Card.Img
                                    variant="top"
                                    src={id.image.replace(
                                      'ipfs://',
                                      'http://infura-ipfs.io/ipfs/'
                                    )}
                                  />
                                  <Card.Body>
                                    <Card.Title 
                                    style={{borderBottom: '1px solid #fff', paddingBottom: '5px'}}
                                    className="text-start">
                                      {id.name}
                                    </Card.Title>

                                    <s.SpacerSmall />
                                    <StyledButton
                                    style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                                      variant="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        testWithdraw(pool.poolId, [
                                          parseInt(id.tokenId),
                                        ]);
                                      }}
                                    >
                                      Unstake
                                    </StyledButton>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))
                          )}
                          {poolsInfo.map((pool, idx) =>
                            pool.ownedNfts.info.map((id) => (
                              <Col
                                lg={true}
                                style={{
                                  display:
                                    isDisplaySection === pool.poolId.toString()
                                      ? 'block'
                                      : 'none',
                                }}
                              >
                                <Card
                                  className="text-center"
                                  id={idx.toString()}
                                  style={{ width: 'auto', height: '100%', borderRadius: '10px', backgroundColor: 'var(--primary-dark)', color: '#fff' }}
                                >
                                  <Card.Img
                                    variant="top"
                                    src={id.image.replace(
                                      'ipfs://',
                                      'http://infura-ipfs.io/ipfs/'
                                    )}
                                  />
                                  <Card.Body>
                                    <Card.Title 
                                    style={{borderBottom: '1px solid #fff', paddingBottom: '5px'}}
                                    className="text-start">
                                      {id.name}
                                    </Card.Title>

                                    <s.SpacerSmall />
                                    <StyledButton
                                    style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                                      variant="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        testDeposit(pool.poolId, [
                                          parseInt(id.tokenId),
                                        ]);
                                      }}
                                    >
                                      Stake
                                    </StyledButton>
                                    {/* <StyledButton
                                    style={{ fontSize: '1.2rem', fontWeight: 'normal', width: 'auto'}}
                                      variant="primary"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        testDeposit(pool.poolId, [
                                          parseInt(id.tokenId),
                                        ]);
                                      }}
                                    >
                                      Stake All
                                    </StyledButton> */}
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))
                          )}
                        </Row>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
      </s.Container>
    </s.Screen>
  );
}

export default Stronghold;

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import Web3 from 'web3';
import { Nav, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-h5-audio-player/lib/styles.css';
import tune from '../assets/stronghold.mp3';
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
    text-shadow: 2px 8px var(--secondary);
  }
  transition: width 0.5s;
`;

export const DivTitle = styled.span`
  text-align: center;
  font-size: 1.6rem;
  color: var(--primary);
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

function Ashsmith() {
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
  const [approvalInfo, setApproval] = useState(false);
  const [isDoingTransaction, setIsDoingTransaction] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [XRLCPrice, setXRLCPrice] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audio = useRef(new Audio(tune));

  audio.current.onended = function () {
    setPlaying(false);
  };

  audio.current.onplay = function () {
    setHasError(false);
  };

  const handleClick = () => {
    setPlaying((playing) => !playing);
  };

  useEffect(() => {
    if (playing) {
      audio.current
        .play()
        .then(() => {
          // Audio is playing.
        })
        .catch((error) => {
          setHasError(true);
        });
    } else if (!hasError) {
      audio.current.pause();
    }
  }, [playing, hasError]);

  function AlertDismissible() {
    const [show, setShow] = useState(true);

    return (
      <>
        <Alert
          key="alert-1"
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
            <StyledButton
              key="alert-btn-1"
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                width: 'auto',
              }}
              onClick={() => setShow(false)}
            >
              Close
            </StyledButton>
          </div>
        </Alert>

        {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
      </>
    );
  }

  const updateData = async () => {
    updatePrice(1);
    checkApproval();
  }

  const updatePrice = async (amount) => {
    const abiResponse = await fetch('/config/abi_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const artifactsAbi = await abiResponse.json();
    const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const artifactContract = new web3.eth.Contract(
      artifactsAbi,
      artifactsAddress
    );

    const price = await artifactContract.methods.price(amount).call();

    setXRLCPrice((price / 1e18).toFixed(3));
    // return price;
  };

  const checkApproval = async () => {
    const abiResponse = await fetch('/config/abi_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const artifactsAbi = await abiResponse.json();
    const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const artifactContract = new web3.eth.Contract(
      artifactsAbi,
      artifactsAddress
    );

    const XRLCAddress =
      '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();

    const approval = await artifactContract.methods
      .isApprovedForAll(blockchain.account.toLowerCase(), XRLCAddress)
      .call();

      setApproval(approval);
  }

  const testSetApprovalForAll = async () => {
    setFeedback(`You're approving this collection...`);
    setIsDoingTransaction(true);
    const abiResponse = await fetch('/config/abi_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const artifactsAbi = await abiResponse.json();
    const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const artifactContract = new web3.eth.Contract(
      artifactsAbi,
      artifactsAddress
    );

    const XRLCAddress =
      '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();

    await artifactContract.methods
      .setApprovalForAll(XRLCAddress, true)
      .send({ from: blockchain.account.toLowerCase() });
    setApproval(true);
    testPoolInfo();
    setIsDoingTransaction(false);
  };

  const claimNFTs = async () => {
    // added async

    // ADD DEDICATED ABI AND CONFIGS
    const abiResponse = await fetch('/config/abi_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const artifactsAbi = await abiResponse.json();
    const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const artifactContract = new web3.eth.Contract(
      artifactsAbi,
      artifactsAddress
    );
    //

    const symbol = await artifactContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
      .symbol()
      .call();

    console.log(symbol);

    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    // console.log(artifactContract.address);
    artifactContract.methods
      .collectArtifacts(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        // value: totalCostWei,
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Sorry, something went wrong please try again later.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
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
    if (newMintAmount > 3) {
      newMintAmount = 3;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  async function listTokensOfOwner(address) {
    // SETSTATE SPINNER TRUE
    setIsChecking(true);

    const abiResponse = await fetch('/config/abi_artifacts.json', {
      //abi_ftl1.json
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const ARTIFACTS_ABI = await abiResponse.json();

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const artifactsContract = new web3.eth.Contract(
      ARTIFACTS_ABI,
      CONFIG.CONTRACT_ADDRESS.toLowerCase()
    );

    const balance = await artifactsContract.methods
      .balanceOf(address.toLowerCase())
      .call();
    let idsArray = [];
    let tokensArray = [];

    if (balance >= 1) {
      //if address owns Lord(s), then calling tokenOfOwnersByIndex is possible

      // PREPARING THE IDs ARRAY
      for (let index = 0; index < balance; index++) {
        idsArray.push(index);
      }

      await Promise.all(
        idsArray.map(async (id) => {
          const getTokenId = await artifactsContract.methods
            .tokenOfOwnerByIndex(address.toLowerCase(), id)
            .call();
          const tokenUri = await artifactsContract.methods
            .tokenURI(getTokenId)
            .call();
          const response = await fetch(
            tokenUri.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
          );
          const jsonifyResp = await response.json();
          // tokensArray.push(jsonifyResp);
          tokensArray.push(jsonifyResp);
        })
      );
      // SETSTATE SPINNER FALSE

      // SIMPLE SORT - ADD MORE SORTING OPTION IN THE FUTURE
      if (tokensArray) {
        if (tokensArray[0].edition) {
          tokensArray = tokensArray.sort(function (obj1, obj2) {
            return obj1.edition - obj2.edition;
          });
        }
      }
      //
    }
    setIsChecking(false);
    setLords(tokensArray);
    console.log(tokensArray);
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={'center'}
        style={{ padding: 24, backgroundColor: 'var(--primary)' }}
        image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
      >
        {/* <HeaderTitle>your Army</HeaderTitle> */}
        {/* <s.SpacerSmall /> */}
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container flex={1} jc={'center'} ai={'center'}>
            <StyledImg
              alt={'The Ashsmith'}
              src={'/config/images/ashsmith_crop.webp'}
              style={{ imageRendering: 'pixelated', maxWidth: '520px' }}
            />

            {/* <s.SpacerMedium /> */}

            {!playing && (
              <>
                <s.TextDescription
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                  }}
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    cursor: 'pointer',
                  }}
                >
                  play ♫
                </s.TextDescription>
              </>
            )}
            {playing && (
              <>
                <s.TextDescription
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                  }}
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    cursor: 'pointer',
                  }}
                >
                  pause ♫
                </s.TextDescription>
              </>
            )}

            <s.SpacerMedium />

            {blockchain.account === '' || blockchain.smartContract === null ? (
              <>
                <s.TextDescription
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                  }}
                >
                  <TypeWriterEffect
                    // textStyle={{ fontFamily: 'Red Hat Display' }}
                    startDelay={100}
                    cursorColor="white"
                    // hideCursorAfterText="true"
                    multiText={[
                      "Greetings, summoner. I'm the Ashsmith.",
                      'Let me take a closer look at those shiny trinkets in your backpack...',
                      // '3333 Fantom Lords were conjured',
                      // 'eager to discover the truth about their past...',
                      // '',
                    ]}
                    typeSpeed={45}
                    // scrollArea={myAppRef}
                  />
                </s.TextDescription>
              </>
            ) : null}

            <s.SpacerLarge />
            <s.SpacerSmall />
            {blockchain.account === '' || blockchain.smartContract === null ? (
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
                  APPROACH
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
                {!isUpdatingData ? (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                        cursor: 'pointer',
                        fontSize: '1.4rem',
                      }}
                    >
                      <TypeWriterEffect
                        // textStyle={{ fontFamily: 'Red Hat Display' }}
                        startDelay={100}
                        cursorColor="white"
                        // hideCursorAfterText="true"
                        multiText={[
                          "Ah, you've brought Arcane Relics with you...",
                          'I could forge you Artifacts from the ashes of those Relics...',
                        ]}
                        typeSpeed={45}
                        // scrollArea={myAppRef}
                      />
                    </s.TextDescription>
                    <s.Container ai={'center'} jc={'center'}>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          // startTrack();
                          e.preventDefault();
                          dispatch(connect());
                          updateData();
                        }}
                      >
                        Go on...
                      </StyledButton>
                    </s.Container>
                    <s.SpacerMedium />
                  </>
                ) : (
                  <>
                    {claimingNft && <AlertDismissible />}
                    {isDoingTransaction && <AlertDismissible />}
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                        cursor: 'pointer',
                        fontSize: '1.4rem',
                      }}
                    >
                      <TypeWriterEffect
                        // textStyle={{ fontFamily: 'Red Hat Display' }}
                        startDelay={100}
                        cursorColor="white"
                        hideCursorAfterText="true"
                        multiText="Are you willing to burn some of your Relics as a pious offering?"
                        typeSpeed={45}
                        // scrollArea={myAppRef}
                      />
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container
                      ai={'center'}
                      jc={'center'}
                      style={{
                        border: '1px solid var(--secondary)',
                        borderRadius: '10px',
                        padding: '30px',
                        width: 'auto',
                      }}
                    >
                      <s.TextDescription
                        style={{
                          textAlign: 'center',
                          color: 'var(--accent-text)',
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      {/* <s.SpacerSmall /> */}

                      <s.TextDescription
                        style={{
                          textAlign: 'center',
                          color: 'var(--accent-text)',
                        }}
                      >
                        You're forging {mintAmount} Artifact(s) for{' '}
                        {XRLCPrice} XRLC (+ gas fees).
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <s.Container ai={'center'} jc={'center'} fd={'row'}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                            updatePrice(mintAmount);
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                            fontSize: '30px',
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
                            updatePrice(mintAmount);
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={'center'} jc={'center'} fd={'row'}>
                        <StyledButton
                          style={{ fontSize: '1.6rem' }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                          {claimingNft ? 'FORGING...' : 'FORGE NOW'}
                        </StyledButton>
                      </s.Container>
                    </s.Container>
                  </>
                )}

                <s.SpacerLarge />
                {!lords ? (
                  <>
                    {/* <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}
                    >
                      Click to check your Fantom Lords' army
                    </s.TextDescription> */}
                    <s.SpacerSmall />
                    <s.Container
                      ai={'center'}
                      jc={'center'}
                      fd={'row'}
                      style={{
                        border: '1px solid var(--secondary)',
                        borderRadius: '10px',
                        padding: '30px',
                        width: 'auto',
                      }}
                    >
                      {!isChecking && (
                        <StyledButton
                          style={{ fontSize: '1.5rem' }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            listTokensOfOwner(blockchain.account);
                            getData();
                          }}
                        >
                          VIEW COLLECTION
                        </StyledButton>
                      )}
                      {isChecking && (
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      )}
                    </s.Container>

                    <s.SpacerSmall />
                  </>
                ) : (
                  <>
                    {!lords.length ? (
                      <s.Container ai={'center'} jc={'center'}>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                          }}
                        >
                          You don't seem to have any Artifact with you.
                          <br />
                          The Ashsmith may help you, if you're willing to offer
                          something in turn...
                        </s.TextDescription>
                      </s.Container>
                    ) : (
                      <Row
                        xs={1}
                        md={2}
                        lg={lords.length > 1 ? 4 : ''}
                        className="g-4"
                      >
                        {lords.map((item, index) => {
                          return (
                            <Col>
                              <Card
                                key={index}
                                style={{
                                  width: 'auto',
                                  height: '100%',
                                  borderRadius: '10px',
                                  backgroundColor: 'var(--primary-dark)',
                                  color: '#fff',
                                }}
                              >
                                <Card.Img
                                  variant="top"
                                  src={item.image.replace(
                                    'ipfs://',
                                    'https://cloudflare-ipfs.com/ipfs/'
                                  )}
                                />
                                <Card.Body>
                                  <Card.Title
                                    style={{
                                      borderBottom: '1px solid #fff',
                                      paddingBottom: '5px',
                                    }}
                                  >
                                    {item.name}
                                  </Card.Title>
                                  <Card.Text>
                                    <ul>
                                      <li>{`${item.attributes[0].trait_type}: ${item.attributes[0].value}`}</li>
                                      <li>{`${item.attributes[1].trait_type}: ${item.attributes[1].value}`}</li>
                                      <li>{`${item.attributes[2].trait_type}: ${item.attributes[2].value}`}</li>
                                      <li>{`${item.attributes[3].trait_type}: ${item.attributes[3].value}`}</li>
                                      <li>{`${item.attributes[4].trait_type}: ${item.attributes[4].value}`}</li>
                                      <li>{`${item.attributes[5].trait_type}: ${item.attributes[5].value}`}</li>
                                      <li>{`${item.attributes[6].trait_type}: ${item.attributes[6].value}`}</li>
                                    </ul>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                    {/* <s.TextDescription
                                    style={{
                                        textAlign: 'center',
                                        color: 'var(--accent-text)',
                                    }}
                                >
                                    Lorem Ipsum
                                </s.TextDescription> */}
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

export default Ashsmith;

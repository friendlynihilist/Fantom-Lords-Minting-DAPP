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
import tune from '../assets/ashsmith.mp3';
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

export const StyledInput = styled.input`
  padding: 5px;
  background-color: var(--primary);  
  border-color: var(--secondary);  
  color: white;
  min-width: 50%;
`;

export const LordCard = styled(Card)`

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
  const [isCheckingNameChange, setIsCheckingNameChange] = useState(false);
  const [isCheckingDescriptionChange, setIsCheckingDescriptionChange] = useState(false);
  const [changingAscendedLordName, setChangingAscendedLordName] = useState(false);
  const [changingAscendedLordDescription, setChangingAscendedLordDescription] = useState(false);
  const [ownedXRLC, setOwnedXRLC] = useState(false);
  const [approvalInfo, setApproval] = useState(false);
  const [isDoingTransaction, setIsDoingTransaction] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [XRLCPrice, setXRLCPrice] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ascendedLords, setAscendedLords] = useState(null);
  const audio = useRef(new Audio(tune));
  const [selectedAscendedLord, setSelectedAscendedLord] = useState({});
  const [changeLordNameInput, setChangeLordNameInput] = useState("");
  const [changeLordDescriptionInput, setChangeLordDescriptionInput] = useState("");
  const [nameChangeMenuOpen, setNameChangeMenuOpen] = useState(false);
  const [descriptionChangeMenuOpen, setDescriptionChangeMenuOpen] = useState(false);


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
          <s.Container>
            <s.TextDescription>{feedback}</s.TextDescription>
          </s.Container>
          {/* <p>{feedback}</p> */}
          <hr />
          <s.Container className="d-flex justify-content-end">
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
          </s.Container>
        </Alert>

        {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
      </>
    );
  }

  const updateData = async () => {
    updatePrice(1);
    checkApproval();
    setIsUpdatingData(true);
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const XRLCresponse = await fetch('/config/abi_xrlc.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const XRLCAbi = await XRLCresponse.json();
    const XRLCAddress =
      '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);

    const balanceOfXRLC = await XRLCContract.methods
      .balanceOf(blockchain.account.toLowerCase())
      .call();

    setOwnedXRLC(balanceOfXRLC);
  };

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

    if (amount < 1) {
      amount = 1;
    } else if (amount > 3) {
      amount = 3;
    }

    const price = await artifactContract.methods.price(amount).call();

    setXRLCPrice((price / 1e18).toFixed(3));
    // return price;
  };

  const checkApproval = async () => {
    const abiResponse = await fetch('/config/abi_xrlc.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const XRLCAbi = await abiResponse.json();
    const XRLCAddress =
      '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);

    const artifactsAddress =
      '0xC021315E4aF3C6cbD2C96E5F7C67d0A4c2F8FE11'.toLowerCase();

    const approval = await XRLCContract.methods
      .allowance(blockchain.account.toLowerCase(), artifactsAddress)
      .call();

    console.log(approval);

    let confirmApprove = true;
    if (approval == 0) {
      confirmApprove = false;
    }

    setApproval(confirmApprove);
  };

  const testSetApprovalForAll = async () => {
    setFeedback(`You're approving XRLC...`);
    setIsDoingTransaction(true);
    const abiResponse = await fetch('/config/abi_xrlc.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const XRLCAbi = await abiResponse.json();
    const XRLCAddress =
      '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);

    const artifactsAddress =
      '0xC021315E4aF3C6cbD2C96E5F7C67d0A4c2F8FE11'.toLowerCase();

    await XRLCContract.methods
      .approve(artifactsAddress, web3.utils.toWei('1000000', 'ether'))
      .send({
        // to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      });
    setApproval(true);
    // testPoolInfo();
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

    // console.log(symbol);

    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);
    setFeedback(`Forging your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    // console.log(artifactContract.address);
    artifactContract.methods
      .collectArtifacts(mintAmount)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
        // gasLimit: String(totalGasLimit),
        // to: CONFIG.CONTRACT_ADDRESS,
        // from: blockchain.account,
        // value: totalCostWei,
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Something went wrong. Please, try again later.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Your Artifact${
            mintAmount > 1 ? 's are' : 'is'
          } finally redeemed from the ashes!`
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

      try {
        await Promise.all(
          idsArray.map(async (id) => {
            const getTokenId = await artifactsContract.methods
              .tokenOfOwnerByIndex(address.toLowerCase(), id)
              .call();
            const tokenUri = await artifactsContract.methods
              .tokenURI(getTokenId)
              .call();
            const response = await fetch(tokenUri);
            const jsonifyResp = await response.json();
            // tokensArray.push(jsonifyResp);
            tokensArray.push(jsonifyResp);
          })
        );
      } catch (error) {
        console.log(error);
      }

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


  const listAscendedLordsOfOwner = async (address) => {
    const abiResponse = await fetch('/config/abi_ascension.json', {
      //abi_ftl1.json
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const ASC_ABI = await abiResponse.json();

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const ascLordsContract = new web3.eth.Contract(
      ASC_ABI,
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase()
    );

    const balance = await ascLordsContract.methods
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

      try {
        await Promise.all(
          idsArray.map(async (id) => {
            const getTokenId = await ascLordsContract.methods
              .tokenOfOwnerByIndex(address.toLowerCase(), id)
              .call();
            const tokenUri = await ascLordsContract.methods
              .tokenURI(getTokenId)
              .call();
            const response = await fetch(tokenUri);
            const jsonifyResp = await response.json();
            // tokensArray.push(jsonifyResp);
            tokensArray.push({id: getTokenId, ...jsonifyResp});
          })
        );
      } catch (error) {
        console.log(error);
      }

      // SETSTATE SPINNER FALSE

      // SIMPLE SORT - ADD MORE SORTING OPTION IN THE FUTURE
      // if (tokensArray) {
      //   if (tokensArray[0].edition) {
      //     tokensArray = tokensArray.sort(function (obj1, obj2) {
      //       return obj1.edition - obj2.edition;
      //     });
      //   }
      // }
      //
    }
    setIsChecking(false);
    setAscendedLords(tokensArray);
    console.log(tokensArray);
  };

  const handleNameChangeInput = function(event) {
    setChangeLordNameInput(event.target.value);
  }

  const handleDescriptionChangeInput = function(event) {
    setChangeLordDescriptionInput(event.target.value);
  }

  const notifyNameChange = async function(receipt, id, name) {
    const response = await fetch('https://demostris-inc.com/fantomlords/ascendedLords/nameChange/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receipt, id, name })
    });
  }

  const notifyDescriptionChange = async function(receipt, id, description) {
    const response = await fetch('https://demostris-inc.com/fantomlords/ascendedLords/descriptionChange/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ receipt, id, description })
    });
  }


  const changeAscendedLordName = async function() {
    setFeedback(`Sending name change request...`);
    setChangingAscendedLordName(true);
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const XRLCAbi = [{
        constant: false,
        inputs: [{
          name: "_to",
          type: "address"
        }, {
          name: "_value",
          type: "uint256"
        }],
        name: "transfer",
        outputs: [{
          name: "",
          type: "bool"
        }],
        type: "function",
        name: 'transfer',
    }];
    const XRLCAddress = '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
    const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);
        // notifyNameChange({}, selectedAscendedLord.edition, changeLordNameInput);
    XRLCContract.methods.transfer(
      '0x4a03721C829Ae3d448bF37Cac21527cbE75fc4Cb',
      web3.utils.toBN(22000000000000000000),
    ).send({
        from: blockchain.account.toLowerCase(),
      })
      .once('error', (err) => {
        setFeedback('Something went wrong. Please, try again later.');
        console.log(err);
      })
      .then((receipt) => {
        setFeedback(`The request has been sent...`);
        console.log(receipt);
        notifyNameChange(receipt, selectedAscendedLord.id, changeLordNameInput);
      })
      .finally(() => {
        setChangingAscendedLordName(false);
      });
  }

  const changeAscendedLordDescription = async function() {
    setFeedback(`Sending description change request...`);
    setChangingAscendedLordDescription(true);
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const XRLCAbi = [{
        constant: false,
        inputs: [{
          name: "_to",
          type: "address"
        }, {
          name: "_value",
          type: "uint256"
        }],
        name: "transfer",
        outputs: [{
          name: "",
          type: "bool"
        }],
        type: "function",
        name: 'transfer',
    }];
    const XRLCAddress = '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
    const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);
        // notifyNameChange({}, selectedAscendedLord.edition, changeLordNameInput);
    XRLCContract.methods.transfer(
      '0x4a03721C829Ae3d448bF37Cac21527cbE75fc4Cb',
      web3.utils.toBN(22000000000000000000),
    ).send({
        from: blockchain.account.toLowerCase(),
      })
      .once('error', (err) => {
        setFeedback('Something went wrong. Please, try again later.');
        console.log(err);
      })
      .then((receipt) => {
        setFeedback(`The request has been sent...`);
        console.log(receipt);
        notifyDescriptionChange(receipt, selectedAscendedLord.id, changeLordDescriptionInput);
      })
      .finally(() => {
        setChangingAscendedLordDescription(false);
      });
  }

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
        <ResponsiveWrapper flex={1} style={{ padding: 24 }}>
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
                <s.Container
                  ai={'center'}
                  jc={'center'}
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
                </s.Container>
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
                    <s.Container
                      ai={'center'}
                      jc={'center'}
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
                    </s.Container>
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
                    <s.Container
                      ai={'center'}
                      jc={'center'}
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
                        text="Are you willing to burn some of your Relics as a pious offering?"
                        typeSpeed={45}
                        // scrollArea={myAppRef}
                      />
                    </s.Container>

                    <s.SpacerMedium />
                    <s.Container
                      ai={'center'}
                      jc={'center'}
                      style={{
                        padding: '30px',
                        width: 'auto',
                      }}
                    >
                      {!approvalInfo ? (
                        <>
                          <s.Container ai={'center'} jc={'center'} fd={'row'}>
                            <StyledButton
                              style={{ fontSize: '1.6rem' }}
                              // disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                testSetApprovalForAll();
                                getData();
                              }}
                            >
                              {'APPROVE'}
                            </StyledButton>
                          </s.Container>
                        </>
                      ) : (
                        <>
                          {/* <s.TextDescription
                            style={{
                              textAlign: 'center',
                              color: 'var(--accent-text)',
                            }}
                          >
                            {feedback}
                          </s.TextDescription> */}
                          <Row>
                            <Col>
                              <s.Container
                                ai={'center'}
                                jc={'center'}
                                style={{
                                  border: '1px solid var(--secondary)',
                                  borderRadius: '10px',
                                  padding: '30px',
                                  height: '100%',
                                  width: 'auto',
                                  marginBottom: '30px',
                                }}
                              >
                                <s.TextDescription
                                  style={{
                                    textAlign: 'center',
                                    color: 'var(--accent-text)',
                                    fontSize: '1.2rem',
                                  }}
                                >
                                  You own a total of{' '}
                                  {(ownedXRLC / 1e18).toFixed(3)}{' '}
                                  <a
                                    href="https://ftmscan.com/token/0xE5586582E1a60E302a53e73E4FaDccAF868b459a"
                                    target="_blank"
                                  >
                                    $XRLC
                                  </a>
                                  .
                                </s.TextDescription>
                              </s.Container>
                            </Col>
                            <Col>
                              <s.Container
                                ai={'center'}
                                jc={'center'}
                                style={{
                                  border: '1px solid var(--secondary)',
                                  borderRadius: '10px',
                                  padding: '30px',
                                  height: '100%',
                                  width: 'auto',
                                  marginBottom: '30px',
                                }}
                              >
                                <s.TextDescription
                                  style={{
                                    textAlign: 'center',
                                    color: 'var(--accent-text)',
                                    fontSize: '1.2rem',
                                  }}
                                >
                                  You can exchange $XRLC on: <br />
                                  <a
                                    href="https://spooky.fi/#/swap?outputCurrency=0xe5586582e1a60e302a53e73e4fadccaf868b459a"
                                    target="_blank"
                                  >
                                    SpookySwap
                                  </a>
                                </s.TextDescription>
                              </s.Container>
                            </Col>
                          </Row>

                          <s.SpacerLarge />

                          <Row style={{width: "100%"}}>
                            <Col style={{
                              border: '1px solid var(--secondary)',
                              borderRadius: '10px',
                              padding: '30px',
                              height: '100%',
                              width: 'auto',
                              marginBottom: '30px',
                            }}>
                              <s.TextDescription
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                }}
                              >
                                Forge {mintAmount} Artifact(s) for{' '}
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
                                    updatePrice(mintAmount - 1);
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
                                    updatePrice(mintAmount + 1);
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
                            </Col>
                          </Row>
                        </>
                      )}
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
                            // getData();
                          }}
                        >
                          VIEW ARTIFACTS
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
                          if(!item || "image" in item) { return(<></>); }
                          return (
                            <Col key={`maincol-${index}`}>
                              <Card
                                key={`maincard-${index}`}
                                style={{
                                  width: 'auto',
                                  height: '100%',
                                  borderRadius: '10px',
                                  backgroundColor: 'var(--primary-dark)',
                                  color: '#fff',
                                }}
                              >
                                <Card.Img
                                  key={`maincardimg-${index}`}
                                  variant="top"
                                  src={item.image.replace(
                                    'ipfs://',
                                    'https://nftstorage.link/ipfs/'
                                  )}
                                />
                                <Card.Body key={`maincardbody-${index}`}>
                                  <Card.Title
                                    key={`maincardtitle-${index}`}
                                    // style={{
                                    //   borderBottom: '1px solid #fff',
                                    //   paddingBottom: '5px',
                                    // }}
                                  >
                                    {item.name}
                                  </Card.Title>
                                  {/* <Card.Text key={`maincardtext-${index}`}>
                                    <ul>
                                      <li>{`${item.attributes[0].trait_type}: ${item.attributes[0].value}`}</li>
                                      <li>{`${item.attributes[1].trait_type}: ${item.attributes[1].value}`}</li>
                                      <li>{`${item.attributes[2].trait_type}: ${item.attributes[2].value}`}</li>
                                      <li>{`${item.attributes[3].trait_type}: ${item.attributes[3].value}`}</li>
                                      <li>{`${item.attributes[4].trait_type}: ${item.attributes[4].value}`}</li>
                                      <li>{`${item.attributes[5].trait_type}: ${item.attributes[5].value}`}</li>
                                      <li>{`${item.attributes[6].trait_type}: ${item.attributes[6].value}`}</li>
                                    </ul>
                                  </Card.Text> */}
                                </Card.Body>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    )}
                  </>
                )}
                
                <s.SpacerLarge />
                <s.SpacerLarge />
                { /* change lord name */ }
                {!nameChangeMenuOpen || !ascendedLords ? (
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
                      {!isCheckingNameChange && (
                        <StyledButton
                          style={{ fontSize: '1.5rem' }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsCheckingNameChange(true);
                            setNameChangeMenuOpen(true);
                            listAscendedLordsOfOwner(blockchain.account);
                            // getData();
                          }}
                        >
                          CHANGE YOUR LORD'S NAME
                        </StyledButton>
                      )}
                      {isCheckingNameChange && (
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
                    {(!ascendedLords.length) ? (
                      <s.Container ai={'center'} jc={'center'}>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                          }}
                        >
                          You don't seem to have any Ascended Lords...
                          <br />
                          You have to sacrifice something first...
                        </s.TextDescription>
                      </s.Container>
                    ) : (
                      <div style={{
                            border: '1px solid var(--secondary)',
                            borderRadius: '10px',
                            padding: '30px',
                            height: 'auto',
                            width: 'auto',
                            marginBottom: '30px',
                          }}>
                        <Row style={{width: "100%"}}>
                          <Col>
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                              }}
                            >
                              Change your lord's name
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <s.Container ai={'center'} jc={'center'} fd={'row'}>
                              <StyledInput 
                                type={"text"}
                                value={changeLordNameInput}
                                onChange={(event) => handleNameChangeInput(event) }></StyledInput>
                            </s.Container>
                            <s.SpacerSmall />
                          </Col>
                        </Row>
                        <Row
                          xs={1}
                          md={2}
                          lg={ascendedLords.length > 1 ? 5 : ''}
                          className="g-4">
                          {ascendedLords.map((item, index) => {
                            if(!item || ! "image" in item) { return; }
                            return (
                              <Col key={`maincol-${index}`}>
                                <LordCard
                                  key={`maincard-${index}`}
                                  style={{
                                    width: 'auto',
                                    height: '100%',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--primary-dark)',
                                    boxShadow: (item.id == selectedAscendedLord.id ? "0 0 10px #dfed9e" : "none"),
                                    color: '#fff',
                                  }}
                                  onClick={(e) => {
                                    setSelectedAscendedLord(item);
                                    setChangeLordNameInput(item.name);
                                  }}
                                >
                                  <Card.Img
                                    key={`maincardimg-${index}`}
                                    variant="top"
                                    src={item.image.replace(
                                      'ipfs://',
                                      'https://nftstorage.link/ipfs/'
                                    )}
                                  />
                                  <Card.Body key={`maincardbody-${index}`}>
                                    <Card.Title
                                      key={`maincardtitle-${index}`}
                                      // style={{
                                      //   borderBottom: '1px solid #fff',
                                      //   paddingBottom: '5px',
                                      // }}
                                    >
                                      {item.name}
                                    </Card.Title>
                                  </Card.Body>
                                </LordCard>
                              </Col>
                            );
                          })}
                        </Row>
                        <s.SpacerLarge />
                        <Row>
                          <Col>
                            <s.Container ai={'center'} jc={'center'} fd={'row'}>
                              <StyledButton
                                style={{ fontSize: '1.6rem' }}
                                disabled={changingAscendedLordName ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setNameChangeMenuOpen(true);
                                  changeAscendedLordName();
                                  // getData();
                                }}
                              >
                                {changingAscendedLordName ? 'Changing...' : 'Change your lord\'s name'.toUpperCase()}
                              </StyledButton>
                            </s.Container>
                            <s.SpacerLarge />
                            <s.TextDescription style={{ textAlign: 'center', color: 'var(--accent-text)', opacity: 0.7  }}>
                              (Ascended Lords Only) <br/>
                            </s.TextDescription>
                            <s.TextDescription style={{ textAlign: 'left', color: 'var(--accent-text)', opacity: 0.7  }}>
                              Lord Enri will personally review and change your name,
                              if you make a mistake you can always ask for support, 
                              refund, or rework of your spelling. <br/>
                              Everything except rude and offensive material will be accepted, 
                              for support contact Lord Enri on discord at Enri#6877,
                              it will usually take 48 hours for the name change to be finalized.
                            </s.TextDescription>
                          </Col>
                        </Row>
                        {changingAscendedLordName && <AlertDismissible />}
                      </div>
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
                { /* change lord description */ }
                {!descriptionChangeMenuOpen || !ascendedLords ? (
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
                      {!isCheckingDescriptionChange && (
                        <StyledButton
                          style={{ fontSize: '1.5rem' }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsCheckingDescriptionChange(true);
                            setDescriptionChangeMenuOpen(true);
                            listAscendedLordsOfOwner(blockchain.account);
                            // getData();
                          }}
                        >
                          CHANGE YOUR LORD'S DESCRIPTION
                        </StyledButton>
                      )}
                      {isCheckingDescriptionChange && (
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
                    {!ascendedLords.length ? (
                      <s.Container ai={'center'} jc={'center'}>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                          }}
                        >
                          You don't seem to have any Ascended Lords...
                          <br />
                          You have to sacrifice something first...
                        </s.TextDescription>
                      </s.Container>
                    ) : (
                      <div style={{
                            border: '1px solid var(--secondary)',
                            borderRadius: '10px',
                            padding: '30px',
                            height: 'auto',
                            width: 'auto',
                            marginBottom: '30px',
                          }}>
                        <Row style={{width: "100%"}}>
                          <Col>
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                              }}
                            >
                              Change your lord's description
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <s.Container ai={'center'} jc={'center'} fd={'row'}>
                              <StyledInput 
                                type={"text"}
                                value={changeLordDescriptionInput}
                                onChange={(event) => handleDescriptionChangeInput(event) }></StyledInput>
                            </s.Container>
                            <s.SpacerSmall />
                          </Col>
                        </Row>
                        <Row
                          xs={1}
                          md={2}
                          lg={ascendedLords.length > 1 ? 5 : ''}
                          className="g-4">
                          {ascendedLords.map((item, index) => {
                            if(!item || ! "image" in item) { return; }
                            return (
                              <Col key={`maincol-${index}`}>
                                <LordCard
                                  key={`maincard-${index}`}
                                  style={{
                                    width: 'auto',
                                    height: '100%',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--primary-dark)',
                                    color: '#fff',
                                    boxShadow: (item.id == selectedAscendedLord.id ? "0 0 10px #dfed9e" : "none")
                                  }}
                                  onClick={(e) => {
                                    setSelectedAscendedLord(item);
                                    setChangeLordDescriptionInput(item.description);
                                  }}
                                >
                                  <Card.Img
                                    key={`maincardimg-${index}`}
                                    variant="top"
                                    src={item.image.replace(
                                      'ipfs://',
                                      'https://nftstorage.link/ipfs/'
                                    )}
                                  />
                                  <Card.Body key={`maincardbody-${index}`}>
                                    <Card.Title
                                      key={`maincardtitle-${index}`}
                                      // style={{
                                      //   borderBottom: '1px solid #fff',
                                      //   paddingBottom: '5px',
                                      // }}
                                    >
                                      {item.name}
                                    </Card.Title>
                                  </Card.Body>
                                </LordCard>
                              </Col>
                            );
                          })}
                        </Row>
                        <s.SpacerLarge />
                        <Row>
                          <Col>
                            <s.Container ai={'center'} jc={'center'} fd={'row'}>
                              <StyledButton
                                style={{ fontSize: '1.6rem' }}
                                disabled={changingAscendedLordDescription ? 1 : 0}
                                onClick={(e) => {
                                  e.preventDefault();
                                  changeAscendedLordDescription();
                                  // getData();
                                }}
                              >
                                {changingAscendedLordDescription ? 'Changing...' : 'Change your lord\'s description'.toUpperCase()}
                              </StyledButton>
                            </s.Container>
                            <s.SpacerLarge />
                            <s.TextDescription style={{ textAlign: 'center', color: 'var(--accent-text)', opacity: 0.7  }}>
                              (Ascended Lords Only) <br/>
                            </s.TextDescription>
                            <s.TextDescription style={{ textAlign: 'left', color: 'var(--accent-text)', opacity: 0.7  }}>
                              Lord Enri will personally review and change your description,
                              if you make a mistake you can always ask for support, 
                              refund, or rework of your spelling. <br/>
                              Everything except rude and offensive material will be accepted, 
                              for support contact Lord Enri on discord at Enri#6877,
                              it will usually take 48 hours for the description change to be finalized.
                            </s.TextDescription>
                          </Col>
                        </Row>
                        {changingAscendedLordDescription && <AlertDismissible />}
                      </div>
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

export default Ashsmith;

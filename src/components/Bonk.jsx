import React, { useEffect, useState, useRef } from 'react';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import Web3 from 'web3';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import tune_bonk_sound_1 from '../assets/sounds/bonk_sound_1.mp3';
import tune_bonk_sound_2 from '../assets/sounds/bonk_sound_2.mp3';
import tune_bonk_sound_3 from '../assets/sounds/bonk_sound_3.mp3';
import tune_bonk_sound_4 from '../assets/sounds/bonk_sound_4.mp3';
import tune_bonk_sound_5 from '../assets/sounds/bonk_sound_5.mp3';

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

export const ProgressBarText = styled(HeaderTitle)`
  margin-top: 15px;
  text-shadow: 1px 2px var(--secondary);
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 1rem;
    text-shadow: 1px 3px var(--secondary);
  }
  @media (min-width: 1000px) {
    font-size: 1.5rem;
    text-shadow: 1px 4px var(--secondary);
  }
  transition: width 0.5s;
`;


export const BonkerContainer = styled.div``;

// const bonkersTestAddress = "0xB013B008ec1214894851eC6D1A87CFaa4B3D8348";
var bonkersTestAddress = "0x9d4b9ae4849d72a6273313aabca59bc0575a4c6a";
bonkersTestAddress = "0x9d4b9ae4849d72a6273313aabca59bc0575a4c6a";

function Bonk() {
    
    const bonk_sound_1 = useRef(new Audio(tune_bonk_sound_1));
    const bonk_sound_2 = useRef(new Audio(tune_bonk_sound_2));
    const bonk_sound_3 = useRef(new Audio(tune_bonk_sound_3));
    const bonk_sound_4 = useRef(new Audio(tune_bonk_sound_4));
    const bonk_sound_5 = useRef(new Audio(tune_bonk_sound_5));
    
    function play_bonk_sound() {
        [bonk_sound_1, bonk_sound_2, bonk_sound_3, bonk_sound_4, bonk_sound_5][getRandomInt(0,4)].current.play();
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const checkApproval = async () => {
        console.log("checking approval...");
        await window.ethereum.enable();
        const abiResponse = await fetch('/config/abi_xrlc.json', {
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            },
        });
        const XRLCAbi = await abiResponse.json();
        const XRLCAddress =
            '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();

        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);

        const approval = await XRLCContract.methods
            .allowance(blockchain.account.toLowerCase(), bonkersTestAddress)
            .call();

        console.log(approval);

        let confirmApprove = true;
        if (approval == 0) {
            confirmApprove = false;
        }

        console.log({ confirmApprove });
 
        setApprovalInfo(confirmApprove);
    };
    const approveRelicAllowance = async () => {
        // setFeedback(`You're approving XRLC...`);
        // setIsDoingTransaction(true);
        const abiResponse = await fetch('/config/abi_xrlc.json', {
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            },
        });
        const XRLCAbi = await abiResponse.json();
        const XRLCAddress = '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
        // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);


        await XRLCContract.methods
            .approve(bonkersTestAddress, web3.utils.toWei('1000000', 'ether'))
            .send({
            // to: CONFIG.CONTRACT_ADDRESS,
            from: blockchain.account.toLowerCase(),
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            type: '0x2',
        });
        setApprovalInfo(true);
        checkApproval();
        updateData();
        // testPoolInfo();
        // setIsDoingTransaction(false);
    };



    function getBonkABI() {
        return [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notRevealedUri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"safeMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_notRevealedURI","type":"string"}],"name":"setNotRevealedURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    }

    function getRandomOuchText() {
        const baseTexts = [
            "Ouch",
            "Aieee",
            "The pain!",
            "No more",
            "Stop!",
            "Mercy!",
            "It hurts",
            "It hertz",
            "(ﾉಥ益ಥ）",
            "(╯°Д°）╯",
            "¯\(ツ)/¯ ",
            "(ง’̀-‘́)ง",
            "ಠ_ಠ",
            "(;﹏;)",
            "╥﹏╥",
            "（>﹏<）",
            ">9000 DMG!",
            "Critical bonk!",
            "Concussive!",
            "I'm ded X_X",
            "Call an ambulance",
        ];
        const text = baseTexts[getRandomInt(0,baseTexts.length)];
        return text;
    }

    function bonk() {
        if(bonked === true) { return; }
        let currentBonkCount = bonkCount;
        setBonkCount(currentBonkCount + 1);
        if(currentBonkCount + 1 >= bonkLimit) {
            console.log("Bonk limit reached!");
            checkApproval();
            updateData();
            return;
        }
        play_bonk_sound();
        let newBonkId = getRandomInt(10, 61);
        newBonkId = newBonkId == 22 ? newBonkId + 1 : newBonkId;
        setBonkID(newBonkId);
        setOuchText(getRandomOuchText());
        setBonked(true);
        
        setTimeout(() => { setBonked(false); }, 200 );
    }

    const claimNFTs = async () => {
        // added async

        // ADD DEDICATED ABI AND CONFIGS
        // const abiResponse = await fetch('/config/abi_artifacts.json', {
        //     headers: {
        //     'Content-Type': 'application/json',
        //     Accept: 'application/json',
        //     },
        // });
        // const artifactsAbi = await abiResponse.json();
        // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address
        const bonkABI = getBonkABI();
    
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const bonkersAddress = new web3.eth.Contract(
            bonkABI,
            bonkersTestAddress
        );
        //

        // console.log(symbol);

        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log('Cost: ', totalCostWei);
        console.log('Gas limit: ', totalGasLimit);
        setFeedback(`Bonking your Bonker...`);
        setFeedbackLink(``);
        setClaimingNft(true);
        // console.log(artifactContract.address);
        bonkersAddress.methods
            .mint(mintAmount)
            // .safeMint()
            // .send()
            .send({
            to: bonkersTestAddress,
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
                setFeedbackLink(``);
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback("Check out your freshly Bonked Bonkers at ");
                setFeedbackLink("https://paintswap.finance/marketplace/collections/the-fantom-bonkers/nfts");
                setMintSuccess(true);
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
        if (newMintAmount > 5) {
            newMintAmount = 5;
        }
        setMintAmount(newMintAmount);
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

    const getData = () => {
        if (blockchain.account !== '' && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

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
            minWidth: '18rem',
            maxWidth: '35rem',
            zIndex: '9999',
            borderRadius: '10px',
            // transition: 'opacity 2s ease-in'
            // border: '1px solid white'
            }}
        >
            {/* <Alert.Heading>{feedback}</Alert.Heading> */}
            <s.Container>
            <s.TextDescription>{feedback} { feedbackLink ? <a href={feedbackLink}>{feedbackLink}</a> : <></> }</s.TextDescription>
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
        // updatePrice(1);
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


    // TODO: change this to bonkers contract
    const updatePrice = async (amount) => {
        const bonkABI = getBonkABI();
    
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const bonkersAddress = new web3.eth.Contract(
            bonkABI,
            bonkersTestAddress
        );
        //

        if (amount < 1) {
            amount = 1;
        } else if (amount > 10) {
            amount = 10;
        }

        const price = await artifactContract.methods.price(amount).call();

        setXRLCPrice((price / 1e18).toFixed(3));
    //   return price;
    };

    const [bonked, setBonked] = useState(false);
    const [bonkCount, setBonkCount] = useState(0);
    const [ouchText, setOuchText] = useState(getRandomOuchText());
    const [bonkID, setBonkID] = useState(getRandomInt(10, 61));
    
    const blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();

    const [mintSuccess, setMintSuccess] = useState(false);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(``);
    const [feedbackLink, setFeedbackLink] = useState(``);
    const [isDoingTransaction, setIsDoingTransaction] = useState(false);
    const [approvalInfo, setApprovalInfo] = useState(false);
    const [mintAmount, setMintAmount] = useState(1);
    const [XRLCPrice, setXRLCPrice] = useState(null);
    const [isUpdatingData, setIsUpdatingData] = useState(false);
    const [ownedXRLC, setOwnedXRLC] = useState(false);
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

    useEffect(() => {
        getConfig();
    }, []);


    useEffect(() => {
        getData();
    }, [blockchain.account]);


    const bonkLimit = 69;

    return(        
        <s.Screen>
            <s.Container
                flex={1}
                ai={'center'}
                style={{ padding: 24, backgroundColor: 'var(--primary)' }}>
            <> { blockchain.account === '' || blockchain.smartContract === null ? (
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
                  WHAT'S THIS?
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
            ) : 
                <>
                    <ResponsiveWrapper flex={1} style={{ 
                        padding: 24, 
                        display: bonkCount >= bonkLimit ? "none" : "flex"
                        }}>
                        <s.Container flex={1} jc={'center'} ai={'center'}>
                            <s.SpacerLarge />
                            <HeaderTitle>
                                Bonk
                            </HeaderTitle>
                            <s.SpacerLarge />
                            <s.TextDescription
                                style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                                width: 'auto',
                                }}
                            >
                                <small className="text-muted">
                                    Attention summoners, our lordly <br/> stronghold has been invaded <br/> by these obnoxious bonkers! <br/> Help us get rid of them!
                                </small>
                            </s.TextDescription>
                            <BonkerContainer
                                onClick={(e) => {
                                    e.preventDefault();
                                    bonk();
                                }}
                                style={{
                                    width: "400px",
                                    height: "400px",
                                    cursor: bonked ? "url('/config/images/small_bonk_anim_2.png'), pointer" : "url('/config/images/small_bonk_anim_1.png'), pointer",
                                    backgroundSize: "cover",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: `url('/config/images/bonkers/${bonkID}.png')`,
                                    // backgroundImage: (bonked ? `` : `url('/config/images/bonkers/${bonkID}.png')`),
                                }}>
                                {
                                    bonked && <>
                                        <HeaderTitle style={{ "color": "red", "-webkit-touch-callout": "none", "-webkit-user-select": "none", "-khtml-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none", }}>
                                            { ouchText }
                                        </HeaderTitle>
                                    </>                                
                                }
                            </BonkerContainer>
                            <s.SpacerLarge />
                            <div style={{
                                width: "450px",
                                height: "20px",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                marginTop: "20px",
                                borderRadius: "10px"
                            }}>
                                <div style={{
                                    width: "inherit",
                                    height: "inherit",
                                    float: "left",
                                    width: `${ bonkCount == 0 ? 0 : 100*bonkCount/bonkLimit }%`,
                                    backgroundColor: "#6832e8",
                                    borderRadius: "inherit",
                                    transition: "width 2s",
                                }}>
                                </div>
                            </div>
                            <ProgressBarText>
                                Gotta bonk'em all 🔨
                            </ProgressBarText>
                        </s.Container>
                        <s.SpacerLarge />
                        <s.SpacerLarge />
                    </ResponsiveWrapper>
                    <ResponsiveWrapper flex={1} style={{ 
                        padding: 24, 
                        display: bonkCount >= bonkLimit ? "flex" : "none"
                        }}>
                        <s.Container flex={1} jc={'center'} ai={'center'}>
                            <s.SpacerLarge />
                            <HeaderTitle>
                                Bonk
                            </HeaderTitle>

                            <s.SpacerLarge />
                            <s.TextDescription
                                style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                                width: 'auto',
                                }}
                            >
                                <small className="text-muted">
                                    Good Job, you have <br/>
                                    subdued the pesky Bonkers, <br/>
                                    you may take some <br/>
                                    with you!
                                </small>
                            </s.TextDescription>
                            <s.SpacerLarge />
                            <BonkerContainer
                                onClick={(e) => {
                                    e.preventDefault();
                                    bonk();
                                }}
                                style={{
                                    width: "400px",
                                    height: "400px",
                                    cursor: bonked ? "url('/config/images/small_bonk_anim_2.png'), pointer" : "url('/config/images/small_bonk_anim_1.png'), pointer",
                                    backgroundSize: "cover",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: (bonked ? `` : `url('/config/images/bonkers/${bonkID}.png')`),
                                }}>
                                {
                                    bonked && <>
                                        <HeaderTitle>
                                            { ouchText }
                                        </HeaderTitle>
                                    </>                                
                                }
                            </BonkerContainer>
                            <>
                                {mintSuccess && <AlertDismissible />}
                                {claimingNft && <AlertDismissible />}
                                {isDoingTransaction && <AlertDismissible />}
                                <s.SpacerMedium />
                                <s.Container
                                ai={'center'}
                                jc={'center'}
                                style={{
                                    padding: '30px',
                                    width: 'auto',
                                }}
                                >
                                {!approvalInfo  ? (
                                    <>
                                    <s.Container ai={'center'} jc={'center'} fd={'row'}>
                                        <StyledButton
                                        style={{ fontSize: '1.6rem' }}
                                        // disabled={claimingNft ? 1 : 0}
                                        onClick={(e) => {
                                            approveRelicAllowance();
                                            e.preventDefault();
                                            // testSetApprovalForAll();
                                            // getData();
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
                                            </a> <br />
                                            0xE5586582E1a60E302a53e73E4FaDccAF868b459a
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
                                            Mint {mintAmount} Bonker(s) for{' '}
                                            { 69 * mintAmount} XRLC (+ gas fees).
                                        </s.TextDescription>
                                        <s.SpacerSmall />
                                        <s.Container ai={'center'} jc={'center'} fd={'row'}>
                                            <StyledRoundButton
                                            style={{ lineHeight: 0.4 }}
                                            disabled={claimingNft ? 1 : 0}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                decrementMintAmount();
                                                // updatePrice(mintAmount - 1);
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
                                                // updatePrice(mintAmount + 1);
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
                                            {claimingNft ? 'Minting...' : 'MINT NOW'}
                                            </StyledButton>
                                        </s.Container>
                                        </Col>
                                    </Row>
                                    </>
                                )}
                                </s.Container>
                            </>
                            <s.SpacerLarge />
                        </s.Container>
                        <s.SpacerLarge />
                        <s.SpacerLarge />
                    </ResponsiveWrapper>
                </>
            } </>
            </s.Container>
        </s.Screen>
    );
}

export default Bonk;
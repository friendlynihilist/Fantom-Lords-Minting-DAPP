import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faUser } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import ListApp from '../listApp';
import {
    Container,
    Row,
    Col,
    FormCheck,
    InputGroup,
    FormControl,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import tune from '../assets/fantomLords.mp3';
import MusicCard from '../player';

const disabledButton = {
    cursor: 'not-allowed',
    pointerEvents: 'none',
};

const displayNone = {
    display: 'none',
};

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
    text-shadow: 2px 4px #6b33ee;
    text-align: center;
    font-size: 4rem;
    color: var(--primary-text);
    font-family: 'Alagard', monospace;
    font-weight: bold;
    color: 'var(--accent-text)';
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



function Army() {

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

    async function listTokensOfOwner(address) {
        const enriAddress = '0x4a03721C829Ae3d448bF37Cac21527cbE75fc4Cb'.toLowerCase(); //remove me
        address = enriAddress; //remove me
        const balance = await blockchain.smartContract.methods.balanceOf(address.toLowerCase()).call();
        let idsArray = [];
        let tokensArray = [];

        if (balance) { //if address owns Lord(s), then calling tokenOfOwnersByIndex is possible

            // PREPARING THE IDs ARRAY
            for (let index = 0; index < balance; index++) {
                idsArray.push(index);
            }

            await Promise.all(idsArray.map(async id => {
                const getTokenId = await blockchain.smartContract.methods.tokenOfOwnerByIndex(address.toLowerCase(), id).call();
                const tokenUri = await blockchain.smartContract.methods.tokenURI(getTokenId).call();
                const response = await fetch(tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/'));
                const jsonifyResp = await response.json();
                // tokensArray.push(jsonifyResp);
                tokensArray.push(jsonifyResp);
            }));
            setLords(tokensArray);
            // console.log(tokensArray);
            console.log(tokensArray);
            // return TOKENS_ARRAY.map(token => {
            //     <div>{token.name}</div>
            // })
        }
    }

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    const startTrack = () => {
        let audioRef = new Audio(tune);
        audioRef.play();
    };

    // const checkArmy = () => {
    //     !ARMY_CHECKED;
    //     console.log(ARMY_CHECKED);
    // }


    return (
        <s.Screen>
            <s.Container
                flex={1}
                ai={'center'}
                style={{ padding: 24, backgroundColor: 'var(--primary)' }}
                image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
            >

                <HeaderTitle>Fantom Lords</HeaderTitle>
                <s.SpacerSmall />
                <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
                    <s.SpacerLarge />
                    <s.Container
                        flex={1}
                        jc={'center'}
                        ai={'center'}
                    >
                        {/* <StyledImg
                            alt={'The Great Summoning'}
                            src={'/config/images/ritual_template_rect.png'}

                        /> */}

                        {/* <s.TextTitle
                            style={{
                                textAlign: 'center',
                                fontSize: 30,
                                fontWeight: 'bold',
                                color: 'var(--accent-text)',
                            }}
                        >
                            Summoner, attune to check your party
                        </s.TextTitle> */}

                        <s.SpacerXSmall />
                        {/* <s.TextDescription
                            style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                        >
                            Lorem ipsum
                        </s.TextDescription> */}
                        <s.SpacerSmall />
                        {blockchain.account === '' ||
                            blockchain.smartContract === null ? (
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
                            {!lords ? (
                                <>
                                <s.TextDescription
                                style={{
                                    textAlign: 'center',
                                    color: 'var(--accent-text)',
                                }}
                            >
                                Click to check your Fantom Lords' army
                            </s.TextDescription>
                            <s.SpacerSmall />
                            <s.Container ai={'center'} jc={'center'} fd={'row'}>
                                <StyledButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // claimNFTs();
                                        // getTokenOfOwnerByIndex(blockchain.account);
                                        listTokensOfOwner(blockchain.account);
                                        getData();
                                        // console.log(ARMY_CHECKED);
                                        // checkArmy();
                                    }}
                                // style={disabledButton}
                                >
                                    {claimingNft ? 'BUSY' : 'CHECK ARMY'}
                                    {/* {claimingNft ? "BUSY" : "NOT YET TIME"} */}
                                </StyledButton>
                            </s.Container>

                            <s.SpacerSmall />
                            </>
                            ) : (
                                <>
                                {/* <s.TextDescription
                                    style={{
                                        textAlign: 'center',
                                        color: 'var(--accent-text)',
                                    }}
                                >
                                    Lorem Ipsum
                                </s.TextDescription> */}
                                <s.Container fd={'row'} style={{ display: 'flex', flexWrap: 'wrap' }}>

                                
                                    {lords.map((item,index)=>{
                                        return <Card key={index} fd={'column'} style={{ flex: '1 1 33.33%', margin: '20px' }}>
                                        <Card.Img variant="top" src={(item.image).replace('ipfs://', 'https://ipfs.io/ipfs/')} />
                                        <Card.Body>
                                          <Card.Title>{item.name}</Card.Title>
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
                                    })}
                                
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

            </s.Container>
        </s.Screen>
    );
}

export default Army;

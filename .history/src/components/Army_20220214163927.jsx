import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import Card from "react-bootstrap/Card";
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
    let ARMY_CHECKED = false;

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
                TOKENS_ARRAY.push(jsonifyResp);
            }));
            // console.log(tokensArray);
            console.log(TOKENS_ARRAY);
            // return TOKENS_ARRAY.map(token => {
            //     <div>{token.name}</div>
            // })
        }
    }

    let items = [
        {
            "name": "Fantom Lords #62",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/62.png",
            "dna": "7af930f9331ee7ef97798179c27af0d018cd059c",
            "edition": 62,
            "date": 1638029489995,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Oathbreaker",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Sword and Shield",
                    "frequency": "12.6%",
                    "count": 420
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Base Lord",
                    "frequency": "14.91%",
                    "count": 497
                },
                {
                    "trait_type": "Armor",
                    "value": "Oathbreaker Cursed Armor",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Headgear",
                    "value": "Green Hood",
                    "frequency": "6.99%",
                    "count": 233
                },
                {
                    "trait_type": "Relic",
                    "value": "Amulet Of Protection",
                    "frequency": "9.9%",
                    "count": 330
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #3044",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/3044.png",
            "dna": "c1ecaf2ade4c2d0339e04d0d4d6f3aad07f0647c",
            "edition": 3044,
            "date": 1638029658988,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Warlock",
                    "frequency": "9.99%",
                    "count": 333
                },
                {
                    "trait_type": "Weapon",
                    "value": "Elemental Staff and Grimoire",
                    "frequency": "7.02%",
                    "count": 234
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Pale Cultist",
                    "frequency": "5.07%",
                    "count": 169
                },
                {
                    "trait_type": "Armor",
                    "value": "Warlock Fel Cuirass",
                    "frequency": "9.99%",
                    "count": 333
                },
                {
                    "trait_type": "Headgear",
                    "value": "None",
                    "frequency": "20.94%",
                    "count": 698
                },
                {
                    "trait_type": "Relic",
                    "value": "Glass Pipe",
                    "frequency": "7.56%",
                    "count": 252
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #94",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/94.png",
            "dna": "2d2d6e083eba3fc1d3038c026aed24a1d96f2b27",
            "edition": 94,
            "date": 1638029491837,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Assassin",
                    "frequency": "12%",
                    "count": 400
                },
                {
                    "trait_type": "Weapon",
                    "value": "Moonlight Greatsword",
                    "frequency": "2.7%",
                    "count": 90
                },
                {
                    "trait_type": "Background",
                    "value": "Dusk Moon",
                    "frequency": "9.48%",
                    "count": 316
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Desert Scarred Lord",
                    "frequency": "7.74%",
                    "count": 258
                },
                {
                    "trait_type": "Armor",
                    "value": "Assassin Nightly Garments",
                    "frequency": "12%",
                    "count": 400
                },
                {
                    "trait_type": "Headgear",
                    "value": "Big Red Hat",
                    "frequency": "6.66%",
                    "count": 222
                },
                {
                    "trait_type": "Relic",
                    "value": "Green Cube",
                    "frequency": "3.54%",
                    "count": 118
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #105",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/105.png",
            "dna": "057fc76eca4a8ae77d2088475da2d2e14a1ced77",
            "edition": 105,
            "date": 1638029492462,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Sorcerer",
                    "frequency": "9.09%",
                    "count": 303
                },
                {
                    "trait_type": "Weapon",
                    "value": "Rapier and Harp",
                    "frequency": "5.94%",
                    "count": 198
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Geralt Lord",
                    "frequency": "3.06%",
                    "count": 102
                },
                {
                    "trait_type": "Armor",
                    "value": "Sorcerer Robe",
                    "frequency": "9.09%",
                    "count": 303
                },
                {
                    "trait_type": "Headgear",
                    "value": "Void Gazer",
                    "frequency": "4.02%",
                    "count": 134
                },
                {
                    "trait_type": "Relic",
                    "value": "Living Dead",
                    "frequency": "4.86%",
                    "count": 162
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #1762",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/1762.png",
            "dna": "cba3eb7cff8d7c191deb59b728eab6619c70e2fe",
            "edition": 1762,
            "date": 1638029586593,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Plague Doctor",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Weapon",
                    "value": "Wooden Staff and Sparrow",
                    "frequency": "5.67%",
                    "count": 189
                },
                {
                    "trait_type": "Background",
                    "value": "Cursed Graveyard",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Desert Scarred Lord",
                    "frequency": "7.74%",
                    "count": 258
                },
                {
                    "trait_type": "Armor",
                    "value": "Plague Doctor Attire",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Headgear",
                    "value": "None",
                    "frequency": "20.94%",
                    "count": 698
                },
                {
                    "trait_type": "Relic",
                    "value": "Amulet Of Protection",
                    "frequency": "9.9%",
                    "count": 330
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #106",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/106.png",
            "dna": "58e0f5eeb9f075c73a39e171944dcf42192f2d00",
            "edition": 106,
            "date": 1638029492515,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Holy Avenger",
                    "frequency": "4.05%",
                    "count": 135
                },
                {
                    "trait_type": "Background",
                    "value": "Occult Circle",
                    "frequency": "9.93%",
                    "count": 331
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Scarred Lord",
                    "frequency": "10.2%",
                    "count": 340
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "None",
                    "frequency": "20.94%",
                    "count": 698
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #89",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/89.png",
            "dna": "b84744a9a805d47c4022f6ea7b45c61f17ee4197",
            "edition": 89,
            "date": 1638029491546,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Oathbreaker",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Weapon",
                    "value": "Wooden Staff and Sparrow",
                    "frequency": "5.67%",
                    "count": 189
                },
                {
                    "trait_type": "Background",
                    "value": "Ruined Vale",
                    "frequency": "9.96%",
                    "count": 332
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Dark Elf",
                    "frequency": "5.13%",
                    "count": 171
                },
                {
                    "trait_type": "Armor",
                    "value": "Oathbreaker Cursed Armor",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Headgear",
                    "value": "Assassin Hood",
                    "frequency": "7.47%",
                    "count": 249
                },
                {
                    "trait_type": "Relic",
                    "value": "Wooden Pipe",
                    "frequency": "7.74%",
                    "count": 258
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #4",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/4.png",
            "dna": "fa77c99a33c9b3154ae94c407efd6572f0f72aec",
            "edition": 4,
            "date": 1638029486281,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Plague Doctor",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Weapon",
                    "value": "Elemental Staff and Grimoire",
                    "frequency": "7.02%",
                    "count": 234
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Desert Lord",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Armor",
                    "value": "Plague Doctor Attire",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Headgear",
                    "value": "Full Helm",
                    "frequency": "6.6%",
                    "count": 220
                },
                {
                    "trait_type": "Relic",
                    "value": "Green Cube",
                    "frequency": "3.54%",
                    "count": 118
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #39",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/39.png",
            "dna": "e12acac388cda3f8873ee12eb2f054f8df655e36",
            "edition": 39,
            "date": 1638029488631,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Sword and Shield",
                    "frequency": "12.6%",
                    "count": 420
                },
                {
                    "trait_type": "Background",
                    "value": "Cursed Graveyard",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Scarred Lord",
                    "frequency": "10.2%",
                    "count": 340
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "Minstrel Hat",
                    "frequency": "6.99%",
                    "count": 233
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #2579",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/2579.png",
            "dna": "0e466441ed61f431b6d5fc6826808bac78d18024",
            "edition": 2579,
            "date": 1638029632716,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Assassin",
                    "frequency": "12%",
                    "count": 400
                },
                {
                    "trait_type": "Weapon",
                    "value": "Katars",
                    "frequency": "8.22%",
                    "count": 274
                },
                {
                    "trait_type": "Background",
                    "value": "Cursed Graveyard",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Gatsu",
                    "frequency": "4.35%",
                    "count": 145
                },
                {
                    "trait_type": "Armor",
                    "value": "Assassin Nightly Garments",
                    "frequency": "12%",
                    "count": 400
                },
                {
                    "trait_type": "Headgear",
                    "value": "None",
                    "frequency": "20.94%",
                    "count": 698
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #117",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/117.png",
            "dna": "2656a22c22551b1f82a7fc4cb8492c5fcd2837ae",
            "edition": 117,
            "date": 1638029493150,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Plague Doctor",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Weapon",
                    "value": "Scimitar And Magic Missile",
                    "frequency": "4.23%",
                    "count": 141
                },
                {
                    "trait_type": "Background",
                    "value": "Cursed Graveyard",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Zombie Lord",
                    "frequency": "5.61%",
                    "count": 187
                },
                {
                    "trait_type": "Armor",
                    "value": "Plague Doctor Attire",
                    "frequency": "10.02%",
                    "count": 334
                },
                {
                    "trait_type": "Headgear",
                    "value": "Green Hood",
                    "frequency": "6.99%",
                    "count": 233
                },
                {
                    "trait_type": "Relic",
                    "value": "Black Dragon Hatchling",
                    "frequency": "2.82%",
                    "count": 94
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #1703",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/1703.png",
            "dna": "da9571b1741d9a80335a0bb530dee9009c459b16",
            "edition": 1703,
            "date": 1638029583288,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Ranger",
                    "frequency": "12.69%",
                    "count": 423
                },
                {
                    "trait_type": "Weapon",
                    "value": "Scimitar And Magic Missile",
                    "frequency": "4.23%",
                    "count": 141
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Gatsu",
                    "frequency": "4.35%",
                    "count": 145
                },
                {
                    "trait_type": "Armor",
                    "value": "Ranger Leather Armor",
                    "frequency": "12.69%",
                    "count": 423
                },
                {
                    "trait_type": "Headgear",
                    "value": "Halo",
                    "frequency": "5.13%",
                    "count": 171
                },
                {
                    "trait_type": "Relic",
                    "value": "Amulet Of Protection",
                    "frequency": "9.9%",
                    "count": 330
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #16",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/16.png",
            "dna": "b73a9f8b78dabb55f4f8c240850851adb5e02705",
            "edition": 16,
            "date": 1638029487191,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Necromancer",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Sword and Shield",
                    "frequency": "12.6%",
                    "count": 420
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Skeleton",
                    "frequency": "6.18%",
                    "count": 206
                },
                {
                    "trait_type": "Armor",
                    "value": "Necromancer Bone Armor",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Headgear",
                    "value": "Cimmerian Helm",
                    "frequency": "3.81%",
                    "count": 127
                },
                {
                    "trait_type": "Relic",
                    "value": "Amulet Of Protection",
                    "frequency": "9.9%",
                    "count": 330
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #95",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/95.png",
            "dna": "3bcfc6577e3a487aed197b43425fbd8a333f4189",
            "edition": 95,
            "date": 1638029491891,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Oathbreaker",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Weapon",
                    "value": "Charred Wand and Fireball",
                    "frequency": "4.11%",
                    "count": 137
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "High Elf",
                    "frequency": "7.02%",
                    "count": 234
                },
                {
                    "trait_type": "Armor",
                    "value": "Oathbreaker Cursed Armor",
                    "frequency": "2.64%",
                    "count": 88
                },
                {
                    "trait_type": "Headgear",
                    "value": "Big Blue Hat",
                    "frequency": "4.65%",
                    "count": 155
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #93",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/93.png",
            "dna": "7499808ef359c57e1754bc3d4ffcee21652874e4",
            "edition": 93,
            "date": 1638029491780,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Necromancer",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Weapon",
                    "value": "Sickle and Ankh",
                    "frequency": "6.42%",
                    "count": 214
                },
                {
                    "trait_type": "Background",
                    "value": "Occult Circle",
                    "frequency": "9.93%",
                    "count": 331
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Conan",
                    "frequency": "10.89%",
                    "count": 363
                },
                {
                    "trait_type": "Armor",
                    "value": "Necromancer Bone Armor",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Headgear",
                    "value": "Plague Doctor Mask",
                    "frequency": "3.6%",
                    "count": 120
                },
                {
                    "trait_type": "Relic",
                    "value": "White Wolf Pup",
                    "frequency": "5.28%",
                    "count": 176
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #32",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/32.png",
            "dna": "b17dcf30ef4edc6830845760a804253954893990",
            "edition": 32,
            "date": 1638029488224,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Charred Wand and Fireball",
                    "frequency": "4.11%",
                    "count": 137
                },
                {
                    "trait_type": "Background",
                    "value": "Cursed Graveyard",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Scarred Lord",
                    "frequency": "10.2%",
                    "count": 340
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "None",
                    "frequency": "20.94%",
                    "count": 698
                },
                {
                    "trait_type": "Relic",
                    "value": "Flying Cosmic Spawn",
                    "frequency": "6.12%",
                    "count": 204
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #1137",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/1137.png",
            "dna": "f771ed8d222cb2a3b84d48a790a7f0a9de5111b4",
            "edition": 1137,
            "date": 1638029551539,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Sorcerer",
                    "frequency": "9.09%",
                    "count": 303
                },
                {
                    "trait_type": "Weapon",
                    "value": "Cross Bow and Concoction",
                    "frequency": "8.13%",
                    "count": 271
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Conan",
                    "frequency": "10.89%",
                    "count": 363
                },
                {
                    "trait_type": "Armor",
                    "value": "Sorcerer Robe",
                    "frequency": "9.09%",
                    "count": 303
                },
                {
                    "trait_type": "Headgear",
                    "value": "Void Gazer",
                    "frequency": "4.02%",
                    "count": 134
                },
                {
                    "trait_type": "Relic",
                    "value": "Black Wolf Pup",
                    "frequency": "6.12%",
                    "count": 204
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #116",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/116.png",
            "dna": "424d5f310807f3f9a5036edccc4a486136fc0741",
            "edition": 116,
            "date": 1638029493087,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Sword and Shield",
                    "frequency": "12.6%",
                    "count": 420
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Skeleton",
                    "frequency": "6.18%",
                    "count": 206
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "Minstrel Hat",
                    "frequency": "6.99%",
                    "count": 233
                },
                {
                    "trait_type": "Relic",
                    "value": "Blue Dragon Hatchling",
                    "frequency": "8.1%",
                    "count": 270
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #100",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/100.png",
            "dna": "158b941ec53777a40c69a00579baf1b14eae787c",
            "edition": 100,
            "date": 1638029492174,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Necromancer",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Weapon",
                    "value": "Elemental Staff and Grimoire",
                    "frequency": "7.02%",
                    "count": 234
                },
                {
                    "trait_type": "Background",
                    "value": "Ruined Vale",
                    "frequency": "9.96%",
                    "count": 332
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Base Lord",
                    "frequency": "14.91%",
                    "count": 497
                },
                {
                    "trait_type": "Armor",
                    "value": "Necromancer Bone Armor",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Headgear",
                    "value": "Assassin Hood",
                    "frequency": "7.47%",
                    "count": 249
                },
                {
                    "trait_type": "Relic",
                    "value": "Glass Pipe",
                    "frequency": "7.56%",
                    "count": 252
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #1123",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/1123.png",
            "dna": "d493d8e590ad86c4853cb809d4716cb0e61dea05",
            "edition": 1123,
            "date": 1638029550766,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Eldritch Knight",
                    "frequency": "4.35%",
                    "count": 145
                },
                {
                    "trait_type": "Weapon",
                    "value": "Rapier and Harp",
                    "frequency": "5.94%",
                    "count": 198
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Desert Lord",
                    "frequency": "9.78%",
                    "count": 326
                },
                {
                    "trait_type": "Armor",
                    "value": "Eldritch Knight Mithral Chainmail",
                    "frequency": "4.35%",
                    "count": 145
                },
                {
                    "trait_type": "Headgear",
                    "value": "Jeweled Turban",
                    "frequency": "5.79%",
                    "count": 193
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #67",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/67.png",
            "dna": "137ff825d9eb00d3997bb9d20be8071e99960c4c",
            "edition": 67,
            "date": 1638029490290,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Necromancer",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Bow and Arrows",
                    "frequency": "7.83%",
                    "count": 261
                },
                {
                    "trait_type": "Background",
                    "value": "Original",
                    "frequency": "55.87%",
                    "count": 1862
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Conan",
                    "frequency": "10.89%",
                    "count": 363
                },
                {
                    "trait_type": "Armor",
                    "value": "Necromancer Bone Armor",
                    "frequency": "5.73%",
                    "count": 191
                },
                {
                    "trait_type": "Headgear",
                    "value": "Green Hood",
                    "frequency": "6.99%",
                    "count": 233
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #68",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/68.png",
            "dna": "842eefd9f014ba1f7d4534fa9377735ef4a0dbf0",
            "edition": 68,
            "date": 1638029490351,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Bow and Arrows",
                    "frequency": "7.83%",
                    "count": 261
                },
                {
                    "trait_type": "Background",
                    "value": "Occult Circle",
                    "frequency": "9.93%",
                    "count": 331
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Conan",
                    "frequency": "10.89%",
                    "count": 363
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "Tombhead Mutation",
                    "frequency": "3.45%",
                    "count": 115
                },
                {
                    "trait_type": "Relic",
                    "value": "Black Wolf Pup",
                    "frequency": "6.12%",
                    "count": 204
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        },
        {
            "name": "Fantom Lords #1765",
            "description": "An epic collection of 3333 randomly generated Fantom Lords stored on the Fantom Blockchain",
            "image": "ipfs://QmcCEMmCrQzc8XTtJ4WAAXRvgFKPUULJxzG8GNA3J47NKc/1765.png",
            "dna": "f2469c1af887fc6ea451f9883b251162804bcf65",
            "edition": 1765,
            "date": 1638029586765,
            "attributes": [
                {
                    "trait_type": "Class",
                    "value": "Paladin",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Weapon",
                    "value": "Long Sword and Shield",
                    "frequency": "12.6%",
                    "count": 420
                },
                {
                    "trait_type": "Background",
                    "value": "Occult Circle",
                    "frequency": "9.93%",
                    "count": 331
                },
                {
                    "trait_type": "Ancestry",
                    "value": "Base Lord",
                    "frequency": "14.91%",
                    "count": 497
                },
                {
                    "trait_type": "Armor",
                    "value": "Paladin Plate Armor",
                    "frequency": "7.59%",
                    "count": 253
                },
                {
                    "trait_type": "Headgear",
                    "value": "Void Gazer",
                    "frequency": "4.02%",
                    "count": 134
                },
                {
                    "trait_type": "Relic",
                    "value": "None",
                    "frequency": "28.35%",
                    "count": 945
                }
            ],
            "compiler": "Lord of Stuttering x HashLips Art Engine"
        }
    ]

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

    const checkArmy = () => {
        !ARMY_CHECKED;
        console.log(ARMY_CHECKED);
    }


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
                        <s.TextDescription
                            style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                        >
                            Lorem ipsum
                        </s.TextDescription>
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
                            {!ARMY_CHECKED ? (
                                <>
                                <s.TextDescription
                                style={{
                                    textAlign: 'center',
                                    color: 'var(--accent-text)',
                                }}
                            >
                                premi il bottone scopri la tua army
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
                                        console.log(ARMY_CHECKED);
                                        checkArmy();
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
                                <s.TextDescription
                                    style={{
                                        textAlign: 'center',
                                        color: 'var(--accent-text)',
                                    }}
                                >
                                    TITOLO
                                </s.TextDescription>
                                <s.Container ai={'center'} jc={'center'} fd={'row'}>

                                <ul>
                                    {this.TOKENS_ARRAY.map((item,index)=>{
                                        return <li key={index}>{item.name} <img src={(item.image).replace('ipfs://', 'https://ipfs.io/ipfs/')}></img></li>
                                    })}
                                </ul>
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

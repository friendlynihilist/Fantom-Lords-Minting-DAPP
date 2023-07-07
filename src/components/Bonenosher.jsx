import React, { useEffect, useState, useRef, Component } from 'react';
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

class Bonenosher extends Component () {

    componentDidMount () {
        const script = document.createElement("script");
        script.src = "/TheBonenosher/the_bonenosher.js";
        script.async = true;
        document.body.appendChild(script);
    }

    render() {
        return (
            <>
                <div class="gm4html5_div_class" id="gm4html5_div_id">
                    <canvas id="canvas" width="1366" height="768" style={{ position: "absolute", top: "50%", left: "50%", bottom: "-50%", right: "-50%", transform: "translate(-50%, -50%)" }}>
                        <p>Your browser doesn't support HTML5 canvas.</p>
                    </canvas>
                </div>
            </>
        );
    };
}

export default Bonenosher;
import React, { useEffect, useState, useRef } from 'react';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlay, faUser } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import {
    Container,
    Row,
    Col,
    FormCheck,
    InputGroup,
    FormControl,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const iconStyle = {
    // fontFamily: 'sans-serif',
    // textAlign: 'center',

    color: '#f5f5f5',
    filter: 'drop-shadow(2px 4px #6b33ee)',
};

const disabledButton = {
    cursor: 'not-allowed',
    pointerEvents: 'none',
};

const displayNone = {
    display: 'none',
};

// fontawesome.library.add(faCheckSquare, faCoffee);

let actualDate = new Date();
let mintDate = new Date('2021-11-25T23:30:00Z');
let actualYear = actualDate.getFullYear();

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

function Footer() {
    return (
       
            <s.Container flex={1} jc={'center'}
            ai={'center'}>
                <footer class="py-5 bg-dark fixed-bottom" flex={1} jc={'center'}
                                ai={'center'}>
                    <div class="container" flex={1} jc={'center'}
                                ai={'center'}>
                        <ResponsiveWrapper flex={1} style={{ padding: 40, width: '28%' }}>
                            <s.Container
                                flex={1}
                                jc={'center'}
                                ai={'center'}
                                style={{ paddingBottom: 20 }}
                            >
                                <a
                                    href={'https://discord.gg/R8HvcKAdhB'}
                                    target={'_blank'}
                                    style={iconStyle}
                                >
                                    <FontAwesomeIcon
                                        icon={['fab', 'discord']}
                                        size="3x"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </a>
                            </s.Container>
                            <s.Container
                                flex={1}
                                jc={'center'}
                                ai={'center'}
                                style={{ paddingBottom: 20 }}
                            >
                                <a
                                    href={'https://twitter.com/ENRINFT'}
                                    target={'_blank'}
                                    style={iconStyle}
                                >
                                    <FontAwesomeIcon
                                        icon={['fab', 'twitter']}
                                        size="3x"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </a>
                            </s.Container>
                        </ResponsiveWrapper>
                        <s.SpacerXSmall />
                        <ResponsiveWrapper
                            flex={1}
                            style={{ paddingBottom: 10, width: '100%' }}
                        >
                            <s.Container flex={1} jc={'center'} ai={'center'}>
                                <s.TextDescription
                                    style={{
                                        textAlign: 'center',
                                        color: 'var(--primary-text)',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Enri's Fantom Lords © {actualYear}
                                </s.TextDescription>
                                <s.SpacerXSmall />
                                <s.TextDescription
                                    style={{
                                        textAlign: 'center',
                                        color: 'var(--primary-text)',
                                    }}
                                >
                                    developed &amp; designed by 🧙 for 🧙 with ❤️
                                    <br />
                                    tune by{' '}
                                    <a href="#" style={{ color: 'red' }}>
                                        stray
                                    </a>
                                </s.TextDescription>
                            </s.Container>
                        </ResponsiveWrapper>
                    </div>
                </footer>
            </s.Container>
    
    );
}

export default Footer;
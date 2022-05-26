import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import Web3 from 'web3';
import {
  Nav,
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-h5-audio-player/lib/styles.css';
import tune from '../assets/ascension.mp3';
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

function Pyre() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [selectingLord, setSelectingLord] = useState(false);
  const [selectingArtifact, setSelectingArtifact] = useState(false);
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
  const [artifacts, setArtifacts] = useState(null);
  const [mintedToken, setMintedToken] = useState(false);
  const [mintedAscendedLord, setMintedAscendedLord] = useState(null);
  const [ascendedLords, setAscendedLords] = useState(null);
  const [selectedLordForBurning, setSelectedLordForBurning] = useState(null);
  const [selectedArtifactForBurning, setSelectedArtifactForBurning] =
    useState(null);
  const [isLordApproved, setIsLordApproved] = useState(null);
  const [isArtifactApproved, setIsArtifactApproved] = useState(null);
  const [isApprovingAscension, setIsApprovingAscension] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [ownedXRLC, setOwnedXRLC] = useState(false);
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

  function AscensionModalDismissible() {
    return (
      <>
        <Modal
          show={isApprovingAscension}
          onHide={() => {
            setIsApprovingAscension(false);
          }}
          size="md"
          contentClassName="pyre-modal"
          centered
        >
          <Modal.Body>
            {selectedLordForBurning && selectedArtifactForBurning && (
              <s.Container ai={'center'} jc={'center'}>
                <s.TextDescription
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    fontSize: '1.0rem',
                  }}
                >
                  You're going to burn your{' '}
                  <span style={{ color: 'var(--secondary)' }}>
                    {selectedLordForBurning.name}
                  </span>{' '}
                  and your{' '}
                  <span style={{ color: 'var(--secondary)' }}>
                    {selectedArtifactForBurning.name}
                  </span>
                  .
                  <br />
                  <br />
                  <span style={{ fontWeight: 'bold' }}>
                    THEY WILL BE LOST FOREVER AND THE PROCESS IS IRREVERSIBLE.
                  </span>
                  <br />
                  <br />
                  But with greater risks come greater rewards...
                  <br />
                  <br />
                  Do you still want to continue?
                </s.TextDescription>
                <Row ai={'center'} jc={'center'} style={{ paddingTop: '10px' }}>
                  <Col style={{ paddingBottom: '10px' }}>
                    <StyledButton
                      onClick={() => {
                        setIsApprovingAscension(false);
                      }}
                      style={{
                        fontSize: '1rem',
                        // marginBottom: '30px',
                        // backgroundColor: '#1a192a',
                      }}
                    >
                      TURN BACK
                    </StyledButton>
                  </Col>
                  <Col>
                    <StyledButton
                      onClick={(e) => {
                        // startTrack();
                        e.preventDefault();
                        // console.log('approvati');
                        setIsApprovingAscension(false);
                        ascendLord(
                          selectedLordForBurning.id,
                          selectedArtifactForBurning.id
                        );
                        // getData();
                      }}
                      style={{
                        fontSize: '1rem',
                        // marginBottom: '30px',
                        // backgroundColor: '#1a192a',
                      }}
                    >
                      YES, ASCEND!
                    </StyledButton>
                  </Col>
                </Row>
              </s.Container>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }

  function NewLordModalDismissible() {
    return (
      <>
        <Modal
          show={mintedToken}
          onHide={() => {
            setMintedToken(false);
          }}
          size="md"
          contentClassName="pyre-modal"
          centered
        >
          <Modal.Body>
            {mintedToken && (
              <>
                <s.Container flex={1} ai={'center'} jc={'center'}>
                  <StyledImg
                    src={mintedToken.image}
                    style={{ width: '300px', height: '300px' }}
                  />
                </s.Container>
                <s.TextDescription
                  style={{
                    textAlign: 'center',
                    color: 'var(--accent-text)',
                    fontSize: '1rem',
                  }}
                >
                  {mintedToken.name} emerged from the flames...
                </s.TextDescription>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }

  function LordModalDismissible() {
    // const [show, setShow] = useState(true);

    // qui andranno tutte le chiamate per la collezione

    return (
      <>
        <s.Container
          ai={'center'}
          jc={'center'}
          style={{
            border: '2px inset #f7c33d',
            // borderRadius: '10px',
            // padding: '30px',
            width: '302px',
            height: '302px',
            marginBottom: '30px',
            backgroundColor: '#1a192a',
            cursor: 'pointer',
          }}
          image={'/config/images/fierychasm.png'}
          onClick={(e) => {
            e.preventDefault();
            setSelectingLord(true);
            listLordsOfOwner(blockchain.account);
          }}
        >
          {selectedLordForBurning && (
            <StyledImg
              alt={'Selected Fantom Lord'}
              src={selectedLordForBurning.uri}
              style={{ imageRendering: 'pixelated', maxWidth: '300px' }}
            />
          )}
          {!selectedLordForBurning && (
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
                fontSize: '1.2rem',
              }}
            >
              Insert Lord
            </s.TextDescription>
          )}
        </s.Container>
        {selectedLordForBurning && (
          <s.Container
            ai={'center'}
            jc={'center'}
            style={{
              width: '302px',
              marginBottom: '30px',
              backgroundColor: '#1a192a',
            }}
          >
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
                fontSize: '0.9rem',
                padding: '10px',
              }}
            >
              {selectedLordForBurning.name} is going through the Path of
              Flames...
            </s.TextDescription>
          </s.Container>
        )}

        {!isLordApproved && (
          <s.Container
            ai={'center'}
            jc={'center'}
            style={{
              width: '302px',
              marginBottom: '50px',
              // backgroundColor: '#1a192a',
            }}
          >
            <StyledButton
              onClick={(e) => {
                // startTrack();
                e.preventDefault();
                // console.log('approvati');
                LordsSetApprovalForAll();
                // getData();
              }}
              style={{
                fontSize: '1.2rem',
                // marginBottom: '30px',
                // backgroundColor: '#1a192a',
              }}
            >
              APPROVE LORDS
            </StyledButton>
          </s.Container>
        )}

        <Modal
          show={selectingLord}
          onHide={() => {
            setSelectingLord(false);
          }}
          // modalClassName='pyre-modal'
          // dialogClassName="pyre-modal"
          size="lg"
          contentClassName="pyre-modal"
          centered
          // dialogClassName="modal-90w"
          // aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Select a Fantom Lord
            </Modal.Title>
          </Modal.Header>
          {!lords ? (
            <>
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
                {isChecking && (
                  <Spinner animation="border" variant="primary" role="status">
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
                    You don't seem to have any Lord with you.
                    <br />
                    Maybe they're all on a quest in the Stronghold...
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
                      <Col key={`maincol-${index}`}>
                        <Card
                          key={`maincard-${index}`}
                          style={{
                            width: 'auto',
                            height: '100%',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-dark)',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            updateLordForBurning(
                              item.edition,
                              item.name,
                              item.image.replace(
                                'ipfs://',
                                'https://gateway.pinata.cloud/ipfs/'
                              )
                            );
                            setSelectingLord(false);
                          }}
                        >
                          <Card.Img
                            key={`maincardimg-${index}`}
                            variant="top"
                            src={item.image.replace(
                              'ipfs://',
                              'https://gateway.pinata.cloud/ipfs/'
                            )}
                          />
                          <Card.Body key={`maincardbody-${index}`}>
                            <Card.Title
                              key={`maincardtitle-${index}`}
                              style={{
                                // borderBottom: '1px solid #fff',
                                // paddingBottom: '5px',
                                fontSize: '0.8rem',
                              }}
                            >
                              {item.name}
                            </Card.Title>
                            {/* <Card.Text>
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
        </Modal>
      </>
    );
  }

  function ArtifactModalDismissible() {
    // const [show, setShow] = useState(true);

    // qui andranno tutte le chiamate per la collezione

    return (
      <>
        <s.Container
          ai={'center'}
          jc={'center'}
          style={{
            border: '2px inset #f7c33d',
            // borderRadius: '10px',
            // padding: '30px',
            width: '302px',
            height: '302px',
            marginBottom: '30px',
            backgroundColor: '#1a192a',
            cursor: 'pointer',
          }}
          image={'/config/images/fierychasm.png'}
          onClick={(e) => {
            e.preventDefault();
            setSelectingArtifact(true);
            listArtifactsOfOwner(blockchain.account);
          }}
        >
          {selectedArtifactForBurning && (
            <StyledImg
              alt={'Selected Fantom Artifact'}
              src={selectedArtifactForBurning.uri}
              style={{ imageRendering: 'pixelated', maxWidth: '300px' }}
            />
          )}
          {!selectedArtifactForBurning && (
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
                fontSize: '1.2rem',
              }}
            >
              Insert Artifact
            </s.TextDescription>
          )}
        </s.Container>
        {selectedArtifactForBurning && (
          <s.Container
            ai={'center'}
            jc={'center'}
            style={{
              width: '302px',
              marginBottom: '30px',
              backgroundColor: '#1a192a',
            }}
          >
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--accent-text)',
                fontSize: '0.9rem',
                padding: '10px',
              }}
            >
              {selectedArtifactForBurning.name} will return to ashes...
            </s.TextDescription>
          </s.Container>
        )}

        {!isArtifactApproved && (
          <s.Container
            ai={'center'}
            jc={'center'}
            style={{
              width: '302px',
              marginBottom: '50px',
              // backgroundColor: '#1a192a',
            }}
          >
            <StyledButton
              onClick={(e) => {
                // startTrack();
                e.preventDefault();
                console.log('approvati');
                // dispatch(connect());
                ArtifactsSetApprovalForAll();
              }}
              style={{
                fontSize: '1.2rem',
                // marginBottom: '30px',
                // backgroundColor: '#1a192a',
              }}
            >
              APPROVE ARTIFACTS
            </StyledButton>
          </s.Container>
        )}

        <Modal
          show={selectingArtifact}
          onHide={() => {
            setSelectingArtifact(false);
          }}
          // modalClassName='pyre-modal'
          // dialogClassName="pyre-modal"
          size="lg"
          contentClassName="pyre-modal"
          centered
          // dialogClassName="modal-90w"
          // aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Select a Fantom Artifact
            </Modal.Title>
          </Modal.Header>
          {!artifacts ? (
            <>
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
                {isChecking && (
                  <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </s.Container>

              <s.SpacerSmall />
            </>
          ) : (
            <>
              {!artifacts.length ? (
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
                    The Ashsmith could help you...
                  </s.TextDescription>
                </s.Container>
              ) : (
                <Row
                  xs={1}
                  md={2}
                  lg={artifacts.length > 1 ? 4 : ''}
                  className="g-4"
                >
                  {artifacts.map((item, index) => {
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
                            cursor: 'pointer',
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            updateArtifactForBurning(
                              item.edition,
                              item.name,
                              item.image.replace(
                                'ipfs://',
                                'https://gateway.pinata.cloud/ipfs/'
                              )
                            );
                            setSelectingArtifact(false);
                          }}
                        >
                          <Card.Img
                            key={`maincardimg-${index}`}
                            variant="top"
                            src={item.image.replace(
                              'ipfs://',
                              'https://gateway.pinata.cloud/ipfs/'
                            )}
                          />
                          <Card.Body key={`maincardbody-${index}`}>
                            <Card.Title
                              key={`maincardtitle-${index}`}
                              style={{
                                // borderBottom: '1px solid #fff',
                                // paddingBottom: '5px',
                                fontSize: '0.8rem',
                              }}
                            >
                              {item.name}
                            </Card.Title>
                            {/* <Card.Text>
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
        </Modal>
      </>
    );
  }

  const updateLordForBurning = async (_id, name, uri) => {
    const lordForBurning = {
      id: _id,
      uri: uri,
      name: name,
    };
    console.log(lordForBurning);
    setSelectedLordForBurning(lordForBurning);
  };

  const updateArtifactForBurning = async (_id, name, uri) => {
    const artifactForBurning = {
      id: _id,
      name: name,
      uri: uri,
    };
    console.log(artifactForBurning);
    setSelectedArtifactForBurning(artifactForBurning);
  };

  async function listLordsOfOwner(address) {
    // SETSTATE SPINNER TRUE
    setIsChecking(true);

    const abiResponse = await fetch('/config/abi_ftl.json', {
      //abi_ftl1.json
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const LORDS_ABI = await abiResponse.json();

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const lordsContract = new web3.eth.Contract(
      LORDS_ABI,
      '0xfee8077c909d956E9036c2d2999723931CeFE548'.toLowerCase()
    );

    const balance = await lordsContract.methods
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
            const getTokenId = await lordsContract.methods
              .tokenOfOwnerByIndex(address.toLowerCase(), id)
              .call();
            const tokenUri = await lordsContract.methods
              .tokenURI(getTokenId)
              .call();
            const response = await fetch(
              tokenUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
            );
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

  async function listArtifactsOfOwner(address) {
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
            const response = await fetch(tokenUri).catch((error) => {
              console.error('Error:', error);
            });
            let jsonifyResp = await response.json();
            jsonifyResp.edition = getTokenId;
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
    setArtifacts(tokensArray);
    console.log(tokensArray);
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

  const checkLordsApproval = async () => {
    const abiResponse = await fetch('/config/abi_ftl.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const LordsAbi = await abiResponse.json();
    const LordsAddress =
      '0xfee8077c909d956E9036c2d2999723931CeFE548'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const LordsContract = new web3.eth.Contract(LordsAbi, LordsAddress);

    const ascensionAddress =
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase();

    const approval = await LordsContract.methods
      .isApprovedForAll(blockchain.account.toLowerCase(), ascensionAddress)
      .call();

    console.log(approval);

    // let confirmApprove = true;
    // if (approval == 0) {
    //   confirmApprove = false;
    // }

    setIsLordApproved(approval);
  };

  const checkArtifactsApproval = async () => {
    const abiResponse = await fetch('/config/abi_artifacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const ArtifactsAbi = await abiResponse.json();
    const ArtifactsAddress =
      '0xC021315E4aF3C6cbD2C96E5F7C67d0A4c2F8FE11'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const ArtifactsContract = new web3.eth.Contract(
      ArtifactsAbi,
      ArtifactsAddress
    );

    const ascensionAddress =
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase();

    const approval = await ArtifactsContract.methods
      .isApprovedForAll(blockchain.account.toLowerCase(), ascensionAddress)
      .call();

    console.log(approval);

    // let confirmApprove = true;
    // if (approval == 0) {
    //   confirmApprove = false;
    // }

    setIsArtifactApproved(approval);
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
      .send({ from: blockchain.account.toLowerCase() });
    setApproval(true);
    // testPoolInfo();
    setIsDoingTransaction(false);
  };

  const LordsSetApprovalForAll = async () => {
    setFeedback(`You're approving your Lords...`);
    setIsDoingTransaction(true);
    const abiResponse = await fetch('/config/abi_ftl.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const LordsAbi = await abiResponse.json();
    const LordsAddress =
      '0xfee8077c909d956E9036c2d2999723931CeFE548'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const LordsContract = new web3.eth.Contract(LordsAbi, LordsAddress);

    const ascensionAddress =
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase();

    await LordsContract.methods.setApprovalForAll(ascensionAddress, true).send({
      from: blockchain.account.toLowerCase(),
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
      type: '0x2',
    });
    setIsLordApproved(true);
    // testPoolInfo();
    setIsDoingTransaction(false);
  };

  const ArtifactsSetApprovalForAll = async () => {
    setFeedback(`You're approving your Artifacts...`);
    setIsDoingTransaction(true);
    const abiResponse = await fetch('/config/abi_ftl.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const ArtifactsAbi = await abiResponse.json();
    const ArtifactsAddress =
      '0xC021315E4aF3C6cbD2C96E5F7C67d0A4c2F8FE11'.toLowerCase();
    // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const ArtifactsContract = new web3.eth.Contract(
      ArtifactsAbi,
      ArtifactsAddress
    );

    const ascensionAddress =
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase();

    await ArtifactsContract.methods
      .setApprovalForAll(ascensionAddress, true)
      .send({
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      });
    setIsArtifactApproved(true);
    // testPoolInfo();
    setIsDoingTransaction(false);
  };

  const listAscendedLordsOfOwner = async (address) => {
    // SETSTATE SPINNER TRUE
    setIsChecking(true);

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
            tokensArray.push(jsonifyResp);
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

  const ascendLord = async (_ftlTokenId, _artifactTokenId) => {
    // added async

    // ADD DEDICATED ABI AND CONFIGS
    const abiResponse = await fetch('/config/abi_ascension.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const ascensionAbi = await abiResponse.json();
    const ascensionAddress =
      '0x6139b9C548FBd1C50d2768f3464D89c8744aB5f2'.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const ascensionContract = new web3.eth.Contract(
      ascensionAbi,
      ascensionAddress
    );
    //

    // EVENTS

    ascensionContract.events
      .allEvents() // non tutti ma solo 1
      .on('data', async function (event) {
        console.log(event.returnValues); // controllare forse serve un solo event
        let mintedTokenId;
        if (event.returnValues[1].toLowerCase() === blockchain.account.toLowerCase()) {
          mintedTokenId = event.returnValues.tokenId;
        }
        // const mintedTokenId = await event.returnValues.tokenId;
        const mintedTokenUri = await ascensionContract.methods
          .tokenURI(parseInt(mintedTokenId))
          .call();
        await fetch(
          mintedTokenUri,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log('Success:', result.image);
            setMintedToken({
              name: result.name,
              image: result.image.replace(
                'ipfs://',
                'https://gateway.pinata.cloud/ipfs/'
              ),
            });
            console.log(mintedToken);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        // Do something here
      })
      .on('error', console.error);
    //

    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);
    setFeedback(`Ascending your Fantom Lord...`);
    setClaimingNft(true);
    // console.log(ascensionContract.address);
    ascensionContract.methods
      .ascendLord(parseInt(_ftlTokenId), parseInt(_artifactTokenId))
      .send({
        // gasLimit: String(totalGasLimit),
        to: ascensionAddress,
        from: blockchain.account,
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Something went wrong. Please, try again later.');
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Engulfed in flames, a new Lord appears!`);
        setClaimingNft(false);
        // listAscendedLordsOfOwner(blockchain.account);
        // setMintedAscendedLord(true);
        setSelectedLordForBurning(null); //
        setSelectedArtifactForBurning(null); //
        dispatch(fetchData(blockchain.account)); // forse bisogna aspettare prima di ricaricare
      });
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
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
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
              src={'/config/images/pyre_test.webp'}
              style={{ imageRendering: 'pixelated', maxWidth: '520px' }}
            />

            <s.SpacerMedium />

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
                      'A great pyre lights up the room you are in.',
                      'The ancestral crackle of flames lures you closer...',
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
                          'It looks like you can burn something on the pyre...',
                          '...as a votive offering.',
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
                          // dispatch(connect());
                          updateData();
                          checkLordsApproval();
                          checkArtifactsApproval();
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
                        text="Are you willing to burn both a Lord and an Artifact in order to ascend?"
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
                      <Row>
                        <Col>
                          <LordModalDismissible />
                        </Col>
                        <Col>
                          <ArtifactModalDismissible />
                        </Col>
                      </Row>
                    </s.Container>
                    <AscensionModalDismissible />
                    <NewLordModalDismissible />
                    {/* {ascendedLords && mintedAscendedLord && (
                      <MintedModalDismissible />
                    )} */}
                    {isArtifactApproved &&
                      isLordApproved &&
                      selectedLordForBurning &&
                      selectedArtifactForBurning && (
                        <StyledButton
                          onClick={(e) => {
                            // startTrack();
                            e.preventDefault();
                            setIsApprovingAscension(true);
                            // console.log('approvati');
                            // LordsSetApprovalForAll();
                            // getData();
                          }}
                          style={{
                            fontSize: '1.2rem',
                            // marginBottom: '30px',
                            // backgroundColor: '#1a192a',
                          }}
                        >
                          ASCEND
                        </StyledButton>
                      )}
                    {(isArtifactApproved &&
                      isLordApproved &&
                      !selectedLordForBurning) ||
                      (!selectedArtifactForBurning && (
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                            cursor: 'pointer',
                            // fontSize: '1.4rem',
                          }}
                        >
                          You have to select both a Lord and an Artifact in
                          order to Ascend...
                        </s.TextDescription>
                      ))}
                  </>
                )}

                <s.SpacerLarge />
                {!ascendedLords ? (
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
                            listAscendedLordsOfOwner(blockchain.account);
                            // getData();
                          }}
                        >
                          VIEW ASCENDED LORDS
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
                      <Row
                        xs={1}
                        md={2}
                        lg={ascendedLords.length > 1 ? 5 : ''}
                        className="g-4"
                      >
                        {ascendedLords.map((item, index) => {
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
                                    'https://gateway.pinata.cloud/ipfs/'
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

export default Pyre;

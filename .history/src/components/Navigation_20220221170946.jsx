import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

const iconStyle = {
  // fontFamily: 'sans-serif',
  // textAlign: 'center',

  color: '#f5f5f5',
  filter: 'drop-shadow(2px 4px #6b33ee)',
};

function Navigation() {
  return (
    <Navbar
      expand="lg"
      sticky="top"
      variant="dark"
      style={{
        padding: 34,
        // color: 'white !important',
        backgroundColor: 'var(--primary-dark)',
      }}
    >
      <Container>
        <Navbar.Brand href="/">
          <DivTitle>Fantom Lords</DivTitle>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-start">
          <Nav>
            <NavLink className="nav-link" to="/">
              Home
              <span className="sr-only">(current)</span>
            </NavLink>
            <NavLink className="nav-link" to="/army">
              Army
            </NavLink>
            <NavLink className="nav-link" to="/army">
              Lore
            </NavLink>
            <NavLink className="nav-link" to="/army">
              Coming soon...
            </NavLink>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Button variant="link">
              <a
                href={'https://discord.gg/R8HvcKAdhB'}
                target={'_blank'}
                style={iconStyle}
              >
                <FontAwesomeIcon
                  icon={['fab', 'discord']}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                />
              </a>
              </Button>
              <Button variant="link">
              <a
                href={'https://twitter.com/ENRINFT'}
                target={'_blank'}
                style={iconStyle}
              >
                <FontAwesomeIcon
                  icon={['fab', 'twitter']}
                  size="2x"
                  style={{ cursor: 'pointer' }}
                />
              </a>
              </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    //     <div className="navigation">
    //     <nav className="navbar navbar-expand navbar-dark"  style={{ padding: 34, backgroundColor: 'var(--primary-dark)' }}>
    //         <div className="container">
    //             <NavLink className="navbar-brand" to="/">
    //                 <DivTitle>Fantom Lords</DivTitle>
    //             </NavLink>
    //             <div>
    //                 <ul className="navbar-nav ml-auto">
    //                     <li className="nav-item">
    // <NavLink className="nav-link" to="/">
    //     Home
    //     <span className="sr-only">(current)</span>
    // </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/army">
    //                             Army
    //                         </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/stronghold">
    //                             Stronghold
    //                         </NavLink>
    //                     </li>
    //                     <li className="nav-item">
    //                         <NavLink className="nav-link" to="/lore">
    //                             Lore
    //                         </NavLink>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </nav>
    // </div>
  );
}

export default Navigation;

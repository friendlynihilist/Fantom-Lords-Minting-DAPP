import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';

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

function Navigation() {
  return (
    <Navbar
      expand="lg"
      style={{
        padding: 34,
        color: 'white',
        backgroundColor: 'var(--primary-dark)',
      }}
    >
      <Container>
        <Navbar.Brand href="/">
          <DivTitle>Fantom Lords</DivTitle>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <NavLink className="nav-link" to="/">
              Home
              <span className="sr-only">(current)</span>
            </NavLink>
            <NavLink className="nav-link" to="/army">
              Army
            </NavLink>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown> */}
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

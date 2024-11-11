import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";

function Header({ loggedInUser, handleLogout }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        {/* Display Username on the left */}
        <Navbar.Brand>{'Welcome ' + loggedInUser}</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {/* Right-aligned options */}
          <Nav className="navbar-nav ml-auto">
          <Navbar.Brand><Nav.Link href="#">Edit Profile</Nav.Link></Navbar.Brand>
          <Navbar.Brand><Nav.Link onClick={handleLogout}>Logout</Nav.Link></Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

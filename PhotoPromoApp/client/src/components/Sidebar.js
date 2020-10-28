import React, { useState, useContext, useEffect } from 'react';
import { NavLink as RRNavLink } from "react-router-dom";
import {

  Navbar,

  Nav,

  Accordion
} from 'react-bootstrap';
import { UserProfileContext } from "../providers/UserProfileProvider";

export default function Sidebar() {
  const { isLoggedIn, logout, activeUser, userTypeId } = useContext(UserProfileContext);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={selectedKey => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
        <div>
          <Navbar bg="light" expand="md" >
            <Navbar.Brand tag={RRNavLink} to="/">Tabloid</Navbar.Brand>
            <Navbar.Toggle onClick={toggle} />
            <Accordion >
              {/* <Nav className="mr-auto" navbar> */}
              { /* When isLoggedIn === true, we will render the Home link */}

              {!isLoggedIn &&
                <>
                  <Nav.Item>
                    <Nav.Link tag={RRNavLink} href="/login">Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link tag={RRNavLink} href="/register">Register</Nav.Link>
                  </Nav.Item>
                </>
              }
              {
                isLoggedIn &&


                <>
                  <Nav.Item>
                    <Nav.Link href="/image/add">Add Image</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                  </Nav.Item>
                </>
              }
              {/* </Nav> */}
            </Accordion>
          </Navbar>
        </div>
      </Nav>

    </>
  );

}
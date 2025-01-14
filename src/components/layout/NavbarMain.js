import Link from 'next/link'
import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button,
    Dropdown
} from 'reactstrap';
import Image from 'next/image';
import SearchBar from '../SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NavbarMain = ({ user, handleLogout, handleToggleSidebar, toggleModal, isSmallScreen, sidebarIsOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const dropdownToggle = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <Navbar className="topNavbar py-0 px-0" expand="md">
            <div className='navbar-brand d-flex align-items-center ml-0'>
                <span type="button" className='me-3 d-lg-none d-md-none d-sm-block' onClick={handleToggleSidebar}>
                    {sidebarIsOpen ?
                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" />
                        :
                        <FontAwesomeIcon icon={faCircleArrowRight} size="lg" />
                    }
                </span>
                <Link href={"/"}>
                    <Image
                        src="/assets/images/logo.png"
                        alt="Logo"
                        width={150}
                        height={40}
                    />
                </Link>
            </div>
            {isSmallScreen ? (
                <Nav className="ms-auto" navbar>
                    <NavItem>
                        {user && user.uid ? (
                            <Dropdown isOpen={isDropdownOpen} toggle={dropdownToggle}>
                                <DropdownToggle id="dropdown-custom" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                                    <Image
                                        src="/assets/images/DummyUser.svg"
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="profile-image me-2"
                                    />
                                    <Image
                                        src="/assets/images/DownVector.png"
                                        alt="Dropdown"
                                        width={15}
                                        height={10}
                                        className="dropdown-icon"
                                    />
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <>
                                <Button
                                    color="warning"
                                    outline
                                    className='me-3'
                                    onClick={() => toggleModal("login")}
                                >
                                    Login
                                </Button>
                            </>
                        )}
                    </NavItem>
                </Nav>
            ) : (
                <>
                    <NavbarToggler onClick={toggle}>
                        <FontAwesomeIcon icon={faBars} />
                    </NavbarToggler>
                    <Collapse isOpen={isOpen} navbar>

                        <SearchBar parent={"navbar"} />

                        <Nav className="ms-auto" navbar>
                            <NavItem>
                                {user && user.uid ? (
                                    <Dropdown isOpen={isDropdownOpen} toggle={dropdownToggle}>
                                        <DropdownToggle id="dropdown-custom" style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                                            <Image
                                                src="/assets/images/DummyUser.svg"
                                                alt="Profile"
                                                width={40}
                                                height={40}
                                                className="profile-image me-2"
                                            />
                                            <Image
                                                src="/assets/images/DownVector.png"
                                                alt="Dropdown"
                                                width={15}
                                                height={10}
                                                className="dropdown-icon"
                                            />
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                ) : (
                                    <>
                                        <Button
                                            color="warning"
                                            outline
                                            className='me-3'
                                            onClick={() => toggleModal("login")}
                                        >
                                            Login
                                        </Button>
                                        <Button color="warning" onClick={() => toggleModal("signUp")}>
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </NavItem>
                        </Nav>
                    </Collapse>
                </>
            )}
        </Navbar>
    )
}

export default NavbarMain
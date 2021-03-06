import "./DashboardNavBar.css";
import { useState, useEffect, useContext } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import AutoSuggest from "react-autosuggest";
import axios from "axios";
import logo from "./../../assets/crypto-logo.png";
import AuthContext from '../../store/AuthContext';

function DashboardNavBar(props) {
    const [cryptos, setCryptos] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");

    const ctx = useContext(AuthContext);

    async function fetchAll() {
        try {
            const response = await axios.get("https://api.coincap.io/v2/assets");
            return response.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    useEffect(() => {
        fetchAll().then(result => {
            if (result)
                setCryptos(result.data);
        })
    }, [])

    function getSuggestions(value) {
        return cryptos.filter(crypto => crypto.name.toLowerCase().includes(value.toLowerCase()));
    }

    function logoutHandler() {
        ctx.logout();
    }

    return (
        <Navbar collapseOnSelect bg="light" variant="light" expand="lg">
            <Link to="/dashboard"><Navbar.Brand><img src={logo} alt="logo" height="30" width="auto" /></Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <AutoSuggest
                suggestions={suggestions}
                onSuggestionsClearRequested={() => setSuggestions([])}
                onSuggestionsFetchRequested={({ value }) => {
                    setSearch(value);
                    setSuggestions(getSuggestions(value));
                }}
                onSuggestionSelected={(_, { suggestion }) => {
                    props.change(suggestion.id);
                    setSearch("");
                }
                }
                getSuggestionValue={suggestion => suggestion.id}
                renderSuggestion={suggestion => <span>{suggestion.name + ": " + suggestion.symbol}</span>}
                inputProps={{
                    placeholder: "Search",
                    value: search,
                    onChange: (_, { newValue, method }) => {
                        setSearch(newValue);
                    }
                }}
                className="search"
            />
            <NavDropdown title="Options" id="collapsible-nav-dropdown">
                <NavDropdown.Item><Link to="/404">Option 1</Link></NavDropdown.Item>
                <NavDropdown.Item><Link to="/404">Option 2</Link></NavDropdown.Item>
            </NavDropdown>
            <Nav.Link id="navbar-link" onClick={logoutHandler}>Log Out</Nav.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default DashboardNavBar;
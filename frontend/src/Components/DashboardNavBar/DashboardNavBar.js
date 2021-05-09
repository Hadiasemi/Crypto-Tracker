import "./DashboardNavBar.css";
import { useState, useEffect } from "react";
import { Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import AutoSuggest from "react-autosuggest";
import axios from "axios";
import logo from "./../../assets/crypto-logo.png";

function DashboardNavBar() {
    const [cryptos, setCryptos] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");

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

    return (
        <Navbar collapseOnSelect fixed="top" bg="light" variant="light" expand="lg">
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
                onSuggestionSelected={(_, { suggestionValue }) =>
                    console.log("Selected: " + suggestionValue)
                }
                getSuggestionValue={suggestion => suggestion}
                renderSuggestion={suggestion => <Link id="cryptoLink" to={"/crypto/#" + suggestion.id}><span>{suggestion.name + ": " + suggestion.symbol}</span></Link>}
                inputProps={{
                    placeholder: "Search",
                    value: search,
                    onChange: (_, { newValue, method }) => {
                        setSearch(newValue);
                    }
                }}
                className="search"
            />
            <NavDropdown title="Options" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#">Option 1</NavDropdown.Item>
                <NavDropdown.Item href="#">Option 2</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Profile" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#">Option 1</NavDropdown.Item>
                <NavDropdown.Item href="#">Option 2</NavDropdown.Item>
            </NavDropdown>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default DashboardNavBar;
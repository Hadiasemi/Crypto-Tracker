import "./SignUpLogIn.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link, Route } from "react-router-dom";
import { useState } from "react";
import logo from '../../assets/square.jpg';
import Signup from './SignUp';
import LogIn from './LogIn';

function LoginSignUp() {
    const [up, setUP] = useState({
            email: "",
            password: "",
            reEnterPass: ""
        })
    const [loginCred, setLoginCred] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("");

    //assigns username and password values to "up" variable
    function handleSignUpChange(event) {
        const { name, value } = event.target;
        if (name === "password") {
            setUP(
                { email: up["email"], password: value, reEnterPass: up["reEnterPass"] }
            )
        }
        else if (name === "repassword") {
            setUP(
                { email: up["email"], password: up["password"], reEnterPass: value }
            )
        }
        else {
            setUP(
                { email: value, password: up["password"], reEnterPass: up["reEnterPass"] }
            )
        }
        console.log(up);
    }

    
    //check if inputs are valid
    function submitSignUpForm() {
        //if not all criteria is filled out, then alert
        if ( !validateEmail(up.email) || up.password === "" || up.reEnterPass === "") {
            setError("Sign Up Credentials are invalid. Please try again.")
        }
        //else if passwords don't match, then alert 
        else if (up.password !== up.reEnterPass) {
            setError("Passwords do not match. Please re-enter passwords.");
        } else {
            clearError();
        }
        //else then no errors and add to database and redirect user to dashbaord
    }
    
    function handleLogInChange(event) {
        const {name, value} = event.target;
        if (name === "email"){
            setLoginCred({
                email: value,
                password: loginCred.password
            })
        } else if (name === "password") {
            setLoginCred({
                email: loginCred.email,
                password: value
            })
        }
    }

    function handleLogInForm() {
        console.log(loginCred.password.length);
        // Set password validation to be >= 6 characters
        if (!validateEmail(loginCred.email) || loginCred.password.length < 6){
            setError("Log In Credentials are invalid. Please try again.");
        } else {
            clearError();
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function clearError() {
        setError("");
    }

    return (
        <div id="signUpLogin">
            <Container fluid>
                <Row style={{ textAlign: "center" }} className="align-items-center justify-content-center">
                    <Col id="vr">
                        <img id="logo" src={logo} alt="logo" />
                    </Col>
                    <Col className="justify-content-center">
                        <div className="nav-buttons">
                            <Link id="loginLink" to="/login"><button className="lsButton" onClick={clearError}>Login</button></Link>
                            <Link id="signUpBtn" to="/signup"><button className="lsButton" onClick={clearError}>Sign Up</button></Link>
                        </div>
                        <Route path="/signup">
                            <Signup handleChange={handleSignUpChange} submitForm={submitSignUpForm}></Signup>
                        </Route>
                        <Route path="/login">
                            <LogIn handleChange={handleLogInChange} submitForm={handleLogInForm}></LogIn>
                        </Route>
                        {error ? <Alert style={{ margin: "5px 20%"}}variant="danger">{error}</Alert> : null}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LoginSignUp;

import axios from "axios";
import { useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Register from "../Register/Register";
import WorldIcon from '../Login/world.png'
import './login.css';

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {    
    const [error, setError] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
    
        // Check if username or password fields are empty
        if (!username || !password) {
            setError("Please enter both username and password."); // Set an error message
            return; // Exit the function early if validation fails
        }
    
        // Construct the user object if validation passes
        const user = {
            username: username,
            password: password,
        };
    
        try {
            const res = await axios.post("/users/login", user);
            setCurrentUsername(res.data.username);
            myStorage.setItem('user', res.data.username);
            setShowLogin(false);
            setError(''); // Clear any previous error on successful login
        } catch (err) {
            setError("Something went wrong. Please try again."); // Set an error message for API call failure
        }
    };
    
    const toggleForm = () => {  
        setShowRegister(prev => !prev);
    }

    return (
      <div className="loginContainer d-flex justify-content-center align-items-center">
          <div className="loginWrapper">
              {showRegister ? (
                  // Render the Register component when showRegister is true
                  <div>
                      <Register />
                  </div>
              ) : (
                  // Render the Login form when showRegister is false  color: "#4A89F3",
                  <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={WorldIcon} alt="World Map" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                {/* <h2 className="loginTitle" style={{
                    fontSize: "25px", 
                    color:"#102A43",
                    fontFamily:"inherit"}}>
                    World Map Visualizer
                </h2> */}
                </div>


                      <h3 className="loginTitle"style={{fontSize: "28px", color:"#102A43", fontFamily:"initial"}}>Welcome Back</h3> 
                      <form onSubmit={handleSubmitLogin}>
                      <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form2Example1" style={{fontSize: "16px", color: "#102A43", fontFamily:"sans-serif"}}>Username</label>
                        <input type="text" id="form2Example1" className="form-control" placeholder="Enter your Username" ref={usernameRef}
                         style={{
                            border: '1px solid #102A43',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            color: '#102A43',
                            backgroundColor: '#ffff',
                    
                        }}
                        autoFocus />
                    </div>
                    <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example2"style={{fontSize: "16px", color: "#102A43", fontFamily:"sans-serif"}}>Password</label>
                    <input 
                        type="password" 
                        id="form2Example2" 
                        className="form-control" 
                        placeholder="Enter your Password" 
                        ref={passwordRef} 
                        style={{
                            border: '1px solid #102A43',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            color: '#102A43',
                            backgroundColor: '#ffff',
                    
                        }} 
                    />
                        </div>
                    <button type="submit" className="btn btn-primary btn-block mb-4" 
                    style={{
                        // backgroundColor: "#018749", 
                        backgroundColor:"#102A43",
                        border: "none", 
                        padding: "10px 15px", 
                        borderRadius: "5px",
                        fontFamily:"sans-serif",
                        fontSize: "16px", fontWeight: "bold", 
                        cursor: "pointer"}}
                        >
                        Sign in
                        </button>
                    {error && <span style={{
                        color: "red", 
                        display: "block", 
                        textAlign: "center", 
                        marginBottom: "15px", 
                        fontFamily:"sans-serif"}}
                        >
                        Something went wrong!
                    </span>}                           
                    <div className="text-center">
                    <p style={{fontSize: "14px", textAlign: "center", marginBottom: "10px", color:"black"}}>
                    Not a member? 
                    <a href="#!" onClick={toggleForm} style={{color: "#102A43", textDecoration: "underline", fontFamily:"sans-serif", marginRight:"20px"}}>Register</a>
                    </p>
                    </div>
                </form>
                <i className="bi bi-x loginCancel" onClick={() => setShowLogin(false)}></i>
            </div>
                )}
        </div>
        </div>
    );
}

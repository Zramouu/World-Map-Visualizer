import axios from "axios";
import { useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WorldIcon from '../Login/world.png'
import '../Register/register.css'; 

export default function Register({ setShowRegister, switchToregister, onRegistrationSuccess }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
      onRegistrationSuccess(); 
    } catch (err) {
      setError(true);
    }
  };

  const toggleForm = () => {
    setShowRegister(false);
  }

  return (
    <div className="registerContainer d-flex justify-content-center align-items-center">
        <div className="registerWrapper">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={WorldIcon} alt="World Map" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
        <h3 className="registerTitle"style={{fontSize: "28px", color: "#102A43", fontFamily:"initial"}}>Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-outline mb-4">
            <label className="form-label" style={{fontSize: "16px", color: "#102A43", fontFamily:"sans-serif"}}>Username</label>
            <input autoFocus type="text" className="form-control" placeholder="Enter Username" ref={usernameRef} />
            
          </div>
          <div className="form-outline mb-4">
            <label className="form-label"style={{fontSize: "16px", color: "#102A43", fontFamily:"sans-serif"}}>Email</label>
            <input type="email" className="form-control" placeholder="Enter Email Address" ref={emailRef} />
            
          </div>
          <div className="form-outline mb-4">
            <label className="form-label" style={{fontSize: "16px", color: "#102A43", fontFamily:"sans-serif"}}>Password</label>
            <input type="password" className="form-control" placeholder="Enter Password" ref={passwordRef} />
          </div>
          <button type="submit" className="btn btn-primary btn-block mb-4"
           style={{
            backgroundColor: "#102A43", 
            border: "none", 
            padding: "10px 15px", 
            borderRadius: "5px", 
            fontSize: "16px", fontWeight: "bold", 
            fontFamily:"sans-serif",
            cursor: "pointer"}}
            >
            Register
            </button>

          {success && <span className="text-success d-block text-center mb-3" style={{fontSize: "14px", textAlign: "center", marginBottom: "10px", color:"#102A43"}}>All set! The world of maps is yours to pin.</span>}
          {error && <span className="text-danger d-block text-center mb-3" style={{
                        color: "red", 
                        display: "block", 
                        textAlign: "center", 
                        marginBottom: "15px", 
                        fontFamily:"sans-serif"}}
                        >An error occurred. Please try again.</span>}

          <div className="text-center">
          <p style={{fontSize: "14px", textAlign: "center", marginBottom: "10px", color:"black"}}>
          Already a member? 
          <a href="#!" onClick={toggleForm} style={{color: "#102A43", textDecoration: "underline", fontFamily:"sans-serif", marginRight:"5px"}}>Login</a>
          </p>
          </div>
        </form>
        <i className="bi bi-x registerCancel" onClick={() => setShowRegister(false)}></i>
      </div>
    </div>
    </div>
  );
}

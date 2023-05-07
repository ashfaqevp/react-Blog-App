import {useState , useEffect } from 'react';
import {database} from '../firebase';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { ref,  onValue, query, orderByChild, equalTo} from "firebase/database";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import logo from '../Images/logo.webp'
import {Link} from 'react-router-dom';
import { PencilSquare , Search} from 'react-bootstrap-icons/dist';

const Header = () =>{

  const [logged , setLogged] = useState(false);
  const [email , setEmail] = useState("");
  const [profile , setProfile] = useState("");
  const [search , setSearch] = useState(" ");

  useEffect (()=> {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
            setLogged(true);
            setEmail(user.email);
        } 
        else {
          setLogged(false);
        }
      });

  });



  useEffect (()=> {
    const dbRef2 = ref(database, 'users');
    const q = query(dbRef2, orderByChild("email"), equalTo(email));
    onValue(q, (snapshot)=>{
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot =>{
                setProfile(childSnapshot.val().image);
           });
       } 

        else {
            console.log("No data available");
        }
    });
},[email]);



    return(
        <div className="headers mt-0">

             <Navbar collapseOnSelect expand="lg" className="navbarBg" variant="light">
              <Container>

                <Navbar.Brand href="/">
                  <div className="logo">
                    <img src={logo}/>
                    <h2>blogi</h2>
                  </div>
                </Navbar.Brand>


                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                
                <Navbar.Collapse id="responsive-navbar-nav">

                  <Nav className="me-auto">

                    {/* <Nav.Link href="#features">Features</Nav.Link> */}
                   
                    <NavDropdown className = "navItem" title="CATEGORIES" id="collasible-nav-dropdown">
                      <NavDropdown.Item href="/post-category/Sports">Sports </NavDropdown.Item>
                      <NavDropdown.Item href="/post-category/Entertainment">Entertainment</NavDropdown.Item>
                      <NavDropdown.Item href="/post-category/Lifestyles">Lifestyles</NavDropdown.Item>
                      <NavDropdown.Item href="/post-category/Science & Technology">Science & Technologies</NavDropdown.Item>
                    </NavDropdown>

                    <form>
                      <input type="text" placeholder="Search Post.." onChange={(e) => setSearch(e.target.value)}></input>

                      <Link to={`/search-blog/${search}`}>
                        <button><Search className="search" color="white" size={18} /></button>
                      </Link>

                    </form>
                  </Nav>

                  
                 

                  <div className={logged === true ? "show" : "hidden" }>
                    <Nav>
                      <Link style={{textDecoration :"none"}} to="/newpost">

                        <div className='newBlogLink'>
                          <button>
                            <PencilSquare  color="royalblue" size={18} />
                            <p>Write</p>
                          </button>
                          
                        </div>

                      </Link>

                      <Link to="/profile">
                        <div className='profileLink'>
                          <img src={profile}></img>
                        </div>
                      </Link>
                    </Nav> 
                  </div>


                  <div className={logged === true ? "hidden" : "show" }>
                  <Nav>
                    <Link  to="/login">
                      <div className='login'>
                        <button style={{marginRight :"10px"}}>
                          Login
                        </button>

                      </div>
                    </Link>

                    <Link to="/signup">
                      <div className='login signups'>
                        <button>
                          Signup
                        </button>
                      </div>
                    </Link>

                  </Nav>

                  </div>
                
                </Navbar.Collapse>
              </Container>
            </Navbar>

            {/* className={page === currentPage ? "pageActive" : "" } */}

        </div>
    );
}

export default Header;

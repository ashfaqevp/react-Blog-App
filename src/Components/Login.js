import {useState} from 'react';

import {signInWithPopup, GoogleAuthProvider ,signInWithEmailAndPassword} from "firebase/auth";
import {auth} from '../firebase'
import { useNavigate , Link } from 'react-router-dom';
import {database} from '../firebase';
import { ref , set, onValue , orderByChild, equalTo,query } from "firebase/database";
import { v4 } from 'uuid';
import loginImg from "../Images/login.png";



const Login = () =>{

    const [email , setEmail] = useState("");
    const [pass , setPass] = useState("");

    const navigate= useNavigate();


    const handleLogin = (e) =>{
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);

            const dbRef2 = ref(database, 'users');
            const q = query(dbRef2, orderByChild("email"), equalTo(user.email));
    
            onValue(q, (snapshot)=>{
               snapshot.forEach(childSnapshot =>{
                localStorage.setItem("email" , user.email);
                localStorage.setItem("logged" , "true");
                localStorage.setItem("loggedId" ,childSnapshot.val().id );
                console.log(childSnapshot.val().id)
                navigate("/profile");
          
               });
            })   
        }) 
        .catch((error) => {
            alert('Incorrect Email or Password');
        });
   
    }





    const handleGoogleSignup = () =>{
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {

                let id =v4();
             
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(user);

                const dbRef2 = ref(database, 'users');
                const q = query(dbRef2, orderByChild("email"), equalTo(user.email));
                onValue(q, (snapshot)=>{
                    if (snapshot.exists()) {
        
                        snapshot.forEach(childSnapshot =>{
                          console.log(childSnapshot.val().id);
                          localStorage.setItem("email" , user.email);
                          localStorage.setItem("logged" , "true"); 
                          localStorage.setItem("loggedId" , childSnapshot.val().id); 
                        })
                    } 
                    else {
                        console.log("No Previouse Email  available");
        
                        set(ref(database, 'users/' + id), {
                            id: id,
                            name: user.displayName,
                            email : user.email,
                            image : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            pass :"!@##!@!#!#!$^!$^!&",
                          });

                        localStorage.setItem("email" , user.email);
                        localStorage.setItem("logged" , "true"); 
                        localStorage.setItem("loggedId" , id);   
                    }
                });

                navigate("/profile");
      
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                
                const email = error.customData.email;
               
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });

    }



    return (

        <div class="signup">

            <div className='container'>

                <div className='left'>
                    <img className="imgPrv loginImg" src={loginImg} />
                </div>


                <div className='right'>

                    <div className="top">
                        <h2 className='h2'>Login</h2>
                        <p>Doesn't have an account yet?  <Link to={`/signup`}>Sign Up</Link></p>
                    </div>

                    <div className ="mid">
                        <form  onSubmit={handleLogin}>
                            <label for="Email">Email</label>
                            <input placeholder="you@example.com" type={'email'} onChange={(e) => setEmail(e.target.value)}></input>
                           
                            <label for="Password">Password</label>
                            <input placeholder="Enter 6 character or more" type={'password'} onChange={(e) => setPass(e.target.value)}></input>
                            <br/>
                            <button>Login</button>
                        </form> 
                    </div>



                    <div className='bot'>
                        <br/><br/>
                        <div className="or" >------ or Login with ------</div>
                        <br/>
                        <button onClick={handleGoogleSignup}>Google</button>
                        
                    </div>
            
            </div>
            </div>
            </div>


    );
}

export default Login;
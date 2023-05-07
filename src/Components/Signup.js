import {useState , useRef} from 'react';
import { signInWithPopup, GoogleAuthProvider ,createUserWithEmailAndPassword} from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL }  from "firebase/storage";
import {auth, database , storage} from '../firebase'
import { ref as dbRef, set } from "firebase/database";
import { useNavigate , Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { ref ,  onValue , orderByChild, equalTo,query } from "firebase/database";
import uploadImg from "../Images/profileimg.jpg";


const Signup = () =>{

    const imgRef = useRef(null);

    const [image, setImage] = useState(null);
    const [imgPrev, setImgPrev] =useState(uploadImg);
    const [imageUrl, setImageUrl] = useState("");

    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [pass , setPass] = useState("");



    const navigate = useNavigate();

    const imageHandle = (e)=>{
        setImage(e.target.files[0])
        setImgPrev(URL.createObjectURL(e.target.files[0]) );
    }



    const handleSignUp = (e) =>{

            e.preventDefault();
            createUserWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {

                    const user = userCredential.user;
                    console.log(user);
                    console.log(user.email);
                    uploadImage();
            
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Already have an account');
            });     
    }



     const uploadImage = () =>{
        
        if (image == null){
            let url  = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            publish(url);
        }

        const strRef = storageRef(storage, `post-images/${image.name + v4()} `);
        console.log(`images/${image.name + v4()} `);
        uploadBytes(strRef, image ).then((snapshot) => {
            console.log('Uploaded image');
            getDownloadURL(snapshot.ref).then( (url) => {
                setImageUrl(url);
                publish(url);
            });
          });     
    }


    const publish = (url) =>{
        let Uid =v4();
        localStorage.setItem("email" , email);
        localStorage.setItem("logged" , "true"); 
        localStorage.setItem("loggedId" , Uid); 
        localStorage.setItem("name" ,name); 

        console.log("dhesfjkglhj");
        console.log(localStorage.getItem('loggedId'));

        set(dbRef(database, 'users/' + Uid), {
          id: Uid,
          name: name,
          email : email,
          pass :pass,
          image : url,
        });
        navigate("/profile")
   }




   
    const handleGoogleSignup = () =>{
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {

                let id =v4();

                const credential = GoogleAuthProvider.credentialFromResult(result);
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
                          localStorage.setItem("name" , childSnapshot.val().name);  
                        })
                    } 
                    else {
                        console.log("No Previouse Email  available");
        
                        set(dbRef(database, 'users/' + id), {
                            id: id,
                            name: user.displayName,
                            email : user.email,
                            image : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                            pass :"!@##!@!#!#!$^!$^!&",
                          });

                        localStorage.setItem("email" , user.email);
                        localStorage.setItem("name" , user.displayName); 
                        localStorage.setItem("logged" , "true"); 
                        localStorage.setItem("loggedId" , id);  
                    }
                });

              
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }




    return (
     
        <div class="signup">

            <div className='container'>
                <div className='left signupLeft'>
                        <img className="imgPrv" src={imgPrev} />
                        <br/>
                        <label for="file-input" className='file-input-label'>
                             Upload Profile Photo
                            <input id="file-input" className = "imgInput" ref={imgRef}  type="file" accept="image/*" onChange={imageHandle}/>
                            
                        </label>
                        
                  
                </div>


                <div className='right'>

                    <div className="top">
                        <h2 className='h2'>Signup</h2>
                        <p>Already have an account yet?  <Link to={`/login`}>Login</Link></p>
                    </div>

                    <div className ="mid signupMid">
                        <form  onSubmit={handleSignUp}>

                            <label for="Name">Username</label>
                            <input placeholder="your name" type={'text'} onChange={(e) => setName(e.target.value)}></input>
                           

                            <label for="Email">Email</label>
                            <input placeholder="you@example.com" type={'email'} onChange={(e) => setEmail(e.target.value)}></input>
                           
                            <label for="Password">Password</label>
                            <input placeholder="Enter 6 character or more" type={'password'} onChange={(e) => setPass(e.target.value)}></input>
                            <br/>
                            <button>SIGNUP</button>
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

export default Signup; 
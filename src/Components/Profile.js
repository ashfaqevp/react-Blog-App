import {useState , useEffect } from 'react';
import {Link} from 'react-router-dom';
import {database} from '../firebase';
import { ref ,  onValue, child ,get,query,orderByChild,equalTo} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Post from './Post';
import { signOut  } from "firebase/auth";
import {auth} from '../firebase';
import Categories from './Categories';


const Profile = () => {

    const [abc, setAbc] =useState("Proff");

    const [email , setEmail] = useState("");
    const [name , setName] = useState("");
    const [profileData , setProfileData] = useState({});
    const [data , setData] = useState([]);
    const [tempData , setTempData] = useState([]);

    const [draftData , setDraftData] = useState([]);
    const [draft , setDraft] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; 
    const pageCount = Math.ceil(data.length / pageSize); 
    let startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataPage = data.slice(startIndex, endIndex);


    useEffect (()=> {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setEmail(user.email);
            console.log(email)
        } 
        else {
        }
        });

    });


    useEffect (()=> {

        const dbRef2 = ref(database, 'users');
        const q = query(dbRef2, orderByChild("email"), equalTo(email));
        onValue(q, (snapshot)=>{

            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot =>{
                    setProfileData(childSnapshot.val())
                    setName(childSnapshot.val().name)
               });
           } 

            else {
                console.log("No data available");
            }
        });
    },[email]);



    useEffect (()=> {
        const dbData = [];
        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("user"), equalTo(name));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setData(dbData);
           setTempData(dbData);
           console.log(dbData);
        });

    },[name]);


    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'draft-posts');
        onValue(dbRef , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
            setDraft(true);
           });
           setDraftData(dbData);
           console.log(draftData);

        });

    },[]);



    const handleSignout = ()=>{
        signOut(auth).then(() => {
            localStorage.setItem("email" , "");
            localStorage.setItem("loggedId" , "");
            localStorage.setItem("logged" , "false");
            window.location.href = 'http://localhost:3001/';
            
          }).catch((error) => {
          });
    }




    
    function handlePageChange(page) {
        setCurrentPage(page);
    }    
    




    return(
        <div className="profile" >

            
           

            
         <div className="home-mid profileMid">

            <div className="recent-posts">
                <h2>Your Posts</h2>  
                <hr  style={{  border :"2px blue solid"}}/> 
                <br/><br/>

                {dataPage.map((post,index) => (
                    <Post 
                        user={post.user} 
                        image={post.image}
                        title={post.title}
                        content={post.content.length > 190 ? post.content.substring(0,190) + "..." : post.content}
                        
                        commentsCount={(post.comments) ? (Object.keys(post.comments).length) : '0'}

                        date={post.date}
                        id={post.id}
                        
                    />
                ))}

                <div className="pagination">

                    {currentPage > 1 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                    )}

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={page === currentPage ? "pageActive" : "" }>

                            {page}
                        </button>
                    ))}


                    {currentPage < pageCount && (
                    <button onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                    )}

                </div>

            </div>



            <div className='sidebar'>

                <div className="profileDetails">
                    <h4>{"Profile"}</h4>
                    <hr  style={{  border :"2px blue solid"}}/>

                    <img src= {profileData.image} alt="Ashfaqe" />
                    <h5> { profileData.name }</h5>
                    <p> { email } </p>

                    <div className = "bot">
                        <button className='a'>Edit Profile</button>
                        <button className='b' onClick={handleSignout}>Logout</button>
                    </div> 
                   
                </div>


                <div className="draft related" >
                    <h4>Drafted Post</h4>
                    <hr style={{  border :"2px blue solid"}}/>
                    <h5 className={draft === true ? "hidden" : " " } style={{color:"gray" , paddingTop:"40px" , paddingBottom:"40px" , textAlign:"center" }}> NO DRAFT </h5>
                    {draftData.map((post,index) => (

                        <div className="rpost" >
                                <img src={post.image}/>
                                <div>
                                    <p>{post.date}</p>
                                    <Link to={`/draft/${post.id}`}>
                                        <h6 >{post.title.length > 35 ? post.title.substring(0,35) + "..." : post.title}</h6>
                                    </Link>   
                                </div>
                        </div>
                    ))}
                </div>

                <div className="ads">
                </div>


                <Categories/>

     
            </div>


        </div>

            
            
        </div>
    );
};

export  default Profile;
import React,{useState , useEffect , useRef} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ref, onValue, child ,get,query,orderByChild,equalTo , set,limitToLast} from "firebase/database";
import {database} from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarEvent , Person, Chat , Dot} from 'react-bootstrap-icons/dist';
import Categories from './Categories';
import TopRated from './TopRated';


const PostPage =  () => {

    const {id}=useParams();

    const [uEmail , setUEmail] = useState("");
    const [user , setUser] = useState("");
    const [uImage , setUImage] = useState("");

    const [name , setName] = useState("");
    const [profileData , setProfileData] = useState({});

    const [data,setData] = useState({});
    const [rData , setRData] = useState([]);
    const [commentData,setCommentData] = useState([]);
    const [comment, setComment] = useState();
    const commentRef = useRef(null);


    useEffect (()=> {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUEmail(user.email);
            console.log(uEmail)
        } 
        else {
        }
        });
    });
    

    useEffect (()=> {

        const dbRef2 = ref(database, 'users');
        const q = query(dbRef2, orderByChild("email"), equalTo(uEmail));
        onValue(q, (snapshot)=>{
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot =>{
                    setUser(childSnapshot.val().name)
                    setUImage(childSnapshot.val().image)
               });
           } 
            else {
                console.log("No data available");
            }
        });
    },[uEmail]);




    useEffect (()=> {

        const dbRef2 = ref(database, 'users');
        const q = query(dbRef2, orderByChild("name"), equalTo(name));
        onValue(q, (snapshot)=>{

            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot =>{
                    setProfileData(childSnapshot.val())
               });
           } 

            else {
                console.log("No data available");
            }
        });
    },[data]);


   


    useEffect(()=>{
        const dbRef = ref(database);
        get(child(dbRef, 'posts/'+id))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setData(snapshot.val())
                setName(snapshot.val().user)
            } 
            else {
                console.log("No data available");
            }
          }).catch((error) => {
                console.error(error);
        });
    },[]);


    useEffect (()=> {
        const dbCData = [];
        const dbCRef =  ref(database, 'posts/' + id + '/comments');
        onValue(dbCRef , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbCData.push(childSnapshot.val());
           });
           setCommentData(dbCData);
           console.log(commentData);
        });

    },[]);



    useEffect (()=> {
        const dbData = [];
        const dbRef =  ref(database, 'posts');
       // const dbRef2 = query(dbRef, orderByChild("category"), equalTo(data.category));

        onValue(query(dbRef , limitToLast(3)),(snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setRData(dbData);
           console.log(rData);

        });

    },[data]);


    
    






    
    const postComment = () =>{

        let currentdate = new Date();
        
        let year = currentdate.getFullYear();
        let month = (((currentdate.getMonth() + 1) < 10) ? '0' : '') + (currentdate.getMonth() + 1);
        let day = (((currentdate.getDate() < 10) ? '0' : '') + currentdate.getDate());
        let hour = (((currentdate.getHours() < 10) ? '0' : '') + currentdate.getHours());
        let minute = (((currentdate.getMinutes() < 10) ? '0' : '') + currentdate.getMinutes());
        let second = (((currentdate.getSeconds() < 10) ? '0' : '') + currentdate.getSeconds() );


         let date = day + "/"  + month + "/"+ year;
         let time = hour + ":" + minute;

         let commentIdtemb =  Number(year+ ""+ month+""+ day+"" + hour+""  + minute+"" + second);
         let bigNumber = 123456789012345;
         let commentId = bigNumber - commentIdtemb;
         console.log(commentId);
        
        set(ref(database, 'posts/' + id + '/comments/' + commentId), {
            id: commentId,
            user: user,
            content :comment,
            image : uImage,
            date : date,
            time : time,
          });

          toast.success('Coment Added Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
            

          commentRef.current.value = "";


            const dbRef = ref(database);
            get(child(dbRef, 'posts/'+id))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setData(snapshot.val())
                } 
                else {
                    console.log("No data available");
                }
            }).catch((error) => {
                    console.error(error);
            });

    }





    return(
        <div className="postPage">

            <div className='content'>
                <div className='article'>


                    {/* POST */}
                    <div className="postCmpnt">
                        <img className="pImg" src={data.image}></img>

                        <div className="pDes">
                        <p><Person className='icons'  color="gray " size={20} />  BY <u><span className='capital'>{data.user}</span></u></p>

                        <p> <Dot className='icons'  color="blue " size={26} /> </p>

                        <p><Chat className='icons'  color="gray " size={16} />  COMMENTS {(data.comments) ? (Object.keys(data.comments).length) : '0'}</p>

                        <p ><Dot className='icons'  color="blue " size={26} /> </p>
                        
                        <p> <CalendarEvent className='icons'  color="gray " size={16} /> {data.date}</p>
                    </div>

                        <h2 className="PTitle">{data.title}</h2>
                        <p className="pCont">{data.content}</p>

                        <br/><br/>
                    </div>


                    {/* PRE AND NEXT POST */}


                   




                    {/* COMMENTS*/}


                    <div className =" comments">
                        <h4> COMMENTS </h4>

                        <div className =" postCom">
                            <div className='top'>
                                <img src={uImage} />
                                <h5>{user}</h5>
                            </div>
                            <div className='mid'>
                                <textarea ref={commentRef} onChange={(e) => setComment(e.target.value)} ></textarea>
                            </div>
                            <div className='bot'>
                                <button onClick={postComment}>Post</button>
                            </div>

                        </div>

                        


                     <div>

                     {commentData.map((c,index) => (
                            <div className=" com">
                            <img src={c.image}/>
                            <div>
                                <div className="top">
                                    <h5>{c.user} </h5>
                                    <p>{c.date}</p>
                                </div>
                                <div className="bot">
                                    <p>
                                        {c.content}
                                    </p>
                                </div>
                            </div>    
                            </div>
                        ))}

                     </div>


                       




                    </div>

        


                </div>

                <div className='sidebar'>

                    <div className="author">
                        <img src={profileData.image}/>
                        <h5> {profileData.name}</h5>
                        <p>Hi! beautiful people. I`m an authtor of this blog. Read our post - stay with us</p>
                        <p>{profileData.email}</p>
                    </div>


                    <div className="adsb">
                    </div>


                    <Categories/>


                    


             


        

                  
                
                </div>


            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );

}

export default PostPage;
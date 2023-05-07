import {useState , useRef, useEffect} from 'react';
import {Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref ,  onValue, query,orderByChild,equalTo,get,child ,remove} from "firebase/database";
import { ref as dbRef, set } from "firebase/database";
import {storage , database} from '../firebase'
import { ref as storageRef, uploadBytes, getDownloadURL }  from "firebase/storage";
import { v4 } from 'uuid';
import uploadImg from "../Images/noimages.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DraftBlog = () =>{

    const {id}=useParams();

    const history = useNavigate();


    const [data,setData] = useState({});

    const [email , setEmail] = useState("");
    const [profile , setProfile] = useState("");

    const titleRef = useRef(null);
    const catRef = useRef('Entertainment');
    const contRef = useRef(null);
    const imgRef = useRef(null);


    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imgPrev, setImgPrev] =useState(uploadImg);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Entertainment");
    const [content, setContent] = useState("");


    useEffect (()=> {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {

              setEmail(user.email);
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
                  setProfile(childSnapshot.val().name);
                  console.log(childSnapshot.val().image)
             });
         } 
  
          else {
              console.log("No data available");
          }
      });
  },[email]);



  useEffect(()=>{
    const dbRef = ref(database);
    get(child(dbRef, 'draft-posts/'+id))
    .then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            setData(snapshot.val());
            setCategory(snapshot.val().category)
            setContent(snapshot.val().content)
            setTitle(snapshot.val().title);
            setImgPrev(snapshot.val().image);

            titleRef.current.value = snapshot.val().title;
            contRef.current.value = snapshot.val().content;
        } 
        else {
            console.log("No data available");
        }
      }).catch((error) => {
            console.error(error);
    });
},[]);



    const imageHandle = (e)=>{
        setImage(e.target.files[0])
        setImgPrev(URL.createObjectURL(e.target.files[0]) );
    }




    const uploadImage = () =>{
        if (image == null){
            publish(imgPrev);
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

        let currentdate = new Date();
        
        let year = currentdate.getFullYear();
        let month = (((currentdate.getMonth() + 1) < 10) ? '0' : '') + (currentdate.getMonth() + 1);
        let day = (((currentdate.getDate() < 10) ? '0' : '') + currentdate.getDate());
        let hour = (((currentdate.getHours() < 10) ? '0' : '') + currentdate.getHours());
        let minute = (((currentdate.getMinutes() < 10) ? '0' : '') + currentdate.getMinutes());
        let second = (((currentdate.getSeconds() < 10) ? '0' : '') + currentdate.getSeconds());


         let date = day + "/"  + month + "/"+ year;
         let time = hour + ":" + minute;

         let idTemb =  Number(year+ ""+ month+""+ day+"" + hour+""  + minute+"" + second);

        //  let bigNumber = 123456789012345;
        //  let id = bigNumber - idTemb;

        set(dbRef(database, 'posts/' + id), {
            id: id,
            title: title,
            category : category,
            content :content,
            image : url,
            date : date,
            time : time,
            like : 0,
            user :profile,
            email:email,
          });


          const childRef = ref(database, 'draft-posts/' + id);
            remove(childRef)
            .then(() => {

                toast.success('Blog Published Successfully', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });

                    history('/profile');

            })
            .catch((error) => {
                alert("Blog Not Published")
            });


          

    }



    const uploadImageDraft = () =>{
        if (image == null){
            publishDraft(imgPrev);
        }
        const strRef = storageRef(storage, `post-images/${image.name + v4()} `);
        console.log(`images/${image.name + v4()} `);
        uploadBytes(strRef, image ).then((snapshot) => {
            console.log('Uploaded image');
            getDownloadURL(snapshot.ref).then( (url) => {
                setImageUrl(url);
                publishDraft(url);
            });
          });     
    }

    const publishDraft = (url) =>{

        let currentdate = new Date();
        
        let year = currentdate.getFullYear();
        let month = (((currentdate.getMonth() + 1) < 10) ? '0' : '') + (currentdate.getMonth() + 1);
        let day = (((currentdate.getDate() < 10) ? '0' : '') + currentdate.getDate());
        let hour = (((currentdate.getHours() < 10) ? '0' : '') + currentdate.getHours());
        let minute = (((currentdate.getMinutes() < 10) ? '0' : '') + currentdate.getMinutes());
        let second = (((currentdate.getSeconds() < 10) ? '0' : '') + currentdate.getSeconds());


         let date = day + "/"  + month + "/"+ year;
         let time = hour + ":" + minute;

         let idTemb =  Number(year+ ""+ month+""+ day+"" + hour+""  + minute+"" + second);

        //  let bigNumber = 123456789012345;
        //  let id = bigNumber - idTemb;

        set(dbRef(database, 'draft-posts/' + id), {
            id: id,
            title: title,
            category : category,
            content :content,
            image : url,
            date : date,
            time : time,
            like : 0,
            user :profile,
            email:email,
          });


          toast.success('Blog Drafted Successfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

            history('/profile');

          titleRef.current.value = "";
          catRef.current.value = "";
          contRef.current.value = "";
          imgRef.current.value = "";
          setImgPrev(uploadImg); 
           
    }




    

    return(
        <div className="newBlog">
            <div className="contents">
                <div className="left">

                    <label> Title</label>
                    <input  ref={titleRef} type="text"  placeholder="Enter blog title.." onChange={(e) => setTitle(e.target.value)} />
                    <br/>
                    

                    <label> Category</label>
                    <select ref={catRef} value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Sports">Sports</option>
                        <option value="Lifestyles">Lyfestyles</option>
                        <option value="Science & Technology">Science & Technology</option>
                    </select>
                    <br/>
                    

                    <label> Image</label>
                    <img className="imgPrv" src={imgPrev} />
                        
                    
                    


                </div>
                <div className="mid"> </div>
                <div className="right">
                    <label> Description</label>
                    <textarea placeholder="Enter your blog here..." ref={contRef} className="desc" onChange={(e) => setContent(e.target.value)}/> 
                </div>
            </div>

            <div className='bottoms'>
                <div className='a'>
                    <input className = "uploadImage" ref={imgRef}  type="file" accept="image/*" onChange={imageHandle}/>
                </div>

            <div className="submit b">
                <button className="publish draft" onClick={uploadImageDraft}>Save Draft</button>
                <button className="publish" onClick={uploadImage}>Publish Post</button>
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
    )
}

export default DraftBlog;
import {Link, useParams} from 'react-router-dom';
import React,{useState,useEffect} from "react";
import { ref , onValue , query , orderByChild , equalTo} from "firebase/database";
import { database} from '../firebase'
import Post from './Post';
import sImg from '../Images/ronaldo.jpg'
import lImg from '../Images/lifestyles.jpg'
import eImg from '../Images/entertainment.jpg'
import stImg from '../Images/robotss.jpg'
import Categories from './Categories';
import TopRated from './TopRated';


const PostCatPage = () => {

    const {cat}=useParams();

    const [data,setData] = useState([]);
    const [tempData,setTempData] = useState([]);

    const [bgImg , setBgmImg] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; 
    const pageCount = Math.ceil(data.length / pageSize); 
    let startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataPage = data.slice(startIndex, endIndex);


    useEffect (() => {
        switch (cat) {
            case "Sports":
                setBgmImg(sImg);
                break;

            case "Entertainment":
                setBgmImg(eImg);
                break;

            case "Lifestyles":
                setBgmImg(lImg);
                break;

            default:
                setBgmImg(stImg);
                
        }
    },[cat])


    useEffect (()=> {
        const dbData = [];
        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("category"), equalTo(cat));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setData(dbData);
           setTempData(dbData);
           console.log(dbData);
        });

    },[cat]);



    function handlePageChange(page) {
        setCurrentPage(page);
    }



    return(
        <div className="postCat">

            <div className="tops">
                <div className="banner" style={{ backgroundImage: `url(${bgImg})` }}> 
                </div>
                <div className="content">
                    <h1>{cat} News</h1>
                    <h4>Home / <span>{cat}</span></h4>
                </div>
            </div>

            <br/> <br/>

         <div className="home-mid postCatMid">

            <div className="recent-posts">
                <h2>Recent Posts</h2>  
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
               <TopRated/>

                <div className="adsb">
                </div>

                <Categories/>

                <div className="ads">
                </div>
            </div>



            
         </div>
                
            

        </div>
    );

}

export default PostCatPage ;

import { Link } from 'react-router-dom';
import React,{useState,useEffect} from "react";
import { ref ,onValue, query , limitToLast} from "firebase/database";
import { database} from '../firebase'
import Post from './Post';
import Categories from './Categories';
import TopRated from './TopRated';


const Home = () =>{

    const [data,setData] = useState([]);
    const [tempData,setTempData] = useState([]);


   
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; 
    const pageCount = Math.ceil(data.length / pageSize); 
    let startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataPage = data.slice(startIndex, endIndex);


    
    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'posts');
        onValue(dbRef , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setData(dbData);
           setTempData(dbData);
           console.log(data);

        });

    },[]);




    function handlePageChange(page) {
        setCurrentPage(page);
    }



 



    return(
        <div className="homes">

         <div className="tops">
            <div className="left card">
                <div className="bgs"></div>
                <div className="contents">
                    <Link to={`/post-category/Sports`}>
                        <button className="card-label">Sports</button>
                    </Link>
                    <h1>Number One Iga Swiatek Learning to Live with Target on Her Back</h1>
                    <p>Iga Swiatek said she is growing accustomed to the high expectations and harsh criticism that come with being the world’s top player and is feeling “good vibes" ahead of her title defence at Indian Wells.</p>
                </div>
                
            </div>
            <div className="right">
                <div className="rightTop card">
                    <div className="bgs"> </div>
                    <div className="contents">
                    <Link to={`/post-category/Science & Technology`}>
                        <button className="card-label">Science & Technology</button>
                    </Link>
                    <h3>Advanced Space Research Underway With 11-Member ISS Crew</h3>
                    <p></p>
                </div>
                    
                </div>
                <div className="rightBot">
                    <div className="rightBota card">
                        <div className="bgs"> </div>
                        <div className="contents">
                        <Link to={`/post-category/Entertainment`}>
                            <button className="card-label">Entertainment</button>
                        </Link>
                        
                    <h4>Persona 3 Portable Review</h4>
                </div>
                    </div>

                    <div className="rightBotb card">
                        <div className="bgs"> </div>
                        <div className="contents">
                            <Link to={`/post-category/Lifestyles`}>
                                <button className="card-label">Lifestyles</button>
                            </Link>    
                            <h4>What's In Trend In Womens Fashion Summer?</h4>
                            <p></p>
                        </div>
                    </div>

                </div>
            </div> 
         </div> 

         <br/> <br/>

         <div className="home-mid">

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
                        // Object.keys(post.comments).length
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



         <br/> <br/> <br/> <br/>



        </div>
    )
}

export default Home;
import {Link, useParams} from 'react-router-dom';
import React,{useState,useEffect} from "react";
import { ref , onValue , query , orderByChild , equalTo} from "firebase/database";
import { database} from '../firebase'
import Post from './Post';
import Categories from './Categories';
import TopRated from './TopRated';


const SearchPost = () => {

    const {search}=useParams();

    const [data,setData] = useState([]);
    const [searchData,setSearchData] = useState([]);

    const [result,setResult] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3; 
    const pageCount = Math.ceil(searchData.length / pageSize); 
    let startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const dataPage = searchData.slice(startIndex, endIndex);


    


    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'posts');
        onValue(dbRef , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
            
           });
           setData(dbData);
           setSearchData(dbData);
           console.log(data);

        });

    },[search]);


    useEffect (()=>{

           let newArrays = data.filter(function (el){

               return el.title.toLowerCase().includes(search.toLowerCase());  
           }); 
           
           setSearchData(newArrays);
   },[data]);





    function handlePageChange(page) {
        setCurrentPage(page);
    }



    return(
        <div className="postCat">


            <br/> <br/>

         <div className="home-mid postCatMid">

            <div className="recent-posts">
                <h2>Results {"(" + search + ")"} </h2>  
                <hr  style={{  border :"2px blue solid"}}/> 
                <br/><br/>

                <h5 className={(searchData.length > 0)? "hidden" : " " } style={{color:"gray" , paddingTop:"100px" , paddingBottom:"100px" , textAlign:"center" }}> NO RESULT </h5>

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

export default SearchPost ;

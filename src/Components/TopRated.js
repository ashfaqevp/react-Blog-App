import { Link } from 'react-router-dom';
import React,{useState,useEffect} from "react";
import { ref ,onValue, query , limitToLast} from "firebase/database";
import { database} from '../firebase'

const TopRated = () => {

    const [rData , setRData] = useState([]);


    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'posts');
        onValue(query(dbRef , limitToLast(3)),(snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setRData(dbData);
           console.log(rData);

        });

    },[]);

    return(
        <div className="related">
        <h4>Top Rated Posts</h4>
        <hr  style={{  border :"2px blue solid"}}/>
        {rData.map((post,index) => (

            <div className="rpost">
                    <img src={post.image}/>
                    <div>
                        <p>{post.date}</p>
                        <Link to={`/post/${post.id}`}>
                            <h6>{post.title.length > 35 ? post.title.substring(0,35) + "..." : post.title}</h6>
                        </Link>
                    </div>
            </div>
        ))}
    </div>
    )
}

export default TopRated;
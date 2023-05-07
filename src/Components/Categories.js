import { Link } from 'react-router-dom';
import React,{useState,useEffect} from "react";
import { ref , onValue , query , orderByChild , equalTo} from "firebase/database";
import { database} from '../firebase'
import { CaretRight , Search} from 'react-bootstrap-icons/dist';

const Categories = () => {

    const [sporstLen , setSportsLen] = useState(0);
    const [eLen , setELen] = useState(0);
    const [lifeLen , setLifeLen] = useState(0);
    const [scienceLen , setScienceLen] = useState(0);

    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("category"), equalTo("Sports"));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setSportsLen(dbData.length);
           console.log(dbData);
        });

    },[]);

    
    useEffect (()=> {
        const dbData = [];
        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("category"), equalTo("Entertainment"));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setELen(dbData.length);
           console.log(dbData);
        });

    },[]);


    useEffect (()=> {
        const dbData = [];

        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("category"), equalTo("Lifestyles"));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setLifeLen(dbData.length);
           console.log(dbData);
        });

    },[]);


    useEffect (()=> {
        const dbData = [];
        const dbRef =  ref(database, 'posts');
        const dbRef2 = query(dbRef, orderByChild("category"), equalTo("Science & Technology"));
        onValue(dbRef2 , (snapshot)=>{
           snapshot.forEach(childSnapshot =>{
            dbData.push(childSnapshot.val());
           });
           setScienceLen(dbData.length);
           console.log(dbData);
        });

    },[]);


    return(
        <div className="categories">
                <h4>Post categories</h4>

                <hr  style={{  border :"2px blue solid"}}/>

                <br/>

                <div className="cat">
                    <Link to={`/post-category/${"Sports"}`}>
                        <p className="a"><CaretRight  color="black" size={18} />{" Sports"}</p>
                    </Link>    
                    <p className="b">{'('+sporstLen+')'}</p>
                </div>
                
                <hr/>

                <div className="cat">
                    <Link to={`/post-category/Entertainment`}>
                        <p className="a"><CaretRight  color="black" size={18} />{" Entertainment"}</p>
                    </Link> 
                    <p className="b">{'('+eLen+')'}</p>
                </div>

                    <hr/>

                <div className="cat">
                    <Link to={`/post-category/Lifestyles`}>
                        <p className="a"><CaretRight  color="black" size={18} />{" Lifestyles"}</p>
                    </Link> 
                    <p className="b">{'('+lifeLen+')'}</p>
                </div>

                <hr/>
                

                <div className="cat">
                    <Link to={`/post-category/Science & Technology`}>
                        <p className="a"><CaretRight  color="black" size={18} />{" Science & Technology"}</p>
                    </Link> 
                    <p className="b">{'('+scienceLen+')'}</p>
                </div>
                    
                </div>
    );
}

export default Categories;
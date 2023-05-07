import { Link } from 'react-router-dom';
import { CalendarEvent , Person, Chat , Dot} from 'react-bootstrap-icons/dist';

const Post = (props) =>{

return(
    <div className="postCmpnt">

        <img className="pImg" src={props.image}></img>

        <div className="pDes">
            <p><Person className='icons'  color="gray " size={20} />  BY <u><span className='capital'>{props.user}</span></u></p>

            <p> <Dot className='icons'  color="blue " size={26} /> </p>

            <p><Chat className='icons'  color="gray " size={16} />  COMMENTS {props.commentsCount}</p>

            <p ><Dot className='icons'  color="blue " size={26} /> </p>
            
            <p> <CalendarEvent className='icons'  color="gray " size={16} /> {props.date}</p>
        </div>

        <h2 className="PTitle">{props.title}</h2>
        <p className="pCont">{props.content}</p>

        <Link to={`/post/${props.id}`}>
            <h6 className="pRead"><u>Read more...</u></h6>
        </Link>
        
        <br/><br/>
    </div>
);

}

export default Post ;
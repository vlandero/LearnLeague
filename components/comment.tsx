import {useState} from 'react'
import { useAuth } from '../wrappers/state'
import { ApiService } from '../lib/ApiCalls'
import { CommentType, Status } from '../lib/interfaces'
import AddComment from './add-comment'


interface Props{
    content:string,
    user_who_commented_username:string,
    user_who_commented_id:number,
    user_who_posted_id:number,
    comment_id:number,
    setCommAdded:React.Dispatch<React.SetStateAction<boolean>>,
    replies:CommentType[]
}

export default function Comment({content,comment_id,user_who_commented_username,user_who_commented_id,user_who_posted_id,setCommAdded,replies}:Props) {

    const { user } = useAuth();

    async function addReply(comment:string){
        let promise = await ApiService.post('addcomment',{content:comment,user_id:user?.id,match_id:null,parent_id:comment_id},{});
        let result:Status = await promise;
        if(result.error){
            console.log(result.error);
            return alert('Comment could not be added');
        }
        setCommAdded(prev=>!prev);
    }
    async function deleteComment(){
        let promise = await ApiService.post('deletecomment',{id:comment_id},{});
        let result: Status = await promise;
        if(result.error){
            console.log(result.error);
            return alert('Comment could not be deleted');
        }
        setCommAdded(prev=>!prev);
    }

    function canDelete():JSX.Element | null{
        if(user && (user_who_commented_id === user.id || user_who_posted_id === user.id))
            return (
                <button className='button' onClick={deleteComment}>Delete comment</button>
            );
        return null;
    }

    function canComment():JSX.Element | null{
        if(user)
            return (
                <div>
                    <p>Reply to {user_who_commented_username}:</p>
                    <AddComment add={addReply}></AddComment>
                </div>
            );
        return null;
    }

    if(replies===undefined)
        return(
            <div>Unlucky</div>
        )
    return (
        <div className='mx-20 my-9 border-2 border-black border-collapse'>
            {content} by {user_who_commented_username}
            {canDelete()}
            {canComment()}
            <div>
                {replies.map(comm=><Comment key={comm.comment_id.toString()} replies={comm.replies} setCommAdded={setCommAdded} comment_id={comm.comment_id} user_who_commented_id={comm.user_id} content={comm.content} user_who_commented_username={comm.username} user_who_posted_id={user_who_posted_id}></Comment>)}
            </div>
        </div>
    )
}

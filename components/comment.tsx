import React from 'react'
import { ApiService } from '../lib/ApiCalls'
import { CommentType, Status } from '../lib/interfaces'
import AddComment from './add-comment'


interface Props{
    content:string,
    username:string,
    user_id:bigint,
    id:bigint,
    setCommAdded:React.Dispatch<React.SetStateAction<boolean>>,
    replies:CommentType[]
}

export default function Comment({content,username,id,user_id,setCommAdded,replies}:Props) {
    async function addComment(comment:string){
        let promise = await ApiService.post('addcomment',{content:comment,user_id:user_id,match_id:null,parent_id:id},{})
        let result:Status = await promise
        setCommAdded(prev=>!prev)
        console.log(result);
    }
    console.log('replies, '+id,replies);
    if(replies===undefined)
        return(
            <div>Unlucky</div>
        )
    return (
        <div className='mx-20 my-9 border-2 border-black border-collapse'>
            {content} by {username}
            <div>
                <p>Reply to {username}:</p>
                <AddComment add={addComment}></AddComment>
            </div>
            <div>
                {replies.map(comm=><Comment key={comm.id.toString()} replies={comm.replies} setCommAdded={setCommAdded} id={comm.id} user_id={user_id} content={comm.content} username={comm.username}></Comment>)}
            </div>
        </div>
    )
}

import React,{useEffect,useState} from 'react'
import { useRouter } from 'next/router'
import {GetServerSideProps} from 'next'
import { CommentType, Match, Status } from '../../lib/interfaces'
import connection from '../../lib/postgre'
import AddComment from '../../components/add-comment'
import { ApiService } from '../../lib/ApiCalls'
import Comment from '../../components/comment'
import { withIronSessionSsr } from 'iron-session/next'
import ironSessionOptions from '../../lib/session-options'

interface Props{
  match:Match,
  error:string|null,
  comments:CommentType[],
  username:string,
  user_id:number,
  match_id:number,
  date_added_string:string
}

export default function MatchPage({match,error,username,date_added_string,user_id,match_id}:Props) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [commAdded, setCommAdded] = useState(false)
  useEffect(() => {
    let fc = async() => {
      let promise = await ApiService.post('getcomments',{match_id:match_id},{})
      let result:Status = await promise
      setComments(JSON.parse(result.status))
      console.log('object,',JSON.parse(result.status));
    }
    if(error===null)
      fc()
  },[commAdded])
  
  let date_added = new Date(date_added_string)
  const router = useRouter()
  const {id} = router.query
  async function addComment(comment:string){
    let promise = await ApiService.post('addcomment',{content:comment,user_id:user_id,match_id:match_id,parent_id:null},{})
    let result:Status = await promise
    setCommAdded(prev=>!prev)
    console.log(result);
  }
  if(error!==null)
    return (
      <div>{error}</div>
    )
  return (
    <div>
      {id} by {username} on {date_added.getDate()}/{date_added.getMonth()+1}/{date_added.getFullYear()}
      <div>
        <AddComment add={addComment}></AddComment>
        <div>
          {comments.map((comm)=><Comment key={comm.id.toString()} replies={comm.replies} setCommAdded={setCommAdded} id={comm.id} user_id={user_id} content={comm.content} username={comm.username}></Comment>)}
        </div>
      </div>
    </div>
  )
}


const SSR:GetServerSideProps = async(context) => {
  if(!(context.query.id !== undefined && typeof(context.query.id)==='string'))
    return{
      props:{
        error:'Internal error'
      }
    }
  if(context.query.id.length < 9)
    return{
      props:{
        error:'Incorrect URL.'
      }
    }
  let id = parseInt(context.query.id.slice(8))
  let token = context.query.id.slice(0,8)  
  let res = await connection.query(`
  SELECT
    m.json,
    m.id as match_id,
    u.id as user_id,
    u.username,
    m.questions,
    m.description,
    m.date_added
  FROM matches m
  JOIN users u ON m.user_id = u.id
  WHERE m.id='${id}' AND m.token='${token}';
  `)
  if(res.rowCount === 0)
    return{
      props:{
        error:'Incorrect URL.'
      }
    }
  
  return{
    props:{
      match:JSON.parse(res.rows[0].json),
      error:null,
      date_added_string:res.rows[0].date_added.toString(),
      username:res.rows[0].username,
      user_id:res.rows[0].user_id,
      match_id:res.rows[0].match_id
    }
  }
}

export const getServerSideProps = withIronSessionSsr(SSR,ironSessionOptions)

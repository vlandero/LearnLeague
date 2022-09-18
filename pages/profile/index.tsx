import React, { useEffect } from 'react'
import { User } from '../../lib/interfaces'
import { withIronSessionSsr } from 'iron-session/next'
import { useUser } from '../../lib/helpers'
import ironSessionOptions from '../../lib/session-options'

export default function Profile(props:{user:User}) {
    useEffect(() => {
        if(props.user === null)
          window.location.href = '/login'
        else
            window.location.href = `/profile/${props.user.username}`
      }, [])
    return (
        <div>
            <p>Redirecting</p>
        </div>
    )
}

export const getServerSideProps = withIronSessionSsr(useUser,ironSessionOptions)
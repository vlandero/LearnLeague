import React, { useEffect } from 'react'
import { useAuth } from '../../wrappers/state'
import { User } from '../../lib/interfaces'

export default function Profile() {
    const {user} = useAuth()
    useEffect(() => {
        if(user === null)
          window.location.href = '/login'
        else
            window.location.href = `/profile/${user.username}`
      }, [])
    return (
        <div>
            <p>Redirecting</p>
        </div>
    )
}

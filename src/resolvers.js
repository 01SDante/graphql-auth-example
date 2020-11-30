import { users } from './data'

import jwt from 'jsonwebtoken'

export default {
    Query: {
        user(_, {id}) {
            return users.find(user => user.id === id)
        },
        viewer(_, __, {user}) {
            return users.find(({id}) => id === user.sub)
        }
    },
    Mutation: {
        login(_, {email, password}) {
            const {id, permissions, roles} = users.find(
                user => user.email === email && user.password === password
            )
            return jwt.sign(
                {'http://localhost:4000/graphql': {roles, permissions}},
                'top-secret',
                {algorithm: 'HS256', subject: id, expiresIn: '1d'}
            )
        }
    }
}
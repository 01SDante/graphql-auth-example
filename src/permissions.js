import { and, or, rule, shield } from 'graphql-shield'

function checkPermission(user, permission) {
    if (user && user['http://localhost:4000/graphql']) {
        return user['http://localhost:4000/graphql'].permissions.includes(
            permission
        )
    }
    return false
}

const isAuthenticated = rule()((_, __, {user}) => {
    return user !== null
})

const canReadAnyUser = rule()((_, __, {user}) => {
    return checkPermission(user, 'read:any_user')
})

const canReadOwnUser = rule()((_, __, {user}) => {
    return checkPermission(user, 'read:own_user')
})

const isReadingOwnUser = rule()((_, {id}, {user}) => {
    return user && user.sub === id
})

export default shield({
    Query: {
        user: or(and(canReadOwnUser, isReadingOwnUser), canReadAnyUser),
        viewer: isAuthenticated
    }
})
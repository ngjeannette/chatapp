const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case "UPDATE_LOGIN":
            return action.payload
        case "UPDATE_LOGIN_EMPTY":
            return {};
        default:
            return state
    }
}
export default loginReducer;
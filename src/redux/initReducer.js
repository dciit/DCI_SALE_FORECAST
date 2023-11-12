const initialState = {
    login: false,
    name: '',
    username: '',
    empcode:'',
    filter: {
        evaluate: {
            supplier: '',
            year: '',
            month: ''
        }
    },
    version: 0,
    objectselected: null
}

const IndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                ...action.payload
            }
        case 'FILTER_CHANGE':
            return {
                ...state,
                filter: action.payload
            }
        case 'OBJECT_SELECT':
            return {
                ...state,
                objectselect: action.payload
            };
        case 'RESET':
            var resetState = initialState
            resetState.version = action.payload.version;
            resetState.login = false;
            return resetState;
        default:
            return state
    }
}
export default IndexReducer;

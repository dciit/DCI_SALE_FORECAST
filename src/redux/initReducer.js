const initialState = {
    login: false,
    name: '',
    username: '',
    empcode: '',
    filter: {
        year: '',
        month: ''
    },
    version: 0,
    objectselected: null,
    edit: {
        year: 0,
        month: 0
    }
}

const IndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_EDIT':
            console.log(action.payload)
            return {
                ...state,
                edit: {
                    year: action.payload.year,
                    month: action.payload.month
                }
            }
        case 'SET_FILTER':
            return {
                ...state,
                filter: {
                    year: action.payload.filter.year,
                    month: action.payload.filter.month
                }
            }
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

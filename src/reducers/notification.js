import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION
} from './types'

const initState = {
    notifications: [{
        text: "Welcome to Marriage Onchain",
        type: "info"
    }]
}

const notifications = (state = initState, action) => {
    switch (action.type) {
      case ADD_NOTIFICATION:
        return {
            ...state,
            notifications: [...state.notifications, action.payload]
        };
      case REMOVE_NOTIFICATION:
          const newNotifications = state.notifications.filter((item, index) => index !== action.payload);
        //   console.log("From Redcucer" , newNotifications)
        return {
            ...state,
            notifications: [...newNotifications]
        };
      
      default:
        return state;
    }
  };
  
  export default notifications;
  
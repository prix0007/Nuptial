
import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { removeNotification } from "../actions";


const Notification = () => {

  const currentNotifications = useSelector((state) => state.notifications["notifications"]);

  const dispatch = useDispatch();

  const parseTypetoBulmaClasses = (type) => {
    switch (type) {
      case "info":
        return "is-info";
      case "link":
        return "is-link";
      case "danger":
        return "is-danger";
      case "warning":
        return "is-warning";
      case "success":
        return "is-success";
      default:
        return "is-primary";
    }
  };

  const deleteNotification = (index) => {
      dispatch(removeNotification(index))
  }

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      if(currentNotifications.length > 0)
        dispatch(removeNotification(0))
    }, 5000)
    return () => clearInterval(intervalId); //This is important
  })

  return (
    <div className="notification-container">
        {
            currentNotifications && currentNotifications.map((notification, index) => {
                return (
                    <div className={`notification ${parseTypetoBulmaClasses(notification["type"])}`} key={`noti-${index}`}>
                        <button className="delete" onClick={() => {deleteNotification(index)}}></button>
                       {notification["text"]}
                    </div>
                )
            })
        }
     
    </div>
  );
};

export default Notification;

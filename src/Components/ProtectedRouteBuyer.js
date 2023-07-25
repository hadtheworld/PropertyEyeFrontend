import React from 'react'
import { Navigate } from 'react-router-dom';

function ProtectedRouteBuyer(props) {
    if (!props.isLoggedIn) {
      return <Navigate to="/" replace />;
    } else if (props.isLoggedIn && !props.userType) {
      return props.children;
    } else {
      return <Navigate to="/" replace />;
    }
  }

export default ProtectedRouteBuyer
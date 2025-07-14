import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(props) {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = () => {
      try {
        const authToken = localStorage.getItem("persist:root");

        if (!authToken) {
          navigate("/");
          return;
        }

        // Parse the persisted data
        const parsedData = JSON.parse(authToken);

        // Parse the user data (it's double-stringified)
        const userData = JSON.parse(parsedData.user);

        // Check if user is actually authenticated
        if (!userData || userData.user === null) {
          navigate("/");
          return;
        }

      } catch (error) {
        console.error("Error parsing authentication data:", error);
        navigate("/signup");
      }
    };

    authenticateUser();
  }, [navigate]);

  return <Component />;
}

export default ProtectedRoute;

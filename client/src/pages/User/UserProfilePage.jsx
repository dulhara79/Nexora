import React from "react";
import UserProfile from "../../components/User/Profile";

const UserProfilePage = () => {
  const userId = "example-user-id";

  return (
    <div>
      <UserProfile userId={userId} />
    </div>
  );
};

export default UserProfilePage;

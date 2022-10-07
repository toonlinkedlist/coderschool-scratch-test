// import axios from "axios";
import React, { useState, useEffect } from "react";
import { staffData } from "../util";
import { Link } from "react-router-dom";

function Users() {
  const staff = staffData.staff_members.map((obj) => ({
    name: obj.name,
    id: obj.id,
  }));

  useEffect(() => {
    console.log(staff);
  }, []);

  return (
    <div>
      <ul>
        {staff.map((staff_member) => {
          return (
            <Link to={`/classes/${staff_member.id}`}>
              <li>{staff_member.name}</li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default Users;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { staffData, clientID } from "../util";

function Classes() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get coach's data from staff data
  const staff = staffData.staff_members.map((obj) => ({
    name: obj.name,
    id: obj.id,
    email: obj.email,
  }));

  const coach = staff.find((item) => item.id == id);

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post("/api/scratch/schedule", { id: coach.id, email: coach.email })
      .then((res) => {
        console.log(res.data);
        setSchedule(JSON.parse(res.data).event_occurrences.reverse());
        setLoading(false);
      });
  };

  // For ISO-8601 Strings
  function convertTime(isoTime) {
    let cutIsoTime = isoTime.substring(11, isoTime.length - 1);
    var hours = parseInt(cutIsoTime.substring(0, 2), 10) - 4,
      minutes = cutIsoTime.substring(3, 5),
      ampm = "am";

    if (hours == 12) {
      ampm = "pm";
    } else if (hours == 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
      ampm = "pm";
    }

    return hours + ":" + minutes + " " + ampm;
  }

  useEffect(() => {
    console.log(schedule);
  }, [schedule]);

  return (
    <>
      {/* {loading ? (
        <div>
          <h2>Today's Classes</h2>
        </div>
      ) : (
        <div>
          <h2>Today's Classes</h2>
        </div>
      )} */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2>Coach {coach.name}</h2>
          <button
            style={{ width: "150px", height: "50px" }}
            onClick={(e) => onSubmit(e)}
          >
            Get today's classes
          </button>
        </div>

        {schedule.length > 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <ul style={{ padding: 0 }}>
              {schedule.map((session) => {
                return (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      marginBottom: "50px",
                    }}
                  >
                    <h3>
                      {session.name} at {convertTime(session.start_at)}
                    </h3>
                    <ul style={{ padding: 0 }}>
                      {session.people.map((student) => {
                        return <li>{student.name}</li>;
                      })}
                    </ul>
                    <button style={{ marginTop: "20px" }}>
                      Generate Template
                    </button>
                  </div>
                );
              })}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Classes;

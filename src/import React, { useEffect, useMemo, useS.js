import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useMemo(() => {
    return io("http://localhost:5000/");
  }, []);
  console.log(messages);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room }); //for partcicular id
    setMessage("");
    setRoom("");
  };
  return (
    <div className="container form-container">
      <section className="section-form flex">
        <form action="#" className="flex" onSubmit={handleFormSubmit}>
          <span className="span-input-common flex">
            <label htmlFor="message">write something to send..</label>
            <input
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </span>
          <span className="span-input-common flex">
            <label htmlFor="room">enter room-id</label>
            <input
              type="text"
              name="message"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </span>
          <div>
            <button type="submit">send message</button>
          </div>
          <span className="id-socket">{socketId}</span>
        </form>

        <div className="section-user-messages">
          <ul className="flex parent-ul">
            {messages?.map((element, index) => (
              <li key={index}>{element} </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default App;

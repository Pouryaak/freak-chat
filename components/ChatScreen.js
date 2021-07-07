import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState, useRef, useEffect } from "react";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    // Update the last seen
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map(
        (message) =>
          (message = (
            <Message key={message.id} user={message.user} message={message} />
          ))
      );
    }
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {/* <Avatar /> */}
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Haven't Logged In"
              )}{" "}
            </p>
          ) : (
            <p>Loading Last active ...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          type="submit"
          hidden
          disabled={!input}
          onClick={sendMessage}
        ></button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  border-left: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: -10px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  margin-right: 15px;
  margin-left: 15px;
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

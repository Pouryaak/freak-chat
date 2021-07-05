import SyncLoader from "react-spinners/SyncLoader";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="https://cdn.iconscout.com/icon/free/png-512/sharechat-1136710.png"
          alt="loader"
          style={{ marginBottom: 30 }}
          height={100}
        />
        <div>
          <SyncLoader color="#FFD91D" size={20} />
        </div>
      </div>
    </center>
  );
}

export default Loading;

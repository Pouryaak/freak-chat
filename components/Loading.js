import SyncLoader from "react-spinners/SyncLoader";
import Image from "next/image";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <Image
          src="https://cdn.iconscout.com/icon/free/png-512/sharechat-1136710.png"
          alt="loader"
          style={{ marginBottom: 20 }}
          height={100}
          width={100}
        />
        <div>
          <SyncLoader color="#FFD91D" size={20} />
        </div>
      </div>
    </center>
  );
}

export default Loading;

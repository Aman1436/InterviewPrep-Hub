//will be having the logic for creating the instance of socket.io
import io from "socket.io-client";

let socket;

const connectToServer = (user_id) => {
   socket=io("https://localhost:3001",{
      query:`user_id=${user_id}`
   })
}

//

export { socket, connectSocket };
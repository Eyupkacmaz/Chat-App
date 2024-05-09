//kütüphaneler ekleniyor
const express = require("express");
const socketio = require("socket.io");

//express modülü kullanılarak express uygulaması oluşturulur 
const app = express();
const server = app.listen(3000);//3000 portlu server oluşturulur

//socket.io sunucusu oluşturulur ve önceki server a bağlanır
const io = socketio(server);

//middleware eklenir ve public içindeki istenilenler gönderilir
//Farklı uygulamaların birbirleriyle iletişim kurmak için kullandığı yazılımlar
app.use(express.static("public"));

//socket te aynı chate bağlanır ve aynı verileri iletir
io.on("connection", (connectedSocket) => {
  connectedSocket.on("chat", (data) => {
    io.sockets.emit("chat", data);
  });

  //socket hariç tüm bağlı istemcilere ‘typing’ olayı ile gelen veriyi yani kimin yazı yazdığı bilgisini iletir.
  connectedSocket.on("typing", (data) => {
    connectedSocket.broadcast.emit("typing", data);
  });
});
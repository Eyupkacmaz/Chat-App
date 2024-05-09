const socket = io.connect("localhost:3000");

const output = document.getElementById("output");
const feedback = document.getElementById("feedback");
const sender = document.getElementById("sender");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

// sendMessage fonksiyonu tanımlanıyor ve bu fonksiyonda chat olayı tetikleniyor
//‘sender’ ve ‘message’ isimli iki HTML elemanının değerleri alınarak bir nesne oluşturulur . 
//Bu nesne ,gönderenin adı (sender.value) ve gönderilen mesajın içeriği(message.value) bilgilerini içerir.

function sendMessage() {
  socket.emit("chat", {
    sender: sender.value,
    message: message.value,
  });
}
//sendTyping fonksiyonu tanımlanıyor ve bu fonksiyonla typing olayı tetiklenir ve kullanıcının yazı 
//yazarken olduğunu belirten bir bilgiyi server’a iletir.
function sendTyping() {
  socket.emit("typing", {
    sender: sender.value,
  });
}

// ‘submitBtn’ elementine tıklandığında ‘sendMessage’ fonksiyonunu tetiklemek için bir olay dinleyici ekler.
submitBtn.addEventListener("click", () => {
  sendMessage();
});

//Herhani bir tuşa basılma olayına dinleyici eklenir ve eğer basılan tuş enter ise ve Shift tuşuna 
//basılmışsa sendMessage fonksiyonu çağrılıyor ve bu işlemler sırasında ‘event.preventDefault()’ ile sayfanın yeniden yüklenmesi engellenmiş oluyor.
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// ‘message’ üzerine herhangi bir tuşa basılma olayına dinleyici eklenir ve eğer basılan tuş enter değilse sendTyping fonksiyonunu çağırır.
message.addEventListener("keypress", (event) => {
  if (event.key !== "Enter") {
    sendTyping();
  }
});

// Feedback adlı bir HTML elementinin içini boşaltır ve output adlı bir HTML elementinin içeriğine 
//server tarafından eklenen data nesnedinden alınan data.sender ve data.message eklenir.
socket.on("chat", (data) => {
  feedback.innerHTML = "";
  output.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
  message.value = "";
});

//Kullanıcı arayüzünde , belirli bir kişinin şu anda yazı yazma durumunda olduğunu gösteren 
//bir geri bildirim mesajı oluşturur.
socket.on("typing", (data) => {
  feedback.innerHTML = `${data.sender} yazıyor...`;
});

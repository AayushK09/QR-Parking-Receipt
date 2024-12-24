const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const qrcode = require("qrcode");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post("/book", async (req, res) => {
  const { name, phone, vehicle, entryTime } = req.body;
  const receiptNo = Math.floor(Math.random() * 10000);
  const entryTimeFormatted = new Date(entryTime).toLocaleString();

  const qrData = `Receipt No.: ${receiptNo}, Name: ${name}, Phone Number: ${phone}, Vehicle: ${vehicle}, Entry Time: ${entryTimeFormatted}`;
  const qrCodeDataURL = await generateQRCode(qrData);

  res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <p><strong>My Parking</strong></p>
            <p>DLF Noida</p>
            <p>Receipt No.: ${receiptNo}</p>
            <p>Name: ${name}</p>
            <p>Phone Number: ${phone}</p>
            <p>Vehicle: ${vehicle}</p>
            <p>Entry Time: ${entryTimeFormatted}</p>
            <p class="disclaimer"><strong>Disclaimer:</strong><br> Parking at own risk.<br> We do not take any responsibility<br> for the loss of valuables left in the vehicle.</p>
            <div id="qr-code" style="margin: 20px auto;">
                <img src="${qrCodeDataURL}" style="width: 200px; height: 200px; display: block;">
            </div>
            <p>DOWNLOAD MY PARKING APP</p>
            <p>TO BOOK YOUR PARKING SLOT IN ADVANCE</p>
            <button onclick="window.print()">Print Receipt</button>
        </div>
        <style>
            .disclaimer {
                width: 80%;
                margin: 0 auto;
                text-align: center;
            }  
        </style>
    `);
});

async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(data);
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

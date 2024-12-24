document
  .getElementById("booking-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const vehicle = document.getElementById("vehicle").value;
    const entryTime = document.getElementById("entry-time").value;
    const receiptNo = Math.floor(Math.random() * 10000);
    const entryTimeFormatted = new Date(entryTime).toLocaleString();

    const receiptDetails = `
        <p><strong>My Parking</strong></p>
        <p>DLF Noida</p>
        <p>Receipt No.: ${receiptNo}</p>
        <p>Name: ${name}</p>
        <p>Phone Number: ${phone}</p>
        <p>Vehicle: ${vehicle}</p>
        <p>Entry Time: ${entryTimeFormatted}</p>
        <p class="disclaimer"><strong>Disclaimer:</strong><br> Parking at own risk.<br> We do not take any responsibility<br> for the loss of valuables left in the vehicle.</p>
        <div id="qr-code-container" style="text-align: center; margin-top: 20px;">
            <canvas id="qr-code"></canvas>
        </div>
        <p>DOWNLOAD MY PARKING APP</p>
        <p>TO BOOK YOUR PARKING SLOT IN ADVANCE</p>
    `;

    document.getElementById("receipt-details").innerHTML = receiptDetails;

    const qrData = `Receipt No.: ${receiptNo}, Name: ${name}, Phone Number: ${phone}, Vehicle: ${vehicle}, Entry Time: ${entryTimeFormatted}`;
    QRCode.toCanvas(
      document.getElementById("qr-code"),
      qrData,
      function (error) {
        if (error) console.error(error);
      }
    );

    document.getElementById("receipt").classList.remove("hidden");
  });

function printReceipt() {
  const printContent = document
    .getElementById("receipt-content")
    .cloneNode(true);
  const qrCanvas = document
    .getElementById("qr-code-container")
    .querySelector("canvas");
  const qrImage = qrCanvas.toDataURL();

  const qrImageElem = document.createElement("img");
  qrImageElem.src = qrImage;
  qrImageElem.style.width = "200px";
  qrImageElem.style.height = "200px";
  qrImageElem.style.display = "block";
  qrImageElem.style.margin = "20px auto";

  const qrPlaceholderDiv = printContent.querySelector("#qr-code-container");
  qrPlaceholderDiv.innerHTML = "";
  qrPlaceholderDiv.appendChild(qrImageElem);

  const printWindow = window.open("", "", "height=600,width=800");
  printWindow.document.write("<html><head><title>Print Receipt</title>");
  printWindow.document.write(
    "<style>body { font-family: monospace; text-align: center; }</style>"
  );
  printWindow.document.write(
    "<style>@media print { #print-button,#download-pdf-button { display: none; } }</style>"
  );
  printWindow.document.write("</head><body>");
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.write(
    "<script>window.onload = function() { window.print(); }</script>"
  ); // Auto print after content load
  printWindow.document.write("</body></html>");
  printWindow.document.close();
}

function downloadPDF() {
  const receiptContent = document.getElementById("receipt-content");
  const printButton = document.getElementById("print-button");
  const downloadButton = document.getElementById("download-pdf-button");

  // Hide the buttons
  printButton.classList.add("hidden");
  downloadButton.classList.add("hidden");

  // Capture HTML content with higher resolution
  html2canvas(receiptContent, { scale: 3, logging: true, useCORS: true })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Convert canvas to JPEG format with maximum quality
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("receipt.pdf");

      // Show the buttons again after PDF generation
      printButton.classList.remove("hidden");
      downloadButton.classList.remove("hidden");
    })
    .catch((err) => {
      console.error("Error generating PDF:", err);
      // Show the buttons again in case of error
      printButton.classList.remove("hidden");
      downloadButton.classList.remove("hidden");
    });
}

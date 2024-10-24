// Listen to paste event to capture HTML content
document
  .getElementById("paste-area")
  .addEventListener("paste", function (event) {
    event.preventDefault();

    // Check if clipboard contains HTML
    const clipboardData = event.clipboardData || window.clipboardData;
    const htmlData = clipboardData.getData("text/html");
    const textData = clipboardData.getData("text/plain");

    if (htmlData) {
      document.getElementById("paste-area").innerHTML = htmlData;
    } else {
      document.getElementById("paste-area").innerText = textData;
    }
  });

function convertTableToMarkdown() {
  const pasteArea = document.getElementById("paste-area");

  // Create a temporary DOM element to hold the pasted content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = pasteArea.innerHTML;

  // Get all table elements from the pasted HTML
  const tables = tempDiv.querySelectorAll("table");

  if (tables.length === 0) {
    document.getElementById("output").textContent =
      "No table found. Please paste a valid HTML table.";
    document.getElementById("copy-button").style.display = "none";
    return;
  }

  let markdown = "";

  tables.forEach((table, tableIndex) => {
    if (tableIndex > 0) {
      markdown += "\n\n"; // Separate multiple tables with new lines
    }

    // Convert table rows into markdown format
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td, th");
      const markdownRow = Array.from(cells)
        .map((cell) => {
          let cellText = cell.textContent.trim();
          return cellText === "" ? "\\-" : cellText; // Handle empty cells
        })
        .join(" | ");
      markdown += `| ${markdownRow} |\n`;

      // After the first row (header), add a separator row
      if (rowIndex === 0) {
        const separator = Array.from(cells)
          .map(() => "---")
          .join(" | ");
        markdown += `| ${separator} |\n`;
      }
    });
  });

  // Display the generated markdown
  document.getElementById("output").textContent = markdown;

  // Show the copy button
  document.getElementById("copy-button").style.display = "inline-block";
}

function copyToClipboard() {
  // Copy the markdown output to the clipboard
  const outputElement = document.getElementById("output");
  const markdownText = outputElement.textContent;

  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = markdownText;
  document.body.appendChild(tempTextArea);

  tempTextArea.select();
  document.execCommand("copy");

  // Clean up temporary textarea
  document.body.removeChild(tempTextArea);

  alert("Markdown copied to clipboard!");
}

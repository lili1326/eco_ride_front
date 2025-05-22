 document.getElementById("debug-info").innerHTML = `
  <pre>
Token: ${localStorage.getItem("api_token")}
Role: ${getRole()}
Connected: ${isConnected()}
  </pre>
`;

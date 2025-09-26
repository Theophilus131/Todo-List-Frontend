 document.getElementById("registerForm").addEventListener("submit", async function(e) {
        e.preventDefault();

         const messageDiv = document.getElementById("registerMessage");
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        const payload = { name, email, password };

        try {
          const response = await fetch("http://localhost:8080/auth/registerUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const messageDiv = document.getElementById("registerMessage");
            messageDiv.textContent = "Registration successful! Redirecting to login...";
            messageDiv.style.color = "green";

            setTimeout(() => {
           window.location.href = "login.html";
            }, 2000);
            
          } else {
            const error = await response.json();
          messageDiv.textContent = " Registration failed: " + (error.message || "Unknown error");
            messageDiv.style.color = "red";
          }

        } catch (error) {
           console.error("Error:", error);
          messageDiv.textContent = " Something went wrong. Please try again.";
          messageDiv.style.color = "red";
        }
      });
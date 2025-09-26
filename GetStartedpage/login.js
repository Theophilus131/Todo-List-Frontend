
                 
                 
                 document.getElementById("loginForm").addEventListener("submit", async function (e) {
                      e.preventDefault();

                      const email = document.getElementById("email").value;
                      const password = document.getElementById("password").value;

                      const payload = { email, password };

                      try {
                        const response = await fetch("http://localhost:8080/auth/login", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                          const data = await response.json();
                          

                          localStorage.setItem("userEmail", email);
                          localStorage.setItem("userId", data.id);
                          alert("Login successful!");

                          
                          window.location.href = "taskDashboard.html"; // Redirect to task dashboard
                        } else {
                          const error = await response.json();
                          alert("Login failed: " + (error.message || "Invalid credentials"));
                        }
                      } catch (err) {
                        console.error("Error during login:", err);
                        alert("Something went wrong. Please try again.");
                      }
                    });
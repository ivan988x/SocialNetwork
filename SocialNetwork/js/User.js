class User {
  user_id = "";
  username = "";
  email = "";
  password = "";
  api_url = "https://62b8006f03c36cb9b7c0902d.mockapi.io";

  create() {
    let data = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    fetch(this.api_url + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        let session = new Session();
        session.user_id = data.id;
        session.startSession();

        window.location.href = "hexa.html";
      });
  }

  async get(user_id) {
    let api_url = this.api_url + "/users/" + user_id;

    let response = await fetch(api_url);
    let data = await response.json();

    return data;
  }

  edit() {
    let data = {
      username: this.username,
      email: this.email,
    };

    let session = new Session();
    session_id = session.getSession();

    fetch(this.api_url + "/users/" + session_id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = "hexa.html";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  login() {
    fetch(this.api_url + "/users")
      .then((response) => response.json())
      .then((data) => {
        let login_successful = 0;
        data.forEach((db_user) => {
          if (
            db_user.email === this.email &&
            db_user.password === this.password
          ) {
            let session = new Session();
            session.user_id = db_user.id;
            session.startSession();
            login_successful = 1;
            window.location.href = "hexa.html";
          }
        });

        if (login_successful === 0) {
          alert("Pogrešan email ili lozinka");
        }
      });
  }

  delete() {
    let session = new Session();
    session_id = session.getSession();

    fetch(this.api_url + "/users/" + session_id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        let session = new Session();
        session.destroySession();

        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

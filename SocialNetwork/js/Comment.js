class Comment {
  post_id = "";
  user_id = "";
  content = "";
  username = "";
  id = "";
  comment_likes = "";
  api_url = "https://62b8006f03c36cb9b7c0902d.mockapi.io";

  create() {
    let data = {
      post_id: this.post_id,
      user_id: this.user_id,
      content: this.content,
      username: this.username,
      id: this.id,
      comment_likes: this.comment_likes,
    };

    fetch(this.api_url + "/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("postavljeno");
      });
  }
  async get(post_id) {
    let api_url = this.api_url + "/comments";

    const response = await fetch(api_url);
    const data = await response.json();
    let post_comments = [];

    let i = 0;
    data.forEach((item) => {
      if (item.post_id === post_id) {
        post_comments[i] = item;
        i++;
      }
    });

    return post_comments;
  }

  likes(post_id, comment_likes) {
    let data = {
      comment_likes: comment_likes,
    };

    fetch(this.api_url + "/comments/" + post_id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {});
  }

  deleteComm(id) {
    fetch(this.api_url + "/comments/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("komentar obrisan");
      });
  }
}

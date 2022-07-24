let session = new Session();
session_id = session.getSession();

if (session_id !== "") {
  async function populateUserData() {
    let user = new User();
    user = await user.get(session_id);

    document.querySelector("#username").innerText = user["username"];
    document.querySelector("#email").innerText = user["email"];

    document.querySelector("#korisnicko_ime").value = user["username"];
    document.querySelector("#edit_email").value = user["email"];
  }

  populateUserData();
} else {
  window.location.href = "/";
}

document.querySelector("#logout").addEventListener("click", (e) => {
  e.preventDefault();

  session.destroySession();
  window.location.href = "/";
});

document.querySelector("#editAccount").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "block";
});

document.querySelector("#closeModal").addEventListener("click", () => {
  document.querySelector(".custom-modal").style.display = "none";
});

document.querySelector("#editForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let user = new User();
  user.username = document.querySelector("#korisnicko_ime").value;
  user.email = document.querySelector("#edit_email").value;

  user.edit();
});

document.querySelector("#deleteProfile").addEventListener("click", (e) => {
  e.preventDefault();

  let text = "Da li ste sigurn da želite da obrišete profil?";

  if (confirm(text) === true) {
    let user = new User();
    user.delete();
  }
});

document.querySelector("#postForm").addEventListener("submit", (e) => {
  e.preventDefault();

  async function createPost() {
    let content = document.querySelector("#postContent").value;
    document.querySelector("#postContent").value = "";
    let post = new Post();
    post.post_content = content;
    post = await post.create();

    let current_user = new User();
    current_user = await current_user.get(session_id);

    let html = document.querySelector("#allPostsWrapper").innerHTML;

    let delete_post_html = "";

    if (session_id === post.user_id) {
      delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`;
    }

    document.querySelector("#allPostsWrapper").innerHTML =
      `<div class="single-post" data-post_id="${post.id}">
                                                              <div class="post-content">${post.content}</div>
                                                              
                                                              <div class="post-actions">
                                                                <p><b>Autor:</b> ${current_user.username}</p>
                                                                <div>
                                                                  <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
                                                                  <button class="comment-btn" onclick="commentPost(this)">Comments</button>
                                                                  ${delete_post_html}
                                                                </div>
                                                              </div>
                                                                
                                                              <div class="post-comments">
                                                              <form>
                                                                <input placeholder="Napiši komentar..." type="text">
                                                                <button onclick="commentPostSubmit(event)">Comment</button>
                                                              </form>
                                                            </div> 
                                                            </div>
                                                            ` + html;
  }

  createPost();
});

async function getAllPosts() {
  let all_posts = new Post();
  all_posts = await all_posts.getAllPosts();

  all_posts.forEach((post) => {
    async function getPostUser() {
      let user = new User();
      user = await user.get(post.user_id);

      let comments = new Comment();
      comments = await comments.get(post.id);

      let comment_user = document.querySelector("#username").innerHTML;

      let comments_html = "";

      if (comments.length >= 0) {
        comments.forEach((comment) => {
          let delete_comment = "";
          if (session_id === comment.user_id) {
            delete_comment = `<button class="button-delete" onclick="removeMyComment(this)">X</button>`;
          }

          let like_comment = "";

          if (session_id !== comment.user_id || comment.comment_likes >= 0) {
            like_comment = ` <button onclick="likeComment(this)" class="likeCommentJS"><span>${comment.comment_likes}</span> Likes</button>`;
          }

          comments_html += `<div class="comment" data-comment-id="${comment.id}"><div class="user-comment"><p>${comment.username}</p></div> <div class="single-comment" >${comment.content} <div class="likesCom"> <div>
         ${like_comment}
          ${delete_comment}
        
        </div></div></div></div>`;

          //console.log(post.user_id);
          console.log(comment.comment_likes);
        });
      }

      let html = document.querySelector("#allPostsWrapper").innerHTML;

      let delete_post_html = "";

      if (session_id === post.user_id) {
        delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`;
      }

      document.querySelector("#allPostsWrapper").innerHTML =
        `<div class="single-post" data-post_id="${post.id}">
      <div class="post-content">${post.content}</div>
      
      <div class="post-actions">
        <p><b>Autor:</b> ${user.username}</p>
        <div>
          <button onclick="likePost(this)" class="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
          <button class="comment-btn" onclick="commentPost(this)">Comments</button>
          ${delete_post_html}
        </div>
      </div>
        
      <div class="post-comments">
      <form>
        <input placeholder="Napiši komentar..." type="text">
        <button onclick="commentPostSubmit(event)">Comment</button>
      </form>
      ${comments_html}
      
    </div> 
    </div>
    
    
    ` + html;

      //console.log(post.likes);
    }

    getPostUser();
  });
}

getAllPosts();

const commentPostSubmit = (e) => {
  e.preventDefault();

  let btn = e.target;
  btn.setAttribute("disabled", "true");

  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");

  let html = main_post_el.querySelector(".post-comments").innerHTML;

  let comment_value = main_post_el.querySelector("input").value;

  let comment_user = document.querySelector("#username").innerHTML;

  let delete_post_comment = document.querySelector(".remove-btn");

  delete_post_comment = `<button class="remove-btn" onclick="removeMyPost(this)">Delete</button>`;

  main_post_el.querySelector(
    ".post-comments"
  ).innerHTML += `<div class="comment"><div class="user-comment">${comment_user}</div> <div class="single-comment">${comment_value}</div></div>`;

  let comment = new Comment();
  comment.content = comment_value;
  comment.username = comment_user;
  comment.user_id = session_id;
  comment.post_id = post_id;

  comment.create();
};

const removeMyPost = (btn) => {
  let post_id = btn.closest(".single-post").getAttribute("data-post_id");

  btn.closest(".single-post").remove();
  console.log(post_id);
  let post = new Post();
  post.delete(post_id);
};

const removeMyComment = (btn) => {
  let comment_delete = btn.closest(".comment").getAttribute("data-comment-id");

  btn.closest(".comment").remove();
  console.log(comment_delete);

  let com = new Comment();
  com.deleteComm(comment_delete);
};

const likePost = (btn) => {
  let main_post_el = btn.closest(".single-post");
  let post_id = btn.closest(".single-post").getAttribute("data-post_id");
  let number_of_likes = parseInt(btn.querySelector("span").innerText);

  btn.querySelector("span").innerText = number_of_likes + 1;
  btn.setAttribute("disabled", true);

  let post = new Post();
  post.like(post_id, number_of_likes + 1);
};

const likeComment = (btn) => {
  let main_comment_el = btn.closest(".comment");
  let comment_id = btn.closest(".comment").getAttribute("data-comment-id");
  let number_of_comment_likes = parseInt(btn.querySelector("span").innerText);

  btn.querySelector("span").innerText = number_of_comment_likes + 1;
  btn.setAttribute("disabled", true);

  let comment = new Comment();
  comment.likes(comment_id, number_of_comment_likes + 1);
};

const commentPost = (btn) => {
  let main_post_el = btn.closest(".single-post");
  let post_id = main_post_el.getAttribute("data-post_id");

  content = main_post_el.querySelector(".post-comments");

  content.style.display = (content.dataset.toggled ^= 1) ? "block" : "none";
};

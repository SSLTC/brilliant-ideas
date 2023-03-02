(async () => {
  const response = await fetch("http://localhost:3000/show-ideas");
  const data = await response.json();
  showIdeas(data);
})();

const showIdeas = (ideas) => {
  ideas.forEach((idea) => {
    const elDiv = document.createElement("div");
    const elH2 = document.createElement("h2");
    elH2.innerText = idea.title;
    const elParagraph = document.createElement("p");
    elParagraph.innerText = idea.description;
    const elButtonUpdate = document.createElement("button");
    elButtonUpdate.innerText = "Update";
    elButtonUpdate.setAttribute("value", idea.id);
    elButtonUpdate.addEventListener("click", updateIdea);
    const elButtonDelete = document.createElement("button");
    elButtonDelete.innerText = "Delete";
    elButtonDelete.setAttribute("value", idea.id);
    elButtonDelete.addEventListener("click", deleteIdea);
    elDiv.append(elH2, elParagraph, elButtonUpdate, elButtonDelete);
    document.body.appendChild(elDiv);
  });
};

const goto = (event) => {
  window.location.href = "./create.html";
};

const elButtonAdd = document.querySelector("#addIdea");
elButtonAdd.addEventListener("click", goto);

const updateIdea = async (event) => {
  location.href = "./create.html?action=update&id=" + event.target.value;
};

const deleteIdea = async (event) => {
  let userConfirm = confirm(
    "Are you sure to delete " + event.target.parentNode.firstChild.innerText
  );
  if (userConfirm) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: event.target.value,
      }),
    };

    const response = await fetch("http://localhost:3000/delete-idea", options);
    // const data = await response.json();
    location.reload();
  }
};

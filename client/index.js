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
    const elButtonDelete = document.createElement("button");
    elButtonDelete.innerText = "Delete";
    elButtonDelete.setAttribute("value", idea.id);
    elButtonDelete.addEventListener("click", deleteIdea);
    elDiv.append(elH2, elParagraph, elButtonDelete);
    document.body.appendChild(elDiv);
  });
};

const goto = (event) => {
  window.location.href = "./create.html";
};

const elButtonAdd = document.querySelector("#addIdea");
elButtonAdd.addEventListener("click", goto);

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
    const data = await response.json();
  }
};

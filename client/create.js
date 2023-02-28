const addIdea = async (event) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.querySelector("#title").value,
      description: document.querySelector("#description").value,
    }),
  };
  const response = await fetch("http://localhost:3000/new-idea", options);
  const data = await response.json();
};

const elButtonAdd = document.querySelector("#addIdea");
elButtonAdd.addEventListener("click", addIdea);

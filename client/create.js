const params = new URL(location.href).searchParams;

const addIdea = async (event) => {
  const elTitle = document.querySelector("#title");
  const elDescription = document.querySelector("#description");
  let action = "new";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: elTitle.value,
      description: elDescription.value,
      id: params.get("id"),
    }),
  };

  if (params.get("action") == "update") {
    action = "update";
  }

  const response = await fetch(`http://localhost:3000/${action}-idea`, options);
  const data = await response.json();

  if (typeof data.err != "undefined") {
    document.querySelector("#validation").innerText = data.err;
  } else {
    location.replace("./");
  }
};

const elButtonAdd = document.querySelector("#addIdea");
elButtonAdd.addEventListener("click", addIdea);

if (params.get("action") == "update") {
  document.querySelector("h1").innerText = "Update Idea";
  document.querySelector("#addIdea").value = "Update";

  (async () => {
    const response = await fetch(
      `http://localhost:3000/show-idea?id=${params.get("id")}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    document.querySelector("#title").value = data[0].title;
    document.querySelector("#description").value = data[0].description;
  })();
}

const params = new URL(location.href).searchParams;

if (params.get("action") == "update") {
  document.querySelector("title").innerText = "Update Brilliant Idea";
  document.querySelector("#pageHeader").innerText = "Update Idea";
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

const brilliantIdea = async (action = "new") => {
  const elTitle = document.querySelector("#title");
  const elDescription = document.querySelector("#description");
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

  const response = await fetch(`http://localhost:3000/${action}-idea`, options);
  const data = await response.json();

  if (typeof data.err != "undefined") {
    document.querySelector("#validation").innerText = data.err;
  } else {
    showIdeas();
  }
};

const showIdeas = () => {
  if (typeof params.get("id") == null) {
    location.replace("../");
  } else {
    location.replace("../#" + params.get("id"));
  }
};

const elButtonAdd = document.querySelector("#addIdea");
elButtonAdd.addEventListener("click", () => {
  if (params.get("action") == "update") {
    brilliantIdea("update");
  } else {
    brilliantIdea();
  }
});

const elButtonCancel = document.querySelector("#cancel");
elButtonCancel.addEventListener("click", () => {
  showIdeas();
});

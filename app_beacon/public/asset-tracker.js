const fromDate = new Date();
let timeSpent = 0;
const  url = new URL(window.location.href);
let id = url.searchParams.get("id");
// if id not found, we presume it is the first image
if (id === null) {
    id = 1;
}
else {
    id = parseInt(id);


updateTime();

const img = document.createElement("img")
img.src = `${url.origin}/img/${id}.png`   
img.style.width="500px";
img.style.height="450px"
document.body.appendChild(img);

document.body.appendChild(document.createElement("br"))

const next = document.createElement("a");
next.href = `http://localhost:8080/?id=${id+1}`
next.textContent = "Next"

const prev = document.createElement("a");
prev.href = `http://localhost:8080/?id=${id-1}`
prev.textContent = "Prev"


document.body.appendChild(next);
document.body.appendChild(document.createElement("br"))

document.body.appendChild(prev);

function updateTime()
{
    const toDate = new Date();
    timeSpent = toDate.getTime() - fromDate.getTime();
    document.getElementById("lblTime").textContent = timeSpent + "ms"
    setTimeout(updateTime, 100)
} 

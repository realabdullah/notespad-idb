const Note = {
    notes: [],

    addNote: (note) => {
        Note.notes.push(note);
    },

    getNotes: () => {
        return Note.notes;
    },

    removeNote: (index) => {
        Note.notes.splice(index, 1);
    },
};

const deleteNoteBtns = () => {
    const deleteBtns = document.querySelectorAll(".delete");
    deleteBtns.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            Note.removeNote(index);
            btn.parentElement.remove();
        });
    });
}

window.addEventListener("load", () => {
    const saveBtn = document.querySelector("#save");
    const input = document.querySelector("textarea");
    const ul = document.querySelector("ul");
    const noteHeading = document.querySelector("h2");

    saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!input.value.trim()) return;

        const note = input.value;
        Note.addNote(note);

        if (Note.getNotes().length > 0) {
            noteHeading.innerHTML = "Notes";
        }

        const li = document.createElement("li");
        const p = document.createElement("p");
        const deleteBtn = document.createElement("button");

        li.classList.add("note");
        deleteBtn.classList.add("delete");

        p.innerHTML = note;
        deleteBtn.innerHTML = "Delete";

        ul.appendChild(li);
        li.appendChild(p);
        li.appendChild(deleteBtn);

        // add event listener to delete button
        deleteNoteBtns();

        input.value = "";
    });

    deleteNoteBtns();
});
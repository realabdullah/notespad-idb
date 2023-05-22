const Note = {
    addNote: async (note) => {
        // add note to indexedDB
        const db = await Note.openDB();
        const notes = await Note.getNotes();
        const noteInput = {
            id: notes ? notes.length + 1 : 1,
            note,
        }
        await db.add("notes", noteInput);
    },

    getNotes: async () => {
        const db = await Note.openDB();
        const notes = await db.getAll("notes");
        if (notes) {
            return notes;
        }
        return [];
    },

    removeNote: async (index) => {
        const db = await Note.openDB();
        const notes = await db.getAll("notes");
        if (notes) {
            await db.delete("notes", index + 1);
            if (notes.length === 1) {
                const noteHeading = document.querySelector("h2");
                noteHeading.innerHTML = "No Notes";
            }
        }
    },

    openDB: async () => {
        return await idb.openDB("notesDB", 1, {
            async upgrade(db) {
                if (!db.objectStoreNames.contains("notes")) {
                    const dbStore = await db.createObjectStore("notes", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    dbStore.createIndex("note", "note", { unique: false });
                }
            }
        });
    },

    renderNotes: async () => {
        const notes = await Note.getNotes();
        const ul = document.querySelector("ul");
        const noteHeading = document.querySelector("h2");

        if (notes.length > 0) {
            noteHeading.innerHTML = "Notes";
        }

        notes.forEach((note, index) => {
            const li = document.createElement("li");
            const p = document.createElement("p");
            const deleteBtn = document.createElement("button");

            li.classList.add("note");
            deleteBtn.classList.add("delete");

            p.innerHTML = note.note;
            deleteBtn.innerHTML = "Delete";

            ul.appendChild(li);
            li.appendChild(p);
            li.appendChild(deleteBtn);

            // add event listener to delete button
            deleteNoteBtns();
        });
    }
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

    saveBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!input.value.trim()) return;

        const note = input.value;
        await Note.addNote(note);

        const notes = await Note.getNotes();

        if (notes.length > 0) {
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

    // render notes on page load
    Note.renderNotes();

    // add event listener to delete buttons
    deleteNoteBtns();
});
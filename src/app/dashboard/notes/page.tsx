"use client";
import { useEffect, useState } from "react";
import "./notes.css";

export default function NotesPage() {

    const [note, setNote]= useState("");
    const [summary, setSummary]= useState("");
    const [notes, setNotes] = useState<
  { id: string; text: string; summary: string }[]
>([]);

    useEffect(() => {
      const saved= localStorage.getItem("myNotes");
      if(saved) {
        setNotes(JSON.parse(saved));
      }
    }, [])
    
    

    function addNote() {
        if(note.trim() === "") return;

        const newNote = {
            id: Date.now().toString(),
            text: note,
            summary: "",
        };

        setNotes([...notes, newNote]);
        setNote("");
    }

    function deleteBtn(id: string) {
        const updatedNotes= notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
    }

   async function handleSummarise(id: string, text: string) {
  if (text.trim() === "") return;

  try {
    const res = await fetch("/api/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    const updatedNotes = notes.map((item) => {
      if (item.id===id) {
        return{
          ...item, summary: data.summary
        };
      }
      return item;
    });

    setNotes(updatedNotes);

  } catch (error) {
    console.log(error);
    setSummary("Error aa gaya");
  }
}
    
    useEffect(() => {
      localStorage.setItem("myNotes", JSON.stringify(notes))
    }, [notes])
    
    return(
        <div className="container">
            <div className="card">
               <h1>Notes Page</h1>

            <input className="input" 
            type="text"
            value={note}
            onChange={(e)=> setNote(e.target.value)}
            onKeyDown={(e)=> {
              if (e.key==="Enter") addNote();
            }}
            placeholder="Write something meaningful..."
            />

            <br />

            <button className="btn" onClick={addNote}>
                Add Note
             </button>

             <ul className="noteslist">
                {notes.map((item) => (
                    <li key={item.id} className="noteItem">{item.text}

                    <button className="summaryBtn" onClick={()=> handleSummarise(item.id, item.text)}>
                      Summarise
                    </button>

                    {item.summary && (
                      <p className="summary">Summary:{item.summary}</p>
                    )}

                    <button className="deleteBtn" onClick={()=> deleteBtn(item.id)}>Delete</button>
                    </li>
                ))}
             </ul>
            </div>

            
        </div>
    )
}
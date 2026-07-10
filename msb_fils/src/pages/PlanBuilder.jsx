import { useState } from "react";
import "../CSS/PlanBuilder.css";

import {
    MousePointer2,
    Square,
    DoorOpen,
    RectangleHorizontal,
    Ruler,
    Type,
    Trash2,
    Save,
    FileDown,
    Box,
    Undo2,
    Redo2
} from "lucide-react";

import {Stage, Layer, Rect} from 'react-konva';

function PlanBuilder() {

    const [tool, setTool] = useState("select");

    const [selectedObject, setSelectedObject] = useState(null);

    const [objects, setObjects] = useState([]);

    const handleStageClick = (e) => {

        if (tool === "select") return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        const newObject = {
            id: Date.now(),
            type: tool,
            x: pos.x,
            y: pos.y,
            width: 120,
            height: 20
        };

        setObjects(prev => [...prev, newObject]);
    };

    return (

        <div className="planBuilder">

            {/* HEADER */}

            <header className="planHeader">

                <div>

                    <h2>Création d'un plan de bâtiment</h2>

                    <small>Projet : Villa Duplex</small>

                </div>

                <div className="headerButtons">

                    <button>

                        <Undo2 size={18}/>

                        Annuler

                    </button>

                    <button>

                        <Redo2 size={18}/>

                        Refaire

                    </button>

                    <button>

                        <Save size={18}/>

                        Enregistrer

                    </button>

                    <button>

                        <FileDown size={18}/>

                        Export PDF

                    </button>

                </div>

            </header>

            {/* CONTENU */}

            <div className="planContent">

                {/* BARRE OUTILS */}

                <aside className="toolbar">

                    <button
                        className={tool==="select" ? "activeTool" : ""}
                        onClick={()=>setTool("select")}
                    >
                        <MousePointer2/>
                        Sélection
                    </button>

                    <button
                        className={tool==="wall" ? "activeTool" : ""}
                        onClick={()=>setTool("wall")}
                    >
                        <Square/>
                        Mur
                    </button>

                    <button
                        className={tool==="door" ? "activeTool" : ""}
                        onClick={()=>setTool("door")}
                    >
                        <DoorOpen/>
                        Porte
                    </button>

                    <button
                        className={tool==="window" ? "activeTool" : ""}
                        onClick={()=>setTool("window")}
                    >
                        <RectangleHorizontal/>
                        Fenêtre
                    </button>

                    <button
                        className={tool==="measure" ? "activeTool" : ""}
                        onClick={()=>setTool("measure")}
                    >
                        <Ruler/>
                        Mesure
                    </button>

                    <button
                        className={tool==="text" ? "activeTool" : ""}
                        onClick={()=>setTool("text")}
                    >
                        <Type/>
                        Texte
                    </button>

                    <button
                        className={tool==="delete" ? "activeTool" : ""}
                        onClick={()=>setTool("delete")}
                    >
                        <Trash2/>
                        Supprimer
                    </button>

                </aside>

                {/* CANVAS */}

                <section className="canvasContainer">

                    <div className="canvas">

                        <div className="grid_canvas">

                            <Stage
                                width={1000}
                                height={700}
                                onMouseDown={handleStageClick}
                            >

                                <Layer>

                                    {objects.map(obj => (

                                        <Rect
                                            key={obj.id}

                                            x={obj.x}
                                            y={obj.y}

                                            width={obj.width}
                                            height={obj.height}

                                            fill={
                                                obj.type === "wall"
                                                    ? "#555"
                                                    : obj.type === "window"
                                                    ? "#4FC3F7"
                                                    : "#8BC34A"
                                            }

                                            draggable

                                            onDragEnd={(e)=>{

                                                setObjects(prev=>

                                                    prev.map(o=>

                                                        o.id===obj.id

                                                        ?{
                                                            ...o,
                                                            x:e.target.x(),
                                                            y:e.target.y()
                                                        }

                                                        :o

                                                    )

                                                );

                                            }}

                                        />

                                    ))}


                                </Layer>

                            </Stage>

                        </div>

                    </div>

                </section>

                {/* PROPRIETES */}

                <aside className="properties">

                    <h3>Propriétés</h3>

                    <label>

                        Longueur

                        <input type="number"/>

                    </label>

                    <label>

                        Largeur

                        <input type="number"/>

                    </label>

                    <label>

                        Hauteur

                        <input type="number"/>

                    </label>

                    <label>

                        Epaisseur

                        <input type="number"/>

                    </label>

                    <label>

                        Matériau

                        <select>

                            <option>Béton</option>

                            <option>Brique</option>

                            <option>Bois</option>

                            <option>Acier</option>

                        </select>

                    </label>

                </aside>

            </div>

            {/* BAS */}

            <footer className="bottomBar">

                <div>

                    <Box/>

                    Surface

                    <strong>125 m²</strong>

                </div>

                <div>

                    Béton

                    <strong>18 m³</strong>

                </div>

                <div>

                    Briques

                    <strong>3500</strong>

                </div>

                <div>

                    Fer

                    <strong>2.8 T</strong>

                </div>

                <div>

                    Coût estimé

                    <strong>48 200 €</strong>

                </div>

            </footer>

        </div>

    );

}

export default PlanBuilder;
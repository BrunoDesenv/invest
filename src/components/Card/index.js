import React from "react";

import './style.css';

const Card = ({ essencial, categoria, classCol, classBorderLeft, calssRow, classComment}) => {
    return(
    // <div className="container-dash">
        <div className={`col-xl-3 ${classCol? classCol : '' }`} >
            <div className={`card border-left-${classBorderLeft}`} >
                <div className="card-body">
                    <div className={`row ${calssRow? calssRow : '' }`} >
                        <div className="col mr-2">
                             <div className="text-xs">
                             {categoria}</div>
                            <div className="h5">R$ {Number(essencial).toFixed(2).replace('.', ',')}</div>
                        </div>
                            <div className="col-auto">
                                <i className={`fas ${classComment}`}></i>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    // {/* </div> */}
)
}

export default Card;
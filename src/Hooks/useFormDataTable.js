import { useState } from "react";

const useFormDataTable = (inicializador) => {
    const [form, setForm] = useState(inicializador)

    const handleInputChange = (event)=>{
        const {rowData, field } = event

        // setForm({...form, [field]: value })
    }

    const clear = () =>{
        setForm(inicializador)
    }

    return [form, handleInputChange, clear ]
}

export default useFormDataTable
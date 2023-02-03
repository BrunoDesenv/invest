import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

export const bodyTemplateListByLabel = (rowData, fielName, lista) => {
    return getLabel(rowData[fielName], lista)
}

const getLabel = (status, lista) => {
    let result = "NA"
    lista.forEach((elemento, index)=>{
        if(elemento.label === status){
            result = status
        }
    })
    return result
}

export const bodyTemplateListByValue =(rowData, fieldName, lista) =>{
    return getValue(rowData[fieldName], lista)
}

const getValue =(status, lista)=>{
    let result = "NA"
    lista.forEach((elemento, index)=>{
        if(elemento.value.toString() === status){
            result = elemento.label
        }
    })
    return result
}

export const listTemplateEdit = (options, lista, placeholder) => {
    return (
        <Dropdown value={options.value} options={lista} optionLabel="label" optionValue="value"
            onChange={(e) => options.editorCallback(e.value)} placeholder={placeholder}
            itemTemplate={(option) => {
                return <span className={`product-badge status-${option.value.toString()}`}>{option.label}</span>
            }} />
    );
}

export const textTemplateEditor = (options) => {       

    return <InputText type="text" value={options.value} onChange={(e) => { 
        options.editorCallback(e.target.value)    
    }} />;
}
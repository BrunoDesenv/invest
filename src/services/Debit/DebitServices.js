export const listTipoConta = [
    {label: 'Fixo', value: 0},
    {label: 'Variavel', value: 1},
    {label: 'Parcelado', value: 2}
]

export const _listCategoria = [
    { value: 1, label: 'Casa' },
    { value: 2, label: 'Investimentos' },
    { value: 3, label: 'Responsabilidade' },
    { value: 4, label: 'Pessoal' },
    { value: 5, label: 'Dívida' }, 
    { value: 6, label: 'Pet' }, 

  ];

  export const _listSituacao = [
    { value: 1, label: 'Pago' },
    { value: 2, label: 'Pendente' },
    { value: 3, label: 'Atrasado' }
]


export const onRowEditComplete = (rowEdit) =>{
    const {newData, index } = rowEdit
    console.log(rowEdit);
}
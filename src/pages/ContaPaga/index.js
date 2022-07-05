import { useEffect, useContext, useState } from 'react'
import Title from '../../components/Title'
import { FiShoppingCart } from 'react-icons/fi'
import { DebitosContext } from '../../contexts/debitos';

function ContaPaga() {

  const CarregandoInfo = 0;
  const TokenInvalido = 1;
  const PagamentoEfetuado = 2;
  const PagamentoPendente = 3;
  const PagamentoFalha = 4;

  const { debitos, getDebitoByToken, payDebito } = useContext(DebitosContext);
  const [status, setStatus] = useState(CarregandoInfo);

  useEffect(() => {
    let token = window.location.pathname.split('/')[2];
    getDebitoByToken(token);
  }, []);

  useEffect(() => {
    const statusCTX = ValidaSePodePagar();
    if(statusCTX == PagamentoPendente){
      const pagoComSucesso = payDebito(debitos.key);
      if(pagoComSucesso) {
        setStatus(PagamentoPendente);
        return;
      }
      setStatus(PagamentoFalha);
    };
  }, [debitos]);

  function ValidaSePodePagar(){
    if(debitos.length === 0 || debitos === undefined){
      setStatus(TokenInvalido);
      return TokenInvalido;
    }
  
    if(debitos.situacao === 'Pago'){
      setStatus(PagamentoEfetuado);
      return PagamentoEfetuado;
    }
    return PagamentoPendente;
  }

  return (
    <div className="App">
      {status === CarregandoInfo &&
        <div className="content">
          <Title nome="Conta Paga">
            <FiShoppingCart size={25} />
          </Title>
          Aguarde....
        </div>
      }
      {status === PagamentoPendente &&
        <div className="content">
          <Title nome="Conta Paga">
            <FiShoppingCart size={25} />
          </Title>
          Pagamento realizado com sucesso.
        </div>
      }
      {status === TokenInvalido &&
        <div className="content">
            <Title nome="Conta Paga">
              <FiShoppingCart size={25} />
            </Title>
            Token inválido, aqui hacker não cola.
          </div>
      }
      {status === PagamentoEfetuado &&
        <div className="content">
            <Title nome="Conta Paga">
              <FiShoppingCart size={25} />
            </Title>
            Pagamento já consta em nosso sistema como pago.
          </div>
      }
      {status === PagamentoFalha &&
        <div className="content">
            <Title nome="Conta Paga">
              <FiShoppingCart size={25} />
            </Title>
            O pagamento apresentou problemas, entrar em contato com o suporte.
          </div>
      }

    </div>
  );
}

export default ContaPaga;

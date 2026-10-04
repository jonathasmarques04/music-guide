import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';

// Serializa gravações da mesma conta, inclusive entre remontagens.
const gravacoes = new Map<string, Promise<void>>();
const ERRO_LOCAL = 'Não foi possível salvar neste aparelho. Mantenha o app aberto e tente novamente.';

export function useEstadoLocal<T>(chave: string, inicial: T, validar: (valor: unknown) => T) {
  const [estado, setEstado] = useState(inicial);
  const atual = useRef(inicial);
  const ativo = useRef(false);
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  useEffect(() => {
    ativo.current = true;
    let cancelado = false;
    (async () => {
      try {
        await gravacoes.get(chave);
        const salvo = await AsyncStorage.getItem(chave);
        const valor = salvo ? validar(JSON.parse(salvo)) : inicial;
        if (cancelado) return;
        atual.current = valor;
        setEstado(valor);
      } catch {
        if (!cancelado) setErro(ERRO_LOCAL);
      } finally {
        if (!cancelado) setPronto(true);
      }
    })();
    return () => { cancelado = true; ativo.current = false; };
  }, [chave, inicial, validar]);
  const atualizar = (transformar: (valor: T) => T) => {
    if (!ativo.current) return;
    const proximo = transformar(atual.current);
    atual.current = proximo;
    setEstado(proximo);
    const texto = JSON.stringify(proximo);
    const gravacao = (gravacoes.get(chave) ?? Promise.resolve())
      .then(() => AsyncStorage.setItem(chave, texto))
      .then(() => { if (ativo.current) setErro(null); })
      .catch(() => { if (ativo.current) setErro(ERRO_LOCAL); });
    gravacoes.set(chave, gravacao);
    void gravacao.then(() => {
      if (gravacoes.get(chave) === gravacao) gravacoes.delete(chave);
    });
  };
  return { estado, atual, pronto, erro, atualizar, ativo };
}
